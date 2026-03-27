import React, { useRef, useEffect, useCallback, useState } from 'react';
import { TECHNIQUES, STATES, SHIHO, buildFlatPhases, drawBreathCircle, PHASE_LABELS } from './data';

const VIEWS = { SHIHO_OPEN:'shiho-open', CHECKIN:'checkin', SEQUENCE:'sequence', RUNNER:'runner', SHIHO_CLOSE:'shiho-close', SUMMARY:'summary' };
const SHIHO_SESSION = { ...SHIHO, cycles: 3 };

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

  function endSession() { stopTimer(); go('breath-home'); }
  function onShihoOpenComplete() { setView(VIEWS.CHECKIN); }
  function onShihoCloseComplete() { stopTimer(); setView(VIEWS.SUMMARY); }
  function selectState(id) {
    setSelectedState(id);
    const st = STATES.find(x => x.id === id);
    setSequence(st.sequence.slice(0, sessionCount));
  }
  function startSession() { setTechIndex(0); startTimer(); setView(VIEWS.RUNNER); }
  function onTechComplete(idx) {
    if (idx < sequence.length - 1) { setTechIndex(idx + 1); }
    else { setView(VIEWS.SHIHO_CLOSE); }
  }

  return (
    <div style={{ width:'100%', height:'100%', display:'flex', flexDirection:'column', background:'#0A0A12' }}>
      <div style={S.topbar}>
        <button style={S.back} onClick={endSession}>✕ End Session</button>
        <div style={S.tbTitle}>
          {view === VIEWS.SHIHO_OPEN  && 'Mushin · Opening'}
          {view === VIEWS.CHECKIN     && 'Mushin · Session'}
          {view === VIEWS.SEQUENCE    && 'Mushin · Build Session'}
          {view === VIEWS.RUNNER      && 'Mushin · Breathing'}
          {view === VIEWS.SHIHO_CLOSE && 'Mushin · Closing'}
          {view === VIEWS.SUMMARY     && 'Mushin · Complete'}
        </div>
        <div style={{ width:80, textAlign:'right', fontFamily:'Cinzel,serif', fontSize:10, letterSpacing:'0.1em', color:'rgba(245,240,232,0.25)' }}>
          {(view === VIEWS.RUNNER || view === VIEWS.SHIHO_CLOSE) ? elapsedStr : ''}
        </div>
      </div>

      {view === VIEWS.SHIHO_OPEN  && <ShihoGate mode="open"  onComplete={onShihoOpenComplete}  onEnd={endSession} />}
      {view === VIEWS.CHECKIN     && <CheckIn selectedState={selectedState} onSelect={selectState} onContinue={() => setView(VIEWS.SEQUENCE)} onEnd={endSession} />}
      {view === VIEWS.SEQUENCE    && <Sequence selectedState={selectedState} sessionCount={sessionCount} sequence={sequence}
        onCountChange={n => { setSessionCount(n); const st = STATES.find(x => x.id === selectedState); setSequence(st.sequence.slice(0,n)); }}
        onToggle={i => { setSessionCount(i+1); const st = STATES.find(x => x.id === selectedState); setSequence(st.sequence.slice(0,i+1)); }}
        onBegin={startSession} onEnd={endSession} />}
      {view === VIEWS.RUNNER      && <Runner sequence={sequence} techIndex={techIndex} onComplete={() => onTechComplete(techIndex)} onEnd={endSession} />}
      {view === VIEWS.SHIHO_CLOSE && <ShihoGate mode="close" onComplete={onShihoCloseComplete} onEnd={endSession} />}
      {view === VIEWS.SUMMARY     && <Summary sequence={sequence} elapsed={elapsedStr} techsDone={sequence.length} onReturn={() => go('breath-home')} />}
    </div>
  );
}

function EndBtn({ onEnd }) {
  return <button style={S.endBtn} onClick={onEnd}>✕ End Session</button>;
}

