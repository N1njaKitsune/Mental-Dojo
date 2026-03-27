import React from 'react';
import { ELEMENTS } from './data';

export default function BreathHome({ go, goHome }) {
  return (
    <div style={S.wrap}>
      <div style={S.topbar}>
        <button style={S.back} onClick={goHome}>← Mental Dojo</button>
        <div style={S.title}>Mushin · Breath</div>
        <div style={{ width: 80 }} />
      </div>
      <div style={S.body}>
        <svg style={S.svg} viewBox="0 0 760 420" xmlns="http://www.w3.org/2000/svg">
          <polygon points="380,44 640,196 380,348 120,196" fill="none" stroke="rgba(245,240,232,0.04)" strokeWidth="0.5" />
          <line x1="380" y1="58"  x2="380" y2="152" stroke="rgba(141,184,212,0.15)" strokeWidth="0.75" strokeDasharray="3 4" />
          <line x1="380" y1="298" x2="380" y2="218" stroke="rgba(106,156,200,0.15)" strokeWidth="0.75" strokeDasharray="3 4" />
          <line x1="132" y1="196" x2="208" y2="196" stroke="rgba(200,164,106,0.15)" strokeWidth="0.75" strokeDasharray="3 4" />
          <line x1="628" y1="196" x2="552" y2="196" stroke="rgba(212,130,106,0.15)" strokeWidth="0.75" strokeDasharray="3 4" />
          <circle cx="380" cy="196" r="54" fill="none" stroke="rgba(200,216,232,0.04)" strokeWidth="0.5" />
          <circle cx="380" cy="196" r="40" fill="none" stroke="rgba(200,216,232,0.06)" strokeWidth="0.5" />
          <circle cx="380" cy="196" r="30" fill="none" stroke="rgba(200,216,232,0.1)" strokeWidth="0.5" style={{ animation: 'shiho-pulse 3s ease-in-out infinite' }} />
          <g style={{ cursor: 'pointer' }} onClick={() => go('technique', { techId: 'shiho' })}>
            <circle cx="380" cy="196" r="22" fill="rgba(200,216,232,0.06)" stroke="rgba(200,216,232,0.32)" strokeWidth="1" />
            <rect x="372" y="188" width="16" height="16" fill="none" stroke="rgba(200,216,232,0.55)" strokeWidth="0.85" rx="1" />
            <text x="380" y="215" textAnchor="middle" fontFamily="Cinzel,serif" fontSize="7" fill="rgba(200,216,232,0.4)" letterSpacing="1.5">SHIHO</text>
          </g>
          <ElementNode cx={380} cy={44}  el={ELEMENTS.kaze} labelBelow={true}  onClick={() => go('element', { elemId: 'kaze' })} />
          <ElementNode cx={380} cy={310} el={ELEMENTS.mizu} labelBelow={false} onClick={() => go('element', { elemId: 'mizu' })} />
          <ElementNode cx={120} cy={196} el={ELEMENTS.chi}  labelBelow={true}  onClick={() => go('element', { elemId: 'chi'  })} />
          <ElementNode cx={640} cy={196} el={ELEMENTS.hi}   labelBelow={true}  onClick={() => go('element', { elemId: 'hi'   })} />
          <g style={{ cursor: 'pointer' }} onClick={() => go('session')}>
            <rect x="300" y="374" width="160" height="24" rx="12" fill="rgba(122,184,154,0.07)" stroke="rgba(122,184,154,0.28)" strokeWidth="0.75" />
            <text x="380" y="390" textAnchor="middle" fontFamily="Cinzel,serif" fontSize="8" fill="rgba(122,184,154,0.72)" letterSpacing="2">BEGIN SESSION</text>
          </g>
          <text x="20" y="18" fontFamily="Cinzel,serif" fontSize="7" fill="rgba(245,240,232,0.1)" letterSpacing="1">MUSHIN · BREATH</text>
        </svg>
      </div>
    </div>
  );
}

