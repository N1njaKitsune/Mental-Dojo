import React, { useRef, useEffect, useCallback } from 'react';
import { TECHNIQUES, ELEMENTS, buildFlatPhases, drawBreathCircle, PHASE_LABELS } from './data';

export default function Technique({ go, params }) {
  const t = TECHNIQUES[params.techId];
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const phaseStartRef = useRef(null);
  const [state, setState] = React.useState('idle'); // idle | running | complete
  const [phaseIndex, setPhaseIndex] = React.useState(0);
  const [cdNum, setCdNum] = React.useState('—');
  const [phaseLabel, setPhaseLabel] = React.useState('');
  const [phaseSublabel, setPhaseSublabel] = React.useState('Press begin');
  const [progress, setProgress] = React.useState(0);
  const [donePips, setDonePips] = React.useState(0);
  const flatRef = useRef([]);

  useEffect(() => {
    flatRef.current = buildFlatPhases(t, true);
    drawBreathCircle(canvasRef.current, 0.05, t.color);
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, [t]);

  const runTick = useCallback(() => {
    const ph = flatRef.current[phaseIndex];
    if (!ph) { setState('complete'); return; }
    const elapsed = (performance.now() - phaseStartRef.current) / 1000;
    const prog = Math.min(elapsed / ph.dur, 1);
    const lung = ph.name === 'inhale' ? prog : ph.name === 'exhale' ? 1 - prog : ph.name === 'hold' ? 1 : 0.05;
    drawBreathCircle(canvasRef.current, lung, t.color);
    const lbl = ph.ph ? `${ph.ph} · ${PHASE_LABELS[ph.name]}` : PHASE_LABELS[ph.name] || '';
    setPhaseLabel(lbl);
    setPhaseSublabel(PHASE_LABELS[ph.name] || '');
    setCdNum(Math.max(1, Math.ceil(ph.dur * (1 - prog))));
    const overall = (phaseIndex / flatRef.current.length) + (prog / flatRef.current.length);
    setProgress(Math.round(overall * 100));
    if (t.type === 'cycle') {
      const cl = (t.inhale||0)+(t.hold||0)+(t.exhale||0)+(t.endHold||0);
      const ppc = [t.inhale,t.hold,t.exhale,t.endHold].filter(Boolean).length;
      setDonePips(Math.floor(phaseIndex / ppc));
    }
    if (prog >= 1) {
      const next = phaseIndex + 1;
      if (next >= flatRef.current.length) { setState('complete'); return; }
      setPhaseIndex(next);
      phaseStartRef.current = performance.now();
    }
    animRef.current = requestAnimationFrame(runTick);
  }, [phaseIndex, t]);

  useEffect(() => {
    if (state === 'running') {
      animRef.current = requestAnimationFrame(runTick);
    }
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, [state, runTick]);

  function startBreath() {
    setPhaseIndex(0);
    setProgress(0);
    setDonePips(0);
    phaseStartRef.current = performance.now();
    setState('running');
  }

  function stopBreath() {
    if (animRef.current) cancelAnimationFrame(animRef.current);
    setState('idle');
    setPhaseLabel('');
    setCdNum('—');
    setProgress(0);
    setDonePips(0);
    drawBreathCircle(canvasRef.current, 0.05, t.color);
  }

  const backTarget = t.elem === 'centre' ? 'breath-home' : 'element';
  const backParams = t.elem === 'centre' ? {} : { elemId: t.elem };

  const totalCycles = t.type === 'cycle'
    ? Math.round((t.dur || 60) / ((t.inhale||0)+(t.hold||0)+(t.exhale||0)+(t.endHold||0)))
    : null;

  return (
    <div style={{ width:'100%', height:'100%', display:'flex', flexDirection:'column', position:'relative', overflow:'hidden' }}>
      {/* Bg */}
      <div style={{ position:'absolute', inset:0, background:t.bg.base, pointerEvents:'none' }}>
        <svg width="100%" height="100%" viewBox="0 0 420 300" preserveAspectRatio="xMidYMid slice" style={{ position:'absolute', inset:0 }}>
          <rect width="420" height="300" fill={t.bg.base} />
          <rect x="0" y="0" width="420" height="150" fill={t.bg.a1} opacity="0.5" />
          <rect x="0" y="150" width="420" height="150" fill={t.bg.a2} opacity="0.4" />
          {t.pts.map(([x,y],i) => <circle key={i} cx={x} cy={y} r={1+i%2*0.8} fill={t.color} opacity={0.04+i%3*0.03} />)}
        </svg>
      </div>

      {/* Topbar */}
      <div style={{ ...S.topbar, position:'relative', zIndex:1 }}>
        <button style={S.back} onClick={() => { stopBreath(); go(backTarget, backParams); }}>← Back</button>
        <div style={S.tbTitle}>{t.elem === 'centre' ? 'Mushin · Shiho' : `Mushin · ${t.name}`}</div>
        <div style={{ width:80 }} />
      </div>

      {/* Three-column layout */}
      <div style={{ position:'relative', zIndex:1, flex:1, display:'flex' }}>

        {/* LEFT — identity */}
        <div style={S.left}>
          <div style={{ fontFamily:'Cinzel, serif', fontSize:7.5, letterSpacing:'0.2em', color:'rgba(245,240,232,0.2)', marginBottom:6 }}>
            {t.elem === 'centre' ? 'Centre · All elements' : ELEMENTS[t.elem]?.element || ''}
          </div>
          <div style={{ fontFamily:'Cinzel, serif', fontSize:16, fontWeight:700, color:t.color, letterSpacing:'0.04em', lineHeight:1.1, marginBottom:3 }}>{t.name}</div>
          <div style={{ fontFamily:'Cinzel, serif', fontSize:7, letterSpacing:'0.18em', color:'rgba(245,240,232,0.22)', marginBottom:9 }}>{t.realName}</div>
          <div style={{ width:32, height:1, background:`linear-gradient(90deg,${t.color},transparent)`, marginBottom:9 }} />
          <div style={{ fontSize:11, fontStyle:'italic', color:'rgba(245,240,232,0.6)', lineHeight:1.6, marginBottom:7 }}>{t.cue}</div>
          <div style={{ fontSize:10, color:'rgba(245,240,232,0.33)', lineHeight:1.5, marginBottom:11 }}>{t.best}</div>

          {/* Rhythm */}
          {t.type === 'cycle' ? (
            <div style={{ display:'flex', gap:5, alignItems:'center', marginBottom:12, flexWrap:'wrap' }}>
              {[['inhale','Inhale',t.inhale],['hold','Hold',t.hold],['exhale','Exhale',t.exhale],['endHold','Hold',t.endHold]]
                .filter(([,,v]) => v)
                .map(([k,l,v], i, arr) => (
                  <React.Fragment key={k}>
                    {i > 0 && <div style={{ fontSize:12, color:'rgba(245,240,232,0.1)', alignSelf:'center' }}>·</div>}
                    <div style={{ textAlign:'center' }}>
                      <div style={{ fontFamily:'Cinzel, serif', fontSize:15, fontWeight:700, color:t.color }}>{v}</div>
                      <div style={{ fontSize:7, letterSpacing:'0.1em', color:'rgba(245,240,232,0.24)', marginTop:1 }}>{l}</div>
                    </div>
                  </React.Fragment>
                ))}
            </div>
          ) : (
            <div style={{ marginBottom:11 }}>
              {t.phases.map(ph => (
                <div key={ph.name} style={{ display:'flex', alignItems:'center', gap:6, marginBottom:4 }}>
                  <div style={{ width:5, height:5, borderRadius:'50%', background:t.color, opacity:0.6, flexShrink:0 }} />
                  <div style={{ fontFamily:'Cinzel, serif', fontSize:8, letterSpacing:'0.06em', color:t.color }}>{ph.label}</div>
                  <div style={{ fontSize:9, fontStyle:'italic', color:'rgba(245,240,232,0.28)' }}>{ph.desc}</div>
                </div>
              ))}
            </div>
          )}

          {state === 'idle' && (
            <button style={{ ...S.btn, borderColor:`${t.color}55`, color:t.color }} onClick={startBreath}>Begin →</button>
          )}
          {state === 'running' && (
            <button style={{ ...S.btn, borderColor:'rgba(245,240,232,0.12)', color:'rgba(245,240,232,0.3)', fontSize:9 }} onClick={stopBreath}>End early</button>
          )}
        </div>

        {/* CENTRE — circle */}
        <div style={S.centre}>
          <div style={{ fontFamily:'Cinzel, serif', fontSize:10, letterSpacing:'0.22em', minHeight:15, textAlign:'center', marginBottom:9, textTransform:'uppercase', color:t.color, transition:'color 0.3s' }}>
            {phaseLabel}
          </div>
          <div style={{ position:'relative', width:196, height:196 }}>
            <canvas ref={canvasRef} width={196} height={196} style={{ position:'absolute', top:0, left:0, width:196, height:196 }} />
          </div>
          <div style={{ display:'flex', flexDirection:'column', alignItems:'center', marginTop:7 }}>
            <div style={{ fontFamily:'Cinzel, serif', fontSize:26, fontWeight:700, lineHeight:1, color: state === 'idle' ? 'rgba(245,240,232,0.25)' : t.color, transition:'color 0.3s' }}>
              {cdNum}
            </div>
            <div style={{ fontFamily:'Cinzel, serif', fontSize:7, letterSpacing:'0.18em', opacity:0.32, marginTop:2 }}>
              {phaseSublabel}
            </div>
          </div>
        </div>

        {/* RIGHT — progress */}
        <div style={S.right}>
          <div style={{ fontFamily:'Cinzel, serif', fontSize:7, letterSpacing:'0.18em', color:'rgba(245,240,232,0.22)', marginBottom:7 }}>
            {t.type === 'cycle' ? 'Progress' : 'Phases'}
          </div>

          {t.type === 'cycle' && totalCycles && (
            <div style={{ display:'flex', flexDirection:'column', gap:4, marginBottom:12 }}>
              {Array.from({ length: Math.min(totalCycles, 10) }, (_, i) => (
                <div key={i} style={{ display:'flex', alignItems:'center', gap:5 }}>
                  <div style={{ width:6, height:6, borderRadius:'50%', background: i < donePips ? t.color : 'rgba(245,240,232,0.08)', transition:'background 0.35s' }} />
                  <div style={{ fontFamily:'Cinzel, serif', fontSize:7.5, letterSpacing:'0.04em', color: i < donePips ? 'rgba(245,240,232,0.5)' : 'rgba(245,240,232,0.18)', transition:'color 0.3s' }}>
                    Breath {i+1}
                  </div>
                </div>
              ))}
            </div>
          )}

          {t.type === 'fire' && (
            <div style={{ display:'flex', flexDirection:'column', gap:4, marginBottom:12 }}>
              {t.phases.map((ph, i) => (
                <div key={ph.name} style={{ display:'flex', alignItems:'center', gap:5 }}>
                  <div style={{ width:6, height:6, borderRadius:'50%', background:'rgba(245,240,232,0.08)' }} />
                  <div style={{ fontFamily:'Cinzel, serif', fontSize:7.5, letterSpacing:'0.04em', color:'rgba(245,240,232,0.18)' }}>{ph.label}</div>
                </div>
              ))}
            </div>
          )}

          <div style={{ fontFamily:'Cinzel, serif', fontSize:7, letterSpacing:'0.18em', color:'rgba(245,240,232,0.22)', marginBottom:5 }}>Overall</div>
          <div style={{ width:'100%', height:2, background:'rgba(245,240,232,0.06)', borderRadius:2, overflow:'hidden', marginBottom:12 }}>
            <div style={{ height:'100%', borderRadius:2, background:t.color, width:`${progress}%`, transition:'width 0.2s linear' }} />
          </div>
        </div>
      </div>

      {/* Complete overlay */}
      {state === 'complete' && (
        <div style={{ position:'absolute', inset:0, zIndex:10, background:`${t.bg.base}F0`, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', textAlign:'center', padding:24 }}>
          <div style={{ fontFamily:'Cinzel, serif', fontSize:30, fontWeight:700, color:t.color, letterSpacing:'0.1em', marginBottom:6 }}>{t.word}</div>
          <div style={{ fontSize:13, fontStyle:'italic', color:'rgba(245,240,232,0.42)', marginBottom:16, lineHeight:1.6 }}>{t.name} complete.</div>
          <div style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'7px 18px', border:'0.5px solid rgba(122,184,154,0.25)', borderRadius:8, background:'rgba(122,184,154,0.05)', marginBottom:16 }}>
            <span style={{ fontFamily:'Cinzel, serif', fontSize:9, letterSpacing:'0.15em', color:'rgba(122,184,154,0.6)' }}>Mushin XP</span>
            <span style={{ fontFamily:'Cinzel, serif', fontSize:16, color:'7AB89A' }}>+10</span>
          </div>
          <div style={{ display:'flex', gap:8 }}>
            <button style={{ ...S.btn, borderColor:`${t.color}55`, color:t.color }} onClick={() => { setPhaseIndex(0); setProgress(0); setDonePips(0); setState('idle'); drawBreathCircle(canvasRef.current, 0.05, t.color); }}>Again</button>
            <button style={{ ...S.btn, borderColor:'rgba(122,184,154,0.35)', color:'#7AB89A' }} onClick={() => go(backTarget, backParams)}>Back</button>
          </div>
        </div>
      )}
    </div>
  );
}

const S = {
  topbar: { height:44, display:'flex', alignItems:'center', padding:'0 20px', borderBottom:'0.5px solid rgba(245,240,232,0.07)', flexShrink:0 },
  back: { fontFamily:'Cinzel, serif', fontSize:10, letterSpacing:'0.12em', color:'rgba(245,240,232,0.35)', background:'none', border:'none', cursor:'pointer', padding:0, width:80 },
  tbTitle: { flex:1, textAlign:'center', fontFamily:'Cinzel, serif', fontSize:11, letterSpacing:'0.2em', color:'rgba(245,240,232,0.28)' },
  left: { width:195, flexShrink:0, display:'flex', flexDirection:'column', justifyContent:'center', padding:'14px 12px 14px 18px', borderRight:'0.5px solid rgba(245,240,232,0.05)' },
  centre: { flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'10px 6px' },
  right: { width:130, flexShrink:0, display:'flex', flexDirection:'column', justifyContent:'center', padding:'14px 16px 14px 10px', borderLeft:'0.5px solid rgba(245,240,232,0.05)' },
  btn: { padding:'8px 0', width:'100%', borderRadius:6, border:'0.5px solid', background:'transparent', fontFamily:'Cinzel, serif', fontSize:9, letterSpacing:'0.18em', cursor:'pointer', transition:'opacity 0.15s' },
};