/* ── SHIHO GATE — landscape row layout ── */
function ShihoGate({ mode, onComplete, onEnd }) {
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
    flatRef.current = buildFlatPhases(SHIHO_SESSION, false);
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
      setPIdx(next); phaseStartRef.current = performance.now();
    }
    animRef.current = requestAnimationFrame(tick);
  }, [pIdx, onComplete]);

  useEffect(() => {
    if (running) animRef.current = requestAnimationFrame(tick);
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, [running, tick]);

  return (
    <div style={{ flex:1, display:'flex', flexDirection:'row', alignItems:'stretch', background:'#080C10', minHeight:0, position:'relative', overflow:'hidden' }}>
      {/* Left info panel */}
      <div style={{ width:220, flexShrink:0, display:'flex', flexDirection:'column', justifyContent:'center', padding:'16px 20px', borderRight:'0.5px solid rgba(200,216,232,0.06)' }}>
        <div style={{ fontFamily:'Cinzel,serif', fontSize:8, letterSpacing:'0.25em', color:'rgba(200,216,232,0.3)', marginBottom:8 }}>
          {mode === 'open' ? 'Opening Ritual' : 'Closing Ritual'}
        </div>
        <div style={{ fontFamily:'Cinzel,serif', fontSize:24, fontWeight:700, color:'#C8D8E8', letterSpacing:'0.1em', marginBottom:6 }}>Shiho</div>
        <div style={{ fontSize:11, fontStyle:'italic', color:'rgba(245,240,232,0.4)', lineHeight:1.55, marginBottom:10 }}>
          {mode === 'open' ? SHIHO.cue : SHIHO.closeCue}
        </div>
        {mode === 'open' && !running && (
          <div style={{ fontSize:9, color:'rgba(200,216,232,0.45)', fontFamily:'Cinzel,serif', letterSpacing:'0.08em', marginBottom:10 }}>
            Complete 3 rounds to proceed
          </div>
        )}
        <div style={{ display:'flex', gap:6, marginBottom:12 }}>
          {Array.from({length:SHIHO_SESSION.cycles},(_,i) => (
            <div key={i} style={{ width:7, height:7, borderRadius:'50%', background: i<donePips ? '#C8D8E8' : 'rgba(200,216,232,0.1)', transition:'background 0.4s' }} />
          ))}
        </div>
        {!running && (
          <button style={{ background:'none', border:'0.5px solid rgba(200,216,232,0.2)', borderRadius:6, padding:'6px 16px', fontFamily:'Cinzel,serif', fontSize:9, letterSpacing:'0.15em', color:'rgba(200,216,232,0.5)', cursor:'pointer', alignSelf:'flex-start' }}
            onClick={() => { phaseStartRef.current = performance.now(); setRunning(true); }}>
            Begin ↓
          </button>
        )}
      </div>
      {/* Centre canvas */}
      <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'10px 0' }}>
        <div style={{ fontFamily:'Cinzel,serif', fontSize:10, letterSpacing:'0.22em', minHeight:14, textAlign:'center', marginBottom:8, textTransform:'uppercase', color:'rgba(200,216,232,0.5)' }}>{phLbl}</div>
        <div style={{ position:'relative', width:160, height:160 }}>
          <canvas ref={canvasRef} width={160} height={160} style={{ position:'absolute', top:0, left:0, width:160, height:160 }} />
        </div>
        <div style={{ display:'flex', flexDirection:'column', alignItems:'center', marginTop:8 }}>
          <div style={{ fontFamily:'Cinzel,serif', fontSize:30, fontWeight:700, color:'#C8D8E8', lineHeight:1 }}>{cdNum}</div>
          <div style={{ fontFamily:'Cinzel,serif', fontSize:7, letterSpacing:'0.18em', color:'rgba(200,216,232,0.35)', marginTop:2 }}>{phLbl}</div>
        </div>
      </div>
      <EndBtn onEnd={onEnd} />
    </div>
  );
}