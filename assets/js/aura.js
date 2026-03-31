/* ═══════════════════════════════════════════════════════════════════
   NinjaAura — Standalone Ki-Energy Aura Engine  v1.0
   Part of NinjaApp / StudentNinja  ©  Ninja Holdings Ltd

   Reusable canvas-based aura system. Drop onto any NinjaApp screen.

   USAGE
   ─────
     <canvas id="aura-canvas"
       style="position:absolute;inset:0;pointer-events:none;z-index:0;">
     </canvas>
     <script src="../assets/js/aura.js"></script>
     <script>
       NinjaAura.init({
         canvasId:    'aura-canvas',
         frameId:     'frame',
         charWrapSel: '.char-wrap',
       });
       NinjaAura.start(2, 60);   // stage index 0–12, xp 0–100
     </script>

   PUBLIC API
   ──────────
     NinjaAura.init(options)           attach to DOM elements
     NinjaAura.start(stageIndex, xp)   start / restart animation
     NinjaAura.setQuality(q)           0 Reduced · 1 Standard · 2 Enhanced
     NinjaAura.triggerLevelUp()        fire cinematic level-up transition
     NinjaAura.resize()                call after layout change / device switch
     NinjaAura.auraDensity(xp, i)      density formula (for readouts)
     NinjaAura.STAGES                  [ { name, rgb } ] stage descriptors
     NinjaAura.Q_REDUCED / Q_STANDARD / Q_ENHANCED
     NinjaAura.currentStage            current stage index (read-only)
     NinjaAura.currentXP               current XP value (read-only)

   CALLBACKS  (pass in options object)
   ─────────
     onSurge(surge, xp, stageIndex, stage)
         Called each frame when surge state changes.
         surge = bool; stage = { name, rgb }.

     onLevelUpStart(fromStage, toStage)
         Called the moment a level-up transition is triggered.

     onLevelUpStage(newStageIndex)
         Called at the mid-point (600 ms) when the stage index flips.

     onLevelUpEnd(newStageIndex)
         Called when the full transition settles (1 400 ms).

   SAFARI COMPATIBILITY
   ────────────────────
     OffscreenCanvas and ctx.filter are unreliable before Safari 18.
     This engine detects support via a pixel-level render test at startup
     and falls back to shadowBlur + shadowOffsetX when needed.

   ═══════════════════════════════════════════════════════════════════ */

(function (global) {
  'use strict';

  /* ── Safari-compatible filter detection (run once at startup) ──────
     Safari may accept ctx.filter assignments but silently ignore them
     at render time.  Draw a 1 px dot with blur(6px) and check whether
     colour has spread to a pixel 10 px away.  Only then is blur real. */
  var _canvasFilterSupported = (function () {
    try {
      var t = document.createElement('canvas');
      t.width = 30; t.height = 30;
      var c = t.getContext('2d');
      c.filter = 'blur(6px)';
      if (c.filter !== 'blur(6px)') return false;
      c.fillStyle = 'rgba(255,0,0,1)';
      c.fillRect(15, 15, 1, 1);
      var d = c.getImageData(0, 0, 30, 30).data;
      return d[4 * (15 * 30 + 5)] > 5;   /* red channel 10 px left of dot */
    } catch (e) { return false; }
  }());

  /* ── _blurCanvas ────────────────────────────────────────────────────
     Returns an offscreen HTMLCanvasElement with a soft-blurred filled
     path drawn on it.
       w, h       — canvas dimensions in px
       blurPx     — desired blur radius in px
       fillColor  — CSS colour string e.g. 'rgb(240,208,96)'
       pathFn(ctx)— caller builds the path on ctx (beginPath…closePath)
                    DO NOT call fill() — this helper does that.          */
  function _blurCanvas(w, h, blurPx, fillColor, pathFn) {
    var off = document.createElement('canvas');
    off.width = w; off.height = h;
    var ctx = off.getContext('2d');
    if (_canvasFilterSupported) {
      ctx.filter    = 'blur(' + blurPx + 'px)';
      ctx.fillStyle = fillColor;
      pathFn(ctx);
      ctx.fill();
    } else {
      /* Safari: draw fill off-canvas left; shadow cast back by shadowOffsetX */
      var blurRadius = blurPx * 1.5;
      var shift      = w + blurRadius * 2;
      ctx.save();
      ctx.shadowOffsetX = shift;
      ctx.shadowOffsetY = 0;
      ctx.shadowBlur    = blurRadius;
      ctx.shadowColor   = fillColor;
      ctx.fillStyle     = fillColor;
      ctx.translate(-shift, 0);
      pathFn(ctx);
      ctx.fill();
      ctx.restore();
    }
    return off;
  }

  /* ── _blurStrokeCanvas ─────────────────────────────────────────────
     Same pattern as _blurCanvas but for stroked paths (rim lighting). */
  function _blurStrokeCanvas(w, h, blurPx, strokeColor, lineWidth, pathFn) {
    var off = document.createElement('canvas');
    off.width = w; off.height = h;
    var ctx = off.getContext('2d');
    if (_canvasFilterSupported) {
      ctx.filter      = 'blur(' + blurPx + 'px)';
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth   = lineWidth;
      pathFn(ctx);
      ctx.stroke();
    } else {
      var blurRadius = blurPx * 2;
      var shift      = w + blurRadius * 2;
      ctx.save();
      ctx.shadowOffsetX = shift;
      ctx.shadowOffsetY = 0;
      ctx.shadowBlur    = blurRadius;
      ctx.shadowColor   = strokeColor;
      ctx.strokeStyle   = strokeColor;
      ctx.lineWidth     = lineWidth;
      ctx.translate(-shift, 0);
      pathFn(ctx);
      ctx.stroke();
      ctx.restore();
    }
    return off;
  }

  /* ── Stage data (13 stages) ─────────────────────────────────────── */
  var STAGES = [
    { name:'Tomoshibi', rgb:[250,246,238] },
    { name:'Hikari',    rgb:[245,237,208] },
    { name:'Kogane',    rgb:[240,208,96]  },
    { name:'Kohaku',    rgb:[232,184,48]  },
    { name:'Kagayaki',  rgb:[216,144,24]  },
    { name:'Moeru',     rgb:[200,108,8]   },
    { name:'Akane',     rgb:[192,80,32]   },
    { name:'Honoo',     rgb:[168,48,24]   },
    { name:'Homura',    rgb:[168,50,30]   },
    { name:'Shinku',    rgb:[160,64,64]   },
    { name:'Kurenai',   rgb:[160,64,112]  },
    { name:'Tasogare',  rgb:[144,80,176]  },
    { name:'\u2014',    rgb:[176,96,255]  },
  ];

  /* ── Density formula ────────────────────────────────────────────────
     Remaps XP 0-100 → aura density 0.15-1.0 so students always have a
     living glow at stage start and the aura fills to max at 100 % XP. */
  function auraDensity(xp, stageIndex) {
    var adj = 20 + xp * 0.80;
    var raw = 1 - Math.pow(1 - adj / 100, 2);
    return stageIndex === 0 ? 0.15 + raw * 0.85 : 0.25 + raw * 0.75;
  }

  /* ── Silhouette — ki-flame / shield shape (16 pts) ─────────────────
     NOT the character outline. A purpose-built energy-field shape.
     Centroid: CX=99, CY=219.  Widest at y=175 (waist).
     Crown at x=99 so it always points upward as layers expand.       */
  var SIL_BASE = [
    {x:99,  y:55},
    {x:82,  y:65},  {x:68,  y:85},
    {x:57,  y:128},
    {x:50,  y:175},
    {x:54,  y:222},
    {x:65,  y:278}, {x:78,  y:320},
    {x:99,  y:328},
    {x:120, y:320}, {x:133, y:278},
    {x:144, y:222},
    {x:148, y:175},
    {x:141, y:128},
    {x:130, y:85},  {x:116, y:65},
  ];
  var SIL_CX         = 99;
  var SIL_CY         = 219;
  var SIL_SCALE_IPAD = 160 / 124;   /* 1.29 */

  /* ── Layer config: 6 layers inner → outer ──────────────────────────
     Layers start outside the body (scale 1.08) so the character reads
     clearly through the aura. Outer layers push to 2.60.             */
  var LAYERS = [
    { scale:1.08, blur:8,   maxOp:0.18, threshold:0.00 },
    { scale:1.25, blur:18,  maxOp:0.20, threshold:0.10 },
    { scale:1.48, blur:32,  maxOp:0.15, threshold:0.30 },
    { scale:1.78, blur:58,  maxOp:0.13, threshold:0.50 },
    { scale:2.10, blur:85,  maxOp:0.09, threshold:0.55 },
    { scale:2.60, blur:110, maxOp:0.05, threshold:0.45 },
  ];

  /* ── Per-point noise (randomised once at startup) ─────────────────  */
  var NOISE_PHASES = SIL_BASE.map(function () {
    return {
      px: Math.random() * Math.PI * 2,
      py: Math.random() * Math.PI * 2,
      fx: 0.35 + Math.random() * 0.55,
      fy: 0.30 + Math.random() * 0.50,
    };
  });
  var NOISE_AMP_BASE = 2.0;

  /* ── Quality tiers ─────────────────────────────────────────────────
     REDUCED  : static one-shot render, L1+L2 only, no motes.
     STANDARD : 30 fps, all layers, up to 12 motes.
     ENHANCED : 60 fps, all layers, up to 24 motes, full effects.     */
  var Q_REDUCED  = 0;
  var Q_STANDARD = 1;
  var Q_ENHANCED = 2;
  var _quality   = Q_STANDARD;
  var _dpr       = Math.min(window.devicePixelRatio || 1, 2);

  function _autoDetectQuality() {
    var cores  = navigator.hardwareConcurrency || 2;
    var retina = _dpr >= 2;
    if (cores <= 2)             return Q_REDUCED;
    if (cores >= 4 && retina)   return Q_ENHANCED;
    return Q_STANDARD;
  }

  /* ── Animation state ───────────────────────────────────────────── */
  var _animFrame    = null;
  var _animStage    = 2;
  var _animXP       = 60;
  var _lastTs       = 0;
  var _lastRenderTs = 0;

  /* ── Level-up cinematic state ───────────────────────────────────────
     4 phases (total 1 400 ms):
       0 – 300 ms   Contract  aura shrinks inward
       300 – 600 ms Burst     flash of incoming-stage colour
       600 ms       Switch    stage index flips, XP resets to 0
       600 – 1400ms Settle    aura springs back with overshoot          */
  var _tr = { active:false, startTs:0, fromStage:0, toStage:1, switched:false };
  var TR_CONTRACT = 300;
  var TR_BURST    = 600;
  var TR_SWITCH   = 600;
  var TR_TOTAL    = 1400;

  /* ── Mote particle pool ────────────────────────────────────────── */
  var MAX_MOTES = 18;
  var _motePool = (function () {
    var pool = [];
    for (var i = 0; i < MAX_MOTES; i++) {
      pool.push({ alive:false, x:0, y:0, vx:0, vy:0,
                  life:0, maxLife:1, size:1, phase:0 });
    }
    return pool;
  }());

  function _targetMoteCount(density, surge) {
    if (_quality === Q_REDUCED) return 0;
    if (density < 0.38)         return 0;
    var cap  = (_quality === Q_ENHANCED) ? 24 : 12;
    var base = Math.round((density - 0.38) / 0.62 * cap);
    return surge ? Math.min(base + 6, MAX_MOTES) : base;
  }

  function _outlinePt(pts) {
    var i = Math.floor(Math.random() * pts.length);
    var j = (i + 1) % pts.length;
    var t = Math.random();
    return { x: pts[i].x + (pts[j].x - pts[i].x) * t,
             y: pts[i].y + (pts[j].y - pts[i].y) * t };
  }

  function _spawnMote(m, pts, surge) {
    var pt    = _outlinePt(pts);
    m.alive   = true;
    m.x       = pt.x; m.y = pt.y;
    m.vy      = -(0.25 + Math.random() * 0.45) * (surge ? 1.4 : 1.0);
    m.vx      = (Math.random() - 0.5) * 0.28;
    m.life    = 0;
    m.maxLife = surge ? 900 + Math.random() * 700 : 1400 + Math.random() * 1200;
    m.size    = 1.1 + Math.random() * 1.6;
    m.phase   = Math.random() * Math.PI * 2;
  }

  function _resetMotes() {
    for (var i = 0; i < MAX_MOTES; i++) _motePool[i].alive = false;
  }

  function _updateMotes(dt, pts, density, surge) {
    var target = _targetMoteCount(density, surge);
    var alive  = 0;
    for (var i = 0; i < MAX_MOTES; i++) {
      var m = _motePool[i];
      if (!m.alive) continue;
      m.life += dt;
      if (m.life >= m.maxLife) { m.alive = false; continue; }
      m.x += m.vx + 0.12 * Math.sin(m.life * 0.003 + m.phase);
      m.y += m.vy;
      alive++;
    }
    if (alive < target) {
      for (var j = 0; j < MAX_MOTES && alive < target; j++) {
        if (!_motePool[j].alive) { _spawnMote(_motePool[j], pts, surge); alive++; }
      }
    }
  }

  function _drawMotes(ctx, r, g, b, surge) {
    for (var i = 0; i < MAX_MOTES; i++) {
      var m = _motePool[i];
      if (!m.alive) continue;
      var progress = m.life / m.maxLife;
      var op;
      if      (progress < 0.20) op = progress / 0.20;
      else if (progress < 0.65) op = 1.0;
      else                      op = 1.0 - (progress - 0.65) / 0.35;
      op *= surge ? 0.72 : 0.55;
      var sz = m.size * (0.7 + 0.3 * Math.sin(progress * Math.PI));
      ctx.save();
      ctx.globalAlpha = op;
      ctx.fillStyle   = 'rgb(' + r + ',' + g + ',' + b + ')';
      ctx.beginPath(); ctx.arc(m.x, m.y, sz, 0, Math.PI * 2); ctx.fill();
      var grad = ctx.createRadialGradient(m.x, m.y, 0, m.x, m.y, sz * 3.5);
      grad.addColorStop(0, 'rgba(' + r + ',' + g + ',' + b + ',' + (op * 0.5).toFixed(3) + ')');
      grad.addColorStop(1, 'rgba(' + r + ',' + g + ',' + b + ',0)');
      ctx.fillStyle = grad;
      ctx.beginPath(); ctx.arc(m.x, m.y, sz * 3.5, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
    }
  }

  /* ── Breathing scale multiplier ─────────────────────────────────── */
  function breathMult(layerIndex, t, density, surge) {
    var speed = surge ? 0.0024 : 0.0015;
    var phase = layerIndex * 0.42;
    var amp   = surge ? 0.07 + density * 0.12 : 0.055 + density * 0.10;
    var base  = 1 + amp * Math.sin(t * speed + phase);
    if (!surge) return base;
    return base + 0.022 * Math.sin(t * 0.0058 + phase * 2.1);
  }

  /* ── Per-point sine noise ────────────────────────────────────────── */
  function noisedPt(pt, np, t, noiseAmp) {
    var s = 0.00085;
    return {
      x: pt.x + Math.sin(t * s * np.fx + np.px) * noiseAmp,
      y: pt.y + Math.sin(t * s * np.fy + np.py) * noiseAmp,
    };
  }

  /* ── Draw one glow layer ─────────────────────────────────────────── */
  function _drawGlowLayer(mainCtx, pts, cx, cy, layer, r, g, b, density, bMult) {
    if (density < layer.threshold) return;
    var progress  = Math.min((density - layer.threshold) / (1 - layer.threshold + 0.001), 1);
    var opacity   = progress * layer.maxOp;
    var s         = layer.scale * bMult;
    var w         = mainCtx.canvas.width;
    var h         = mainCtx.canvas.height;
    var fillColor = 'rgba(' + r + ',' + g + ',' + b + ',1)';
    var off = _blurCanvas(w, h, layer.blur, fillColor, function (ctx) {
      ctx.beginPath();
      pts.forEach(function (p, i) {
        var x = cx + (p.x - cx) * s;
        var y = cy + (p.y - cy) * s;
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      });
      ctx.closePath();
    });
    mainCtx.save();
    mainCtx.globalAlpha = opacity;
    mainCtx.drawImage(off, 0, 0);
    mainCtx.restore();
  }

  /* ── Rim lighting (stages 9-12) ─────────────────────────────────── */
  var _RIM_STAGES = [8, 9, 10, 11];
  function _drawRimLight(ctx, pts, r, g, b, density) {
    var rr = Math.min(255, r + 70);
    var gg = Math.min(255, g + 70);
    var bb = Math.min(255, b + 80);
    var glowOp = 0.18 + density * 0.28;
    var rimOp  = 0.30 + density * 0.40;
    var w = ctx.canvas.width; var h = ctx.canvas.height;
    function tracePath(c) {
      c.beginPath();
      pts.forEach(function (p, i) {
        if (i === 0) c.moveTo(p.x, p.y); else c.lineTo(p.x, p.y);
      });
      c.closePath();
    }
    var sc = 'rgb(' + rr + ',' + gg + ',' + bb + ')';
    var offGlow = _blurStrokeCanvas(w, h, 4, sc, 4.0, tracePath);
    ctx.save(); ctx.globalAlpha = glowOp; ctx.drawImage(offGlow, 0, 0); ctx.restore();
    var offRim  = _blurStrokeCanvas(w, h, 1, sc, 1.5, tracePath);
    ctx.save(); ctx.globalAlpha = rimOp;  ctx.drawImage(offRim,  0, 0); ctx.restore();
  }

  /* ── DOM references (set by init) ──────────────────────────────── */
  var _canvasId    = 'aura-canvas';
  var _frameId     = 'frame';
  var _charWrapSel = '.char-wrap';
  var _callbacks   = {};

  function _getCanvas()   { return document.getElementById(_canvasId); }
  function _getFrame()    { return document.getElementById(_frameId); }
  function _getCharWrap() { return document.querySelector(_charWrapSel); }

  /* ── Size canvas to full frame ──────────────────────────────────── */
  function _sizeCanvas() {
    var canvas = _getCanvas(); var frame = _getFrame();
    if (!canvas || !frame) return;
    canvas.width  = frame.clientWidth;
    canvas.height = frame.clientHeight;
  }

  /* ── Full aura render — one frame ──────────────────────────────── */
  function _renderAura(stageIndex, xp, t, dt) {
    dt = dt || 16;
    var canvas = _getCanvas(); var frame = _getFrame(); var wrap = _getCharWrap();
    if (!canvas || !frame || !wrap) return;

    var isIpad    = frame.classList.contains('ipad');
    var devScale  = isIpad ? SIL_SCALE_IPAD : 1.0;
    var cw = canvas.width; var ch = canvas.height;
    var ctx = canvas.getContext('2d');
    ctx.setTransform(1,0,0,1,0,0);
    ctx.clearRect(0, 0, cw, ch);

    var frameRect  = frame.getBoundingClientRect();
    var charRect   = wrap.getBoundingClientRect();
    var silOriginX = (charRect.left - frameRect.left) - 40 * devScale;
    var silOriginY = (charRect.top  - frameRect.top)  - 40 * devScale;

    var surge   = xp >= 80;
    var density = auraDensity(xp, stageIndex);

    var noiseAmp = NOISE_AMP_BASE * (0.6 + density * 0.9) * devScale;
    if (surge) noiseAmp *= 1.0 + (xp - 80) / 20 * 0.8;

    var pts = SIL_BASE.map(function (p, i) {
      var np = noisedPt(p, NOISE_PHASES[i], t, noiseAmp / devScale);
      return { x: np.x * devScale + silOriginX, y: np.y * devScale + silOriginY };
    });
    var cx = SIL_CX * devScale + silOriginX;
    var cy = SIL_CY * devScale + silOriginY;

    var stage = STAGES[stageIndex] || STAGES[2];
    var rgb   = stage.rgb;

    /* Transition scale modifier */
    var trScaleMod = 1.0; var trBurstOp = 0.0;
    if (_tr.active && _tr.startTs > 0) {
      var trElapsed = t - _tr.startTs;
      if (trElapsed < TR_CONTRACT) {
        var p1 = trElapsed / TR_CONTRACT;
        trScaleMod = 1.0 - 0.18 * (p1 * p1);
      } else if (trElapsed < TR_BURST) {
        trScaleMod = 0.82;
        var p2 = (trElapsed - TR_CONTRACT) / (TR_BURST - TR_CONTRACT);
        trBurstOp = Math.sin(p2 * Math.PI) * 0.80;
      } else if (trElapsed < TR_TOTAL) {
        var p4 = (trElapsed - TR_BURST) / (TR_TOTAL - TR_BURST);
        trScaleMod = 1.0 + 0.10 * Math.exp(-5 * p4) * Math.sin(p4 * Math.PI * 2.5);
      }
    }

    /* Layers */
    var layerLimit = (_quality === Q_REDUCED) ? 2 : LAYERS.length;
    LAYERS.forEach(function (layer, li) {
      if (li >= layerLimit) return;
      var bm = (_quality === Q_REDUCED)
        ? trScaleMod
        : breathMult(li, t, density, surge) * trScaleMod;
      _drawGlowLayer(ctx, pts, cx, cy, layer, rgb[0], rgb[1], rgb[2], density, bm);
    });

    /* Burst flash overlay */
    if (trBurstOp > 0) {
      var bRgb = STAGES[_tr.toStage] ? STAGES[_tr.toStage].rgb : rgb;
      var br = bRgb[0]; var bg_ = bRgb[1]; var bb = bRgb[2];
      var grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(cw, ch) * 0.85);
      grad.addColorStop(0,    'rgba(' + br + ',' + bg_ + ',' + bb + ',' + trBurstOp.toFixed(3) + ')');
      grad.addColorStop(0.35, 'rgba(' + br + ',' + bg_ + ',' + bb + ',' + (trBurstOp * 0.45).toFixed(3) + ')');
      grad.addColorStop(1,    'rgba(' + br + ',' + bg_ + ',' + bb + ',0)');
      ctx.save(); ctx.fillStyle = grad; ctx.fillRect(0, 0, cw, ch); ctx.restore();
    }

    /* Surge corona (Standard / Enhanced only) */
    if (_quality !== Q_REDUCED && surge) {
      var surgeStrength = (xp - 80) / 20;
      var coronaPulse   = 1 + 0.18 * Math.sin(t * 0.0048);
      var coronaScale   = 2.20 * coronaPulse;
      var coronaOp      = surgeStrength * 0.18 * coronaPulse;
      var fillC = 'rgb(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ')';
      var offCorona = _blurCanvas(cw, ch, 85, fillC, function (c) {
        c.beginPath();
        pts.forEach(function (p, i) {
          var x = cx + (p.x - cx) * coronaScale;
          var y = cy + (p.y - cy) * coronaScale;
          if (i === 0) c.moveTo(x, y); else c.lineTo(x, y);
        });
        c.closePath();
      });
      ctx.save(); ctx.globalAlpha = Math.min(coronaOp, 0.22);
      ctx.drawImage(offCorona, 0, 0); ctx.restore();
    }

    /* Colour bleed to next stage (Standard / Enhanced, XP >= 90) */
    if (_quality !== Q_REDUCED && xp >= 90 && stageIndex < 12) {
      var bleedStrength = (xp - 90) / 10;
      var bleedOp       = bleedStrength * 0.13;
      var bleedPulse    = 1 + 0.06 * Math.sin(t * 0.0020 + 1.2);
      var bleedScale    = 2.00 * bleedPulse;
      var nextRgb       = STAGES[stageIndex + 1].rgb;
      var fillB = 'rgb(' + nextRgb[0] + ',' + nextRgb[1] + ',' + nextRgb[2] + ')';
      var offBleed = _blurCanvas(cw, ch, 65, fillB, function (c) {
        c.beginPath();
        pts.forEach(function (p, i) {
          var x = cx + (p.x - cx) * bleedScale;
          var y = cy + (p.y - cy) * bleedScale;
          if (i === 0) c.moveTo(x, y); else c.lineTo(x, y);
        });
        c.closePath();
      });
      ctx.save(); ctx.globalAlpha = bleedOp;
      ctx.drawImage(offBleed, 0, 0); ctx.restore();
    }

    /* Motes */
    if (_quality !== Q_REDUCED) {
      _updateMotes(dt, pts, density, surge);
      _drawMotes(ctx, rgb[0], rgb[1], rgb[2], surge);
    }

    /* Surge callback */
    if (_callbacks.onSurge) _callbacks.onSurge(surge, xp, stageIndex, stage);
  }

  /* ── RAF animation loop ─────────────────────────────────────────── */
  function _animTick(ts) {
    if (_quality === Q_STANDARD && _lastRenderTs && (ts - _lastRenderTs) < 32) {
      _animFrame = requestAnimationFrame(_animTick); return;
    }
    _lastRenderTs = ts;
    var dt = _lastTs ? Math.min(ts - _lastTs, 50) : 16;
    _lastTs = ts;

    if (_tr.active) {
      if (_tr.startTs === 0) _tr.startTs = ts;
      var elapsed = ts - _tr.startTs;
      if (!_tr.switched && elapsed >= TR_SWITCH) {
        _tr.switched = true;
        _animStage   = _tr.toStage;
        _animXP      = 0;
        _resetMotes();
        if (_callbacks.onLevelUpStage) _callbacks.onLevelUpStage(_tr.toStage);
      }
      if (elapsed >= TR_TOTAL) {
        _tr.active  = false;
        _tr.startTs = 0;
        if (_callbacks.onLevelUpEnd) _callbacks.onLevelUpEnd(_tr.toStage);
      }
    }

    _renderAura(_animStage, _animXP, ts, dt);
    _animFrame = requestAnimationFrame(_animTick);
  }

  /* ══════════════════════════════════════════════════════════════════
     PUBLIC API
     ══════════════════════════════════════════════════════════════════ */

  function init(options) {
    options      = options || {};
    _canvasId    = options.canvasId    || 'aura-canvas';
    _frameId     = options.frameId     || 'frame';
    _charWrapSel = options.charWrapSel || '.char-wrap';
    _callbacks   = {
      onSurge:        options.onSurge        || null,
      onLevelUpStart: options.onLevelUpStart || null,
      onLevelUpStage: options.onLevelUpStage || null,
      onLevelUpEnd:   options.onLevelUpEnd   || null,
    };
    _quality = _autoDetectQuality();
  }

  function start(stageIndex, xp) {
    _animStage = stageIndex; _animXP = xp;
    _lastTs = 0; _lastRenderTs = 0;
    if (_animFrame) cancelAnimationFrame(_animFrame);
    _animFrame = null;
    _sizeCanvas();
    _resetMotes();
    if (_quality === Q_REDUCED) {
      _renderAura(stageIndex, xp, 0, 16);
    } else {
      _animFrame = requestAnimationFrame(_animTick);
    }
  }

  function setQuality(q) {
    _quality = q;
    if (_quality === Q_REDUCED) {
      if (_animFrame) { cancelAnimationFrame(_animFrame); _animFrame = null; }
      _sizeCanvas(); _renderAura(_animStage, _animXP, 0, 16);
    } else {
      start(_animStage, _animXP);
    }
  }

  function triggerLevelUp() {
    if (_tr.active || _animStage >= 12) return;
    _tr.active = true; _tr.startTs = 0;
    _tr.fromStage = _animStage; _tr.toStage = _animStage + 1;
    _tr.switched = false; _animXP = 100;
    if (_callbacks.onLevelUpStart) _callbacks.onLevelUpStart(_tr.fromStage, _tr.toStage);
  }

  global.NinjaAura = {
    /* Init */
    init:           init,
    /* Playback */
    start:          start,
    setQuality:     setQuality,
    triggerLevelUp: triggerLevelUp,
    resize:         function () { _sizeCanvas(); _renderAura(_animStage, _animXP, 0, 16); },
    /* Data */
    STAGES:         STAGES,
    auraDensity:    auraDensity,
    /* Quality constants */
    Q_REDUCED:      Q_REDUCED,
    Q_STANDARD:     Q_STANDARD,
    Q_ENHANCED:     Q_ENHANCED,
    /* State (read-only) */
    get currentStage() { return _animStage; },
    get currentXP()    { return _animXP;    },
    /* Safari compat info (useful for debugging) */
    get filterSupported() { return _canvasFilterSupported; },
  };

}(window));
