import React, { useRef, useEffect, useCallback, useState } from 'react';
import { TECHNIQUES, STATES, SHIHO, buildFlatPhases, drawBreathCircle, PHASE_LABELS } from './data';

const VIEWS = { SHIHO_OPEN:'shiho-open', CHECKIN:'checkin', SEQUENCE:'sequence', RUNNER:'runner', SHIHO_CLOSE:'shiho-close', SUMMARY:'summary' };

export default function Session({ go }) {
  const [view, setView] = useState(VIEWS.SHIHO_OPEN);
  const [selectedState, setSelectedState] = useState(null);
  const [sessionCount, setSessionCount] = useState(2);
  const [sequence, setSequence] = useState([]);
  const [techIndex, setTechIndex] = useState(0);
  const sessionStartRef = useRef(null);
  const [elapsedStr, setElapsedStr] = useState('0:00');
  const timerRef = useRef(null);

  function startTimer() {
    sessionStartRef.current = Date.now();
    timerRef.current = setInterval(() => {
      const el = Math.floor((Date.now() - sessionStartRef.current) / 1000);
      const m = Math.floor(el / 60), s = el % 60;
      setElapsedStr(`${m}:${s < 10 ? '0' : ''}${s}`);
    }, 1000);
  }

  function stopTimer() { if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; } }
  useEffect(() => () => stopTimer(), []);

  function onShihoOpenComplete() { setView(VIEWS.CHECKIN); }
  function onShihoCloseComplete() { stopTimer(); setView(VIEWS.SUMMARY); }

  function selectState(id) {
    setSelectedState(id);
    const st = STATES.find(x => x.id === id);
    setSequence(st.sequence.slice(0, sessionCount));
  }

  function goToSequence() { setView(VIEWS.SEQUENCE); }

  function startSession() {
    setTechIndex(0);
    startTimer();
    setView(VIEWS.RUNNER);
  }

  function onTechComplete(idx) {
    if (idx < sequence.length - 1) {
      setTechIndex(idx + 1);
    } else {
      setView(VIEWS.SHIHO_CLOSE);
    }
  }

  const totalElapsed = sessionStartRef.current ? Math.floor((Date.now() - sessionStartRef.current) / 1000) : 0;

  return (
    <div style={{ width:'100%', height:'100%', display:'flex', flexDirection:'column', background:'#0A0A12' }}>
      <div style={S.topbar}>
        <button style={S.back} onClick={() => { stopTimer(); go('breath-home'); }}>
          {view === VIEWS.SHIHO_OPEN ? '← Cancel' : ''}
        </button>
        <div style={S.tbTitle}>
          {view === VIEWS.SHIHO_OPEN && 'Mushin · Opening'}
          {view === VIEWS.CHECKIN && 'Mushin · Session'}
          {view === VIEWS.SEQUENCE && 'Mushin · Build Session'}
          {view === VIEWS.RUNNER && 'Mushin · Breathing'}
          {view === VIEWS.SHIHO_CLOSE && 'Mushin · Closing'}
          {view === VIEWS.SUMMARY && 'Mushin · Complete'}
        </div>
        <div style={{ width:80, textAlign:'right', fontFamily:'Cinzel, serif', fontSize:10, letterSpacing:'0.1em', color:'rgba(245,240,232,0.25)' }}>
          {(view === VIEWS.RUNNER || view === VIEWS.SHIHO_CLOSE) ? elapsedStr : ''}
        </div>
      </div>

      {view === VIEWS.SHIHO_OPEN  && <ShihoGate mode="open"  onComplete={onShihoOpenComplete} />}
      {view === VIEWS.CHECKIN     && <CheckIn selectedState={selectedState} onSelect={selectState} onContinue={goToSequence} />}
      {view === VIEWS.SEQUENCE    && <Sequence selectedState={selectedState} sessionCount={sessionCount} sequence={sequence}
        onCountChange={n => { setSessionCount(n); const st = STATES.find(x => x.id === selectedState); setSequence(st.sequence.slice(0,n)); }}
        onToggle={i => { setSessionCount(i+1); const st = STATES.find(x => x.id === selectedState); setSequence(st.sequence.slice(0,i+1)); }}
        onBegin={startSession} />}
      {view === VIEWS.RUNNER      && <Runner sequence={sequence} techIndex={techIndex} onComplete={() => onTechComplete(techIndex)} />}
      {view === VIEWS.SHIHO_CLOSE && <ShihoGate mode="close" onComplete={onShihoCloseComplete} />}
      {view === VIEWS.SUMMARY     && <Summary sequence={sequence} elapsed={elapsedStr} techsDone={sequence.length} onReturn={() => go('breath-home')} />}
    </div>
  );
}