function ElementNode({ cx, cy, el, labelBelow, onClick }) {
  const [hover, setHover] = React.useState(false);
  const lY  = labelBelow ? cy + 32 : cy - 24;
  const lY2 = labelBelow ? cy + 43 : cy - 13;
  return (
    <g style={{ cursor: 'pointer' }} onClick={onClick}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
      <circle cx={cx} cy={cy} r={32} fill={`rgba(${el.rgb},0.03)`} stroke={`rgba(${el.rgb},0.08)`} strokeWidth="0.5" />
      <circle cx={cx} cy={cy} r={22} fill={`rgba(${el.rgb},${hover?'0.12':'0.07'})`} stroke={`rgba(${el.rgb},${hover?'0.65':'0.40'})`} strokeWidth="1" />
      <circle cx={cx} cy={cy} r={12} fill={`rgba(${el.rgb},0.1)`} stroke={`rgba(${el.rgb},0.22)`} strokeWidth="0.5" />
      <ElementIcon el={el} cx={cx} cy={cy} />
      <text x={cx} y={lY}  textAnchor="middle" fontFamily="Cinzel,serif" fontSize="9"  fill={`rgba(${el.rgb},0.78)`} letterSpacing="1.5">{el.name.toUpperCase()}</text>
      <text x={cx} y={lY2} textAnchor="middle" fontFamily="Cinzel,serif" fontSize="7.5" fill="rgba(245,240,232,0.28)" letterSpacing="0.5">{el.element}</text>
    </g>
  );
}

function ElementIcon({ el, cx, cy }) {
  if (el.id === 'kaze') return (<><path d={`M${cx-8} ${cy-2} Q${cx-4} ${cy-5} ${cx} ${cy-2} Q${cx+4} ${cy+1} ${cx+8} ${cy-2}`} fill="none" stroke={`rgba(${el.rgb},0.85)`} strokeWidth="0.85" strokeLinecap="round" /><path d={`M${cx-6} ${cy+2} Q${cx-2} ${cy-1} ${cx+2} ${cy+2}`} fill="none" stroke={`rgba(${el.rgb},0.5)`} strokeWidth="0.75" strokeLinecap="round" /></>);
  if (el.id === 'chi')  return (<><polygon points={`${cx},${cy-7} ${cx+6},${cy+3} ${cx-6},${cy+3}`} fill="none" stroke={`rgba(${el.rgb},0.85)`} strokeWidth="0.85" strokeLinejoin="round" /><line x1={cx-6} y1={cy-1} x2={cx+6} y2={cy-1} stroke={`rgba(${el.rgb},0.5)`} strokeWidth="0.7" /></>);
  if (el.id === 'mizu') return (<><path d={`M${cx} ${cy-8} Q${cx+5} ${cy-3} ${cx} ${cy+4} Q${cx-5} ${cy-3} ${cx} ${cy-8}Z`} fill="none" stroke={`rgba(${el.rgb},0.85)`} strokeWidth="0.85" /><path d={`M${cx-6} ${cy+2} Q${cx-3} ${cy-1} ${cx} ${cy+2} Q${cx+3} ${cy-1} ${cx+6} ${cy+2}`} fill="none" stroke={`rgba(${el.rgb},0.5)`} strokeWidth="0.7" strokeLinecap="round" /></>);
  if (el.id === 'hi')   return (<><path d={`M${cx} ${cy-7} Q${cx+4} ${cy-2} ${cx+2} ${cy+3} Q${cx} ${cy+5} ${cx-2} ${cy+3} Q${cx-4} ${cy-2} ${cx} ${cy-7}Z`} fill="none" stroke={`rgba(${el.rgb},0.85)`} strokeWidth="0.85" /><path d={`M${cx-4} ${cy+4} Q${cx-2} ${cy+1} ${cx} ${cy+4} Q${cx+2} ${cy+1} ${cx+4} ${cy+4}`} fill="none" stroke={`rgba(${el.rgb},0.5)`} strokeWidth="0.7" strokeLinecap="round" /></>);
  return null;
}

const S = {
  wrap:   { width:'100%', height:'100%', background:'#0A0A12', display:'flex', flexDirection:'column' },
  topbar: { height:44, display:'flex', alignItems:'center', padding:'0 20px', borderBottom:'0.5px solid rgba(245,240,232,0.07)', flexShrink:0 },
  back:   { fontFamily:'Cinzel, serif', fontSize:10, letterSpacing:'0.12em', color:'rgba(245,240,232,0.35)', background:'none', border:'none', cursor:'pointer', padding:0, width:80 },
  title:  { flex:1, textAlign:'center', fontFamily:'Cinzel, serif', fontSize:11, letterSpacing:'0.2em', color:'rgba(245,240,232,0.28)' },
  body:   { flex:1, display:'flex', alignItems:'center', justifyContent:'center', padding:'4px 8px', overflow:'hidden' },
  svg:    { width:'100%', height:'100%', maxWidth:760, display:'block' },
};