/* ── SHIHO GATE ── */
function ShihoGate({ mode, onComplete }) {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const phaseStartRef = useRef(null);
  const [pIdx, setPIdx] = useState(0);
  const [running, setRunning] = useState(false);
  const [cdNum, setCdNum] = useState('—');
  const [phLbl, setPhLbl] = useState('');
  const [donePips, setDonePips] = useState(0);
  const flatRef = useRef([]);

  useEffect(() => {
    flatRef.current = buildFlatPhases(SHIHO, false);
    drawBreathCircle(canvasRef.current, 0.05, SHIHO.color);
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, []);

  const tick = useCallback(() => {
    const ph = flatRef.current[pIdx];
    if (!ph) { setRunning(false); setTimeout(onComplete, 500); return; }
    const el = (performance.now() - phaseStartRef.current) / 1000;
    const prog = Math.min(el / ph.dur, 1);
    const lung = ph.name === 'inhale' ? prog : ph.name === 'exhale' ? 1-prog : ph.name === 'hold' ? 1 : 0;
    drawBreathCircle(canvasRef.current, lung, SHIHO.color);
    setPhLbl(PHASE_LABELS[ph.name] || '');
    setCdNum(Math.max(1, Math.ceil(ph.dur*(1-prog))));
    setDonePips(Math.floor(pIdx / 4));
    if (prog >= 1) {
      const next = pIdx + 1;
      if (next >= flatRef.current.length) { setRunning(false); setTimeout(onComplete, 500); return; }
      setPIdx(next);
      phaseStartRef.current = performance.now();
    }
    animRef.current = requestAnimationFrame(tick);
  }, [pIdx, onComplete]);

  useEffect(() => {
    if (running) animRef.current = requestAnimationFrame(tick);
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, [running, tick]);

  function start() { phaseStartRef.current = performance.now(); setRunning(true); }

  return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:20, textAlign:'center', background:'#080C10', position:'relative', overflow:'hidden' }}>
      <div style={{ position:'absolute', inset:0, pointerEvents:'none' }}>
        <svg width="100%" height="100%" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" style={{ position:'absolute', inset:0 }}>
          <rect width="400" height="300" fill="#080C10" />
          <rect width="400" height="150" fill="#0D1620" opacity="0.5" />
          {[[60,40],[200,55],[320,35],[80,180],[280,160],[160,220]].map(([x,y],i)=><circle key={i} cx={x} cy={y} r={1+i%2} fill="#C8D8E8" opacity={0.04+i%3*0.02}/>)}
        </svg>
      </div>
      <div style={{ position:'relative', zIndex:1, display:'flex', flexDirection:'column', alignItems:'center' }}>
        <div style={{ fontFamily:'Cinzel, serif', fontSize:8, letterSpacing:'0.25em', color:'rgba(200,216,232,0.3)', marginBottom:8 }}>
          {mode === 'open' ? 'Opening Ritual' : 'Closing Ritual'}
        </div>
        <div style={{ fontFamily:'Cinzel, serif', fontSize:22, fontWeight:700, color:'#C8D8E8', letterSpacing:'0.1em', marginBottom:4 }}>Shiho</div>
        <div style={{ fontSize:12, fontStyle:'italic', color:'rgba(245,240,232,0.4)', marginBottom:16, lineHeight:1.6, maxWidth:280 }}>
          {mode === 'open' ? SHIHO.cue : SHIHO.closeCue}
        </div>
        <div style={{ fontFamily:'Cinzel, serif', fontSize:10, letterSpacing:'0.2em', color:'rgba(200,216,232,0.5)', minHeight:16, marginBottom:10, textTransform:'uppercase' }}>{phLbl}</div>
        <div style={{ position:'relative', width:196, height:196 }}>
          <canvas ref={canvasRef} width={196} height={196} style={{ position:'absolute', top:0, left:0, width:196, height:196 }} />
        </div>
        <div style={{ display:'flex', flexDirection:'column', alignItems:'center', margin:'8px 0 14px' }}>
          <div style={{ fontFamily:'Cinzel, serif', fontSize:28, fontWeight:700, color:'#C8D8E8', lineHeight:1 }}>{cdNum}</div>
          <div style={{ fontFamily:'Cinzel, serif', fontSize:7, letterSpacing:'0.18em', color:'rgba(200,216,232,0.35)', marginTop:2 }}>{phLbl}</div>
        </div>
        <div style={{ display:'flex', gap:6, marginBottom:14 }}>
          {Array.from({length:SHIHO.cycles},(_,i)=>(
            <div key={i} style={{ width:7, height:7, borderRadius:'50%', background: i<donePips ? '#C8D8E8' : 'rgba(200,216,232,0.1)', transition:'background 0.4s' }} />
          ))}
        </div>
        {!running && (
          <button style={{ background:'none', border:'0.5px solid rgba(200,216,232,0.2)', borderRadius:6, padding:'6px 18px', fontFamily:'Cinzel, serif', fontSize:9, letterSpacing:'0.15em', color:'rgba(200,216,232,0.5)', cursor:'pointer' }} onClick={start}>
            Begin →
          </button>
        )}
      </div>
    </div>
  );
}

/* ── CHECK IN ── */
function CheckIn({ selectedState, onSelect, onContinue }) {
  const icons = {
    stormy: <svg width="26" height="26" viewBox="0 0 26 26" fill="none"><path d="M4 10C4 7 8 5 11 6C12 3 16 2 18 5C22 5 24 8 22 10H6Z" stroke="#8DB8D4" strokeWidth="0.85" fill="none"/><line x1="9" y1="14" x2="8" y2="18" stroke="#8DB8D4" strokeWidth="0.85"/><line x1="13" y1="14" x2="12" y2="20" stroke="#8DB8D4" strokeWidth="0.85"/><line x1="17" y1="14" x2="16" y2="18" stroke="#8DB8D4" strokeWidth="0.85"/></svg>,
    flat: <svg width="26" height="26" viewBox="0 0 26 26" fill="none"><circle cx="13" cy="11" r="7" stroke="#D4826A" strokeWidth="0.85"/><line x1="6" y1="21" x2="20" y2="21" stroke="#D4826A" strokeWidth="0.85"/><line x1="13" y1="18" x2="13" y2="21" stroke="#D4826A" strokeWidth="0.85"/></svg>,
    scattered: <svg width="26" height="26" viewBox="0 0 26 26" fill="none"><circle cx="13" cy="13" r="2" fill="#C8A46A"/><circle cx="5" cy="7" r="1.5" fill="#C8A46A" opacity="0.5"/><circle cx="21" cy="7" r="1.5" fill="#C8A46A" opacity="0.5"/><circle cx="5" cy="19" r="1.5" fill="#C8A46A" opacity="0.5"/><circle cx="21" cy="19" r="1.5" fill="#C8A46A" opacity="0.5"/></svg>,
    clear: <svg width="26" height="26" viewBox="0 0 26 26" fill="none"><circle cx="13" cy="13" r="9" stroke="#7AB89A" strokeWidth="0.85"/><circle cx="13" cy="13" r="5" stroke="#7AB89A" strokeWidth="0.6" opacity="0.5"/><circle cx="13" cy="13" r="2" fill="#7AB89A" opacity="0.8"/></svg>,
  };
  return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'18px 24px 22px', background:'#0A0A12' }}>
      <div style={{ fontFamily:'Cinzel, serif', fontSize:14, letterSpacing:'0.08em', textAlign:'center', marginBottom:4 }}>How are you arriving today?</div>
      <div style={{ fontSize:12, fontStyle:'italic', color:'rgba(245,240,232,0.36)', textAlign:'center', marginBottom:20 }}>Shiho has settled you. Now notice what remains.</div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, maxWidth:380, width:'100%', marginBottom:20 }}>
        {STATES.map(s => {
          const sel = selectedState === s.id;
          return (
            <div key={s.id} style={{ display:'flex', flexDirection:'column', alignItems:'center', cursor:'pointer', padding:'14px 10px 12px', borderRadius:12, border:`0.5px solid ${sel ? s.color : 'rgba(245,240,232,0.07)'}`, background: sel ? `rgba(${s.rgb},0.08)` : 'rgba(245,240,232,0.02)', transition:'all 0.2s' }} onClick={() => onSelect(s.id)}>
              <div style={{ width:60, height:60, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:9, border:`1px solid ${sel ? s.color : 'rgba(245,240,232,0.1)'}` }}>
                <div style={{ width:42, height:42, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', background:`rgba(${s.rgb},${sel?'0.18':'0.07'})` }}>{icons[s.id]}</div>
              </div>
              <div style={{ fontFamily:'Cinzel, serif', fontSize:12, letterSpacing:'0.1em', marginBottom:2, color: sel ? s.color : 'rgba(245,240,232,0.55)' }}>{s.word}</div>
              <div style={{ fontSize:10, fontStyle:'italic', color:'rgba(245,240,232,0.32)', textAlign:'center', lineHeight:1.4 }}>{s.desc}</div>
            </div>
          );
        })}
      </div>
      <button style={{ padding:'11px 32px', borderRadius:8, border:'0.5px solid rgba(122,184,154,0.4)', background:'transparent', fontFamily:'Cinzel, serif', fontSize:11, letterSpacing:'0.2em', color:'#7AB89A', cursor: selectedState ? 'pointer' : 'default', opacity: selectedState ? 1 : 0.2 }} onClick={() => selectedState && onContinue()}>Continue →</button>
    </div>
  );
}

/* ── SEQUENCE ── */
function Sequence({ selectedState, sessionCount, sequence, onCountChange, onToggle, onBegin }) {
  const st = STATES.find(x => x.id === selectedState);
  if (!st) return null;
  return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', padding:'16px 20px 20px', background:'#0A0A12' }}>
      <div style={{ fontFamily:'Cinzel, serif', fontSize:8, letterSpacing:'0.2em', color:'rgba(245,240,232,0.28)', border:'0.5px solid rgba(245,240,232,0.1)', borderRadius:20, padding:'3px 12px', marginBottom:8 }}>Recommended for you</div>
      <div style={{ fontSize:13, fontStyle:'italic', color:'rgba(245,240,232,0.68)', lineHeight:1.6, marginBottom:5, textAlign:'center', maxWidth:420 }}>{st.msg}</div>
      <div style={{ fontSize:11, color:'rgba(245,240,232,0.35)', lineHeight:1.5, textAlign:'center', maxWidth:400, marginBottom:14 }}>
        Choose between one and {st.sequence.length} techniques. Shiho opens and closes every session automatically.
      </div>
      <div style={{ display:'flex', gap:8, width:'100%', maxWidth:420, marginBottom:14 }}>
        {st.sequence.slice(0,4).map((id,i) => {
          const t = TECHNIQUES[id]; const active = i < sessionCount;
          return (
            <div key={id} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', padding:'10px 6px', borderRadius:10, border:`0.5px solid ${active ? t.color : 'rgba(245,240,232,0.07)'}`, background: active ? `rgba(${t.rgb},0.07)` : 'rgba(245,240,232,0.02)', cursor:'pointer', opacity: active ? 1 : 0.28, position:'relative' }} onClick={() => onToggle(i)}>
              <div style={{ position:'absolute', top:5, right:7, fontFamily:'Cinzel, serif', fontSize:7.5, color:'rgba(245,240,232,0.18)' }}>{i+1}</div>
              <div style={{ width:30, height:30, borderRadius:'50%', border:`0.5px solid rgba(${t.rgb},${active?'0.5':'0.15'})`, background:`rgba(${t.rgb},${active?'0.12':'0.04'})`, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:5 }}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="5" stroke={t.color} strokeWidth="0.8" opacity={active?'0.8':'0.3'}/><circle cx="7" cy="7" r="2" fill={t.color} opacity={active?'0.7':'0.2'}/></svg>
              </div>
              <div style={{ fontFamily:'Cinzel, serif', fontSize:9, letterSpacing:'0.07em', textAlign:'center', color: active ? t.color : 'rgba(245,240,232,0.2)', lineHeight:1.3 }}>{t.name}</div>
              <div style={{ fontSize:9, fontStyle:'italic', color:'rgba(245,240,232,0.28)', marginTop:1 }}>{t.elem}</div>
            </div>
          );
        })}
      </div>
      <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:14 }}>
        <div style={{ fontFamily:'Cinzel, serif', fontSize:9, letterSpacing:'0.15em', color:'rgba(245,240,232,0.26)' }}>Techniques</div>
        <button style={S2.cntBtn} onClick={() => onCountChange(Math.max(1, sessionCount-1))}>−</button>
        <div style={{ fontFamily:'Cinzel, serif', fontSize:15, minWidth:18, textAlign:'center' }}>{sessionCount}</div>
        <button style={S2.cntBtn} onClick={() => onCountChange(Math.min(st.sequence.length, sessionCount+1))}>+</button>
      </div>
      <button style={{ padding:'11px 32px', borderRadius:8, border:'0.5px solid rgba(122,184,154,0.4)', background:'transparent', fontFamily:'Cinzel, serif', fontSize:11, letterSpacing:'0.2em', color:'#7AB89A', cursor:'pointer' }} onClick={onBegin}>Begin session →</button>
    </div>
  );
}

/* ── RUNNER ── */
function Runner({ sequence, techIndex, onComplete }) {
  const t = TECHNIQUES[sequence[techIndex]];
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const phaseStartRef = useRef(null);
  const [pIdx, setPIdx] = useState(0);
  const [phLbl, setPhLbl] = useState('');
  const [cdNum, setCdNum] = useState('—');
  const [progress, setProgress] = useState(0);
  const [donePips, setDonePips] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const flatRef = useRef([]);

  useEffect(() => {
    flatRef.current = buildFlatPhases(t, true);
    setPIdx(0); setPhLbl(''); setCdNum('—'); setProgress(0); setDonePips(0);
    drawBreathCircle(canvasRef.current, 0.05, t.color);
    phaseStartRef.current = performance.now();
  }, [techIndex, t]);

  const tick = useCallback(() => {
    const ph = flatRef.current[pIdx];
    if (!ph) { handleTechDone(); return; }
    const el = (performance.now() - phaseStartRef.current) / 1000;
    const prog = Math.min(el / ph.dur, 1);
    const lung = ph.name === 'inhale' ? prog : ph.name === 'exhale' ? 1-prog : ph.name === 'hold' ? 1 : 0.05;
    drawBreathCircle(canvasRef.current, lung, t.color);
    const lbl = ph.ph ? `${ph.ph} · ${PHASE_LABELS[ph.name]}` : PHASE_LABELS[ph.name] || '';
    setPhLbl(lbl); setCdNum(Math.max(1, Math.ceil(ph.dur*(1-prog))));
    const overall = (pIdx / flatRef.current.length) + (prog / flatRef.current.length);
    setProgress(Math.round(overall * 100));
    if (t.type === 'cycle') {
      const ppc = [t.inhale,t.hold,t.exhale,t.endHold].filter(Boolean).length;
      setDonePips(Math.floor(pIdx / ppc));
    }
    if (prog >= 1) {
      const next = pIdx + 1;
      if (next >= flatRef.current.length) { handleTechDone(); return; }
      setPIdx(next); phaseStartRef.current = performance.now();
    }
    animRef.current = requestAnimationFrame(tick);
  }, [pIdx, t]);

  function handleTechDone() {
    if (animRef.current) cancelAnimationFrame(animRef.current);
    if (techIndex < sequence.length - 1) {
      setTransitioning(true);
      setTimeout(() => { setTransitioning(false); onComplete(); }, 2500);
    } else { onComplete(); }
  }

  useEffect(() => {
    animRef.current = requestAnimationFrame(tick);
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, [tick]);

  const totalCycles = t.type === 'cycle' ? Math.round((t.dur||60) / ((t.inhale||0)+(t.hold||0)+(t.exhale||0)+(t.endHold||0))) : null;
  const nextT = techIndex < sequence.length-1 ? TECHNIQUES[sequence[techIndex+1]] : null;

  return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', position:'relative', overflow:'hidden' }}>
      <div style={{ position:'absolute', inset:0, background:t.bg.base, pointerEvents:'none', transition:'background 1.5s ease' }}>
        <svg width="100%" height="100%" viewBox="0 0 420 280" preserveAspectRatio="xMidYMid slice" style={{ position:'absolute', inset:0 }}>
          <rect width="420" height="280" fill={t.bg.base} />
          <rect width="420" height="140" fill={t.bg.a1} opacity="0.5" />
          <rect y="140" width="420" height="140" fill={t.bg.a2} opacity="0.4" />
          {t.pts.map(([x,y],i) => <circle key={i} cx={x} cy={y} r={1+i%2*0.8} fill={t.color} opacity={0.04+i%3*0.03} />)}
        </svg>
      </div>

      <div style={{ position:'relative', zIndex:1, flex:1, display:'flex' }}>
        {/* Left */}
        <div style={{ width:190, flexShrink:0, display:'flex', flexDirection:'column', justifyContent:'center', padding:'14px 12px 14px 18px', borderRight:'0.5px solid rgba(245,240,232,0.05)' }}>
          <div style={{ marginBottom:14 }}>
            <div style={{ fontFamily:'Cinzel, serif', fontSize:7, letterSpacing:'0.2em', color:'rgba(245,240,232,0.2)', marginBottom:7 }}>Session progress</div>
            {sequence.map((id,i) => {
              const st = TECHNIQUES[id];
              const isDone = i < techIndex, isCur = i === techIndex;
              return (
                <div key={id} style={{ display:'flex', alignItems:'center', gap:7, padding:'5px 8px', borderRadius:6, border:`0.5px solid ${isCur?'rgba(245,240,232,0.1)':'transparent'}`, background: isCur ? 'rgba(245,240,232,0.04)' : 'transparent', marginBottom:2 }}>
                  <div style={{ width:6, height:6, borderRadius:'50%', background: isDone||isCur ? st.color : 'rgba(245,240,232,0.12)', flexShrink:0 }} />
                  <div style={{ fontFamily:'Cinzel, serif', fontSize:9, letterSpacing:'0.05em', color: isDone||isCur ? st.color : 'rgba(245,240,232,0.25)', flex:1 }}>{st.name}</div>
                  {isDone && <div style={{ fontSize:10, color:'rgba(245,240,232,0.3)' }}>✓</div>}
                </div>
              );
            })}
          </div>
          <div style={{ height:'0.5px', background:'rgba(245,240,232,0.05)', marginBottom:10 }} />
          <div style={{ fontFamily:'Cinzel, serif', fontSize:7, letterSpacing:'0.2em', color:'rgba(245,240,232,0.2)', marginBottom:5 }}>Now breathing</div>
          <div style={{ fontFamily:'Cinzel, serif', fontSize:15, fontWeight:700, color:t.color, marginBottom:3, lineHeight:1.1 }}>{t.name}</div>
          <div style={{ fontSize:10, fontStyle:'italic', color:'rgba(245,240,232,0.45)', lineHeight:1.55 }}>{t.cue}</div>
        </div>

        {/* Centre */}
        <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'10px 6px' }}>
          <div style={{ fontFamily:'Cinzel, serif', fontSize:10, letterSpacing:'0.22em', minHeight:15, textAlign:'center', marginBottom:9, textTransform:'uppercase', color:t.color }}>{phLbl}</div>
          <div style={{ position:'relative', width:200, height:200 }}>
            <canvas ref={canvasRef} width={200} height={200} style={{ position:'absolute', top:0, left:0, width:200, height:200 }} />
          </div>
          <div style={{ display:'flex', flexDirection:'column', alignItems:'center', marginTop:7 }}>
            <div style={{ fontFamily:'Cinzel, serif', fontSize:26, fontWeight:700, color:t.color, lineHeight:1 }}>{cdNum}</div>
            <div style={{ fontFamily:'Cinzel, serif', fontSize:7, letterSpacing:'0.18em', opacity:0.32, marginTop:2 }}>{phLbl}</div>
          </div>
        </div>

        {/* Right */}
        <div style={{ width:130, flexShrink:0, display:'flex', flexDirection:'column', justifyContent:'center', padding:'14px 16px 14px 10px', borderLeft:'0.5px solid rgba(245,240,232,0.05)' }}>
          <div style={{ fontFamily:'Cinzel, serif', fontSize:7, letterSpacing:'0.18em', color:'rgba(245,240,232,0.22)', marginBottom:7 }}>
            {t.type === 'cycle' ? 'Progress' : 'Phases'}
          </div>
          {t.type === 'cycle' && totalCycles && (
            <div style={{ display:'flex', flexDirection:'column', gap:4, marginBottom:12 }}>
              {Array.from({length:Math.min(totalCycles,10)},(_,i) => (
                <div key={i} style={{ display:'flex', alignItems:'center', gap:5 }}>
                  <div style={{ width:6, height:6, borderRadius:'50%', background: i<donePips ? t.color : 'rgba(245,240,232,0.08)', transition:'background 0.35s' }} />
                  <div style={{ fontFamily:'Cinzel, serif', fontSize:7.5, letterSpacing:'0.04em', color: i<donePips ? 'rgba(245,240,232,0.5)' : 'rgba(245,240,232,0.18)' }}>Breath {i+1}</div>
                </div>
              ))}
            </div>
          )}
          <div style={{ fontFamily:'Cinzel, serif', fontSize:7, letterSpacing:'0.18em', color:'rgba(245,240,232,0.22)', marginBottom:5 }}>Overall session</div>
          <div style={{ width:'100%', height:2, background:'rgba(245,240,232,0.06)', borderRadius:2, overflow:'hidden' }}>
            <div style={{ height:'100%', borderRadius:2, background:t.color, width:`${progress}%`, transition:'width 0.2s linear' }} />
          </div>
        </div>
      </div>

      {/* Transition overlay */}
      {transitioning && nextT && (
        <div style={{ position:'absolute', inset:0, zIndex:8, background:`${nextT.bg.base}CC`, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', textAlign:'center' }}>
          <div style={{ fontFamily:'Cinzel, serif', fontSize:9, letterSpacing:'0.2em', color:'rgba(245,240,232,0.3)', marginBottom:8 }}>Next</div>
          <div style={{ fontFamily:'Cinzel, serif', fontSize:18, fontWeight:700, color:nextT.color, letterSpacing:'0.06em' }}>{nextT.name}</div>
          <div style={{ width:120, height:1.5, background:'rgba(245,240,232,0.1)', borderRadius:2, marginTop:12, overflow:'hidden' }}>
            <div style={{ height:'100%', background:nextT.color, animation:'trans-fill 2.5s linear forwards', width:'0%' }} />
          </div>
        </div>
      )}
      <style>{`@keyframes trans-fill { from{width:0%} to{width:100%} }`}</style>
    </div>
  );
}

/* ── SUMMARY ── */
function Summary({ sequence, elapsed, techsDone, onReturn }) {
  const xp = 10 + techsDone * 10;
  const elements = [...new Set(sequence.slice(0, techsDone).map(id => TECHNIQUES[id].elem))].length;
  return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:24, textAlign:'center', background:'#0A0A12' }}>
      <div style={{ fontFamily:'Cinzel, serif', fontSize:9, letterSpacing:'0.25em', color:'rgba(245,240,232,0.28)', marginBottom:14 }}>Session Complete</div>
      <div style={{ fontFamily:'Cinzel, serif', fontSize:30, fontWeight:700, color:'#7AB89A', marginBottom:6, letterSpacing:'0.08em' }}>Present</div>
      <div style={{ fontSize:13, fontStyle:'italic', color:'rgba(245,240,232,0.42)', marginBottom:20, lineHeight:1.6 }}>
        Shiho opened. You breathed. Shiho closed.<br />The dojo is always here when you return.
      </div>
      <div style={{ display:'flex', gap:12, justifyContent:'center', marginBottom:20 }}>
        {[[elapsed,'Time'],[techsDone,'Techniques'],[elements,'Elements']].map(([v,l]) => (
          <div key={l} style={{ padding:'10px 16px', border:'0.5px solid rgba(245,240,232,0.08)', borderRadius:8, background:'rgba(245,240,232,0.02)', textAlign:'center' }}>
            <div style={{ fontFamily:'Cinzel, serif', fontSize:20, fontWeight:700, color:'#7AB89A', lineHeight:1 }}>{v}</div>
            <div style={{ fontFamily:'Cinzel, serif', fontSize:7.5, letterSpacing:'0.12em', color:'rgba(245,240,232,0.28)', marginTop:3 }}>{l}</div>
          </div>
        ))}
      </div>
      <div style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'7px 20px', border:'0.5px solid rgba(122,184,154,0.25)', borderRadius:8, background:'rgba(122,184,154,0.05)', marginBottom:20 }}>
        <span style={{ fontFamily:'Cinzel, serif', fontSize:9, letterSpacing:'0.15em', color:'rgba(122,184,154,0.55)' }}>Mushin XP Earned</span>
        <span style={{ fontFamily:'Cinzel, serif', fontSize:18, color:'#7AB89A', fontWeight:700 }}>+{xp}</span>
      </div>
      <button style={{ padding:'10px 28px', borderRadius:8, border:'0.5px solid rgba(122,184,154,0.35)', background:'transparent', fontFamily:'Cinzel, serif', fontSize:10, letterSpacing:'0.18em', color:'#7AB89A', cursor:'pointer' }} onClick={onReturn}>Return to breath home</button>
    </div>
  );
}

const S = {
  topbar: { height:44, display:'flex', alignItems:'center', padding:'0 20px', borderBottom:'0.5px solid rgba(245,240,232,0.07)', flexShrink:0 },
  back: { fontFamily:'Cinzel, serif', fontSize:10, letterSpacing:'0.12em', color:'rgba(245,240,232,0.35)', background:'none', border:'none', cursor:'pointer', padding:0, width:80 },
  tbTitle: { flex:1, textAlign:'center', fontFamily:'Cinzel, serif', fontSize:11, letterSpacing:'0.2em', color:'rgba(245,240,232,0.28)' },
};

const S2 = {
  cntBtn: { width:26, height:26, borderRadius:'50%', border:'0.5px solid rgba(245,240,232,0.18)', background:'transparent', color:'#F5F0E8', cursor:'pointer', fontSize:14, display:'flex', alignItems:'center', justifyContent:'center' },
};
