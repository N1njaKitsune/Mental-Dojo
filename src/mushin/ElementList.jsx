import React from 'react';
import { ELEMENTS, TECHNIQUES } from './data';

export default function ElementList({ go, goHome, params }) {
  const el = ELEMENTS[params.elemId];
  if (!el) return null;
  const t0 = TECHNIQUES[el.techniques[0]];

  return (
    <div style={{ width:'100%', height:'100%', display:'flex', flexDirection:'column', position:'relative', overflow:'hidden' }}>
      {/* Atmospheric bg */}
      <div style={{ position:'absolute', inset:0, background:t0.bg.base, pointerEvents:'none' }}>
        <svg width="100%" height="100%" viewBox="0 0 420 300" preserveAspectRatio="xMidYMid slice" style={{ position:'absolute', inset:0 }}>
          <rect width="420" height="300" fill={t0.bg.base} />
          <rect x="0" y="0" width="420" height="150" fill={t0.bg.a1} opacity="0.5" />
          <rect x="0" y="150" width="420" height="150" fill={t0.bg.a2} opacity="0.4" />
          {t0.pts.map(([x,y],i) => <circle key={i} cx={x} cy={y} r={1+i%2*0.8} fill={t0.color} opacity={0.04+i%3*0.03} />)}
        </svg>
      </div>

      {/* Topbar */}
      <div style={{ ...S.topbar, position:'relative', zIndex:1 }}>
        <button style={S.back} onClick={() => go('breath-home')}>← Breath</button>
        <div style={{ ...S.title, color:`rgba(${el.rgb},0.6)` }}>{el.name} · {el.element}</div>
        <div style={{ width:80 }} />
      </div>

      {/* Content */}
      <div style={{ position:'relative', zIndex:1, flex:1, padding:'16px 20px 20px', display:'flex', flexDirection:'column' }}>
        <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:12 }}>
          <div style={{ width:44, height:44, borderRadius:'50%', background:`rgba(${el.rgb},0.1)`, border:`0.5px solid rgba(${el.rgb},0.3)`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
            <ElementIconLarge el={el} />
          </div>
          <div>
            <div style={{ fontFamily:'Cinzel, serif', fontSize:18, fontWeight:700, color:el.color, letterSpacing:'0.06em' }}>{el.name}</div>
            <div style={{ fontFamily:'Cinzel, serif', fontSize:8, letterSpacing:'0.2em', color:`rgba(${el.rgb},0.4)`, marginTop:2 }}>{el.element.toUpperCase()} · BREATHING</div>
          </div>
        </div>

        <div style={{ fontSize:12, fontStyle:'italic', color:'rgba(245,240,232,0.5)', lineHeight:1.55, marginBottom:14, maxWidth:480 }}>
          {el.desc}
        </div>

        <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
          {el.techniques.map(id => {
            const t = TECHNIQUES[id];
            const dur = t.type === 'cycle' ? t.dur + 's' : '60s';
            return (
              <div key={id}
                style={{
                  display:'flex', alignItems:'center', gap:12,
                  padding:'11px 14px', borderRadius:8,
                  border:`0.5px solid ${t.locked ? 'rgba(245,240,232,0.06)' : 'rgba(245,240,232,0.08)'}`,
                  background:'rgba(245,240,232,0.02)',
                  cursor: t.locked ? 'default' : 'pointer',
                  opacity: t.locked ? 0.3 : 1,
                  transition:'all 0.15s',
                }}
                onClick={() => !t.locked && go('technique', { techId: id })}
              >
                <div style={{ width:9, height:9, borderRadius:'50%', background: t.locked ? 'rgba(245,240,232,0.15)' : el.color, flexShrink:0 }} />
                <div style={{ flex:1 }}>
                  <div style={{ fontFamily:'Cinzel, serif', fontSize:12, letterSpacing:'0.06em', color: t.locked ? 'rgba(245,240,232,0.25)' : el.color }}>{t.name}</div>
                  <div style={{ fontSize:10, fontStyle:'italic', color:'rgba(245,240,232,0.38)', marginTop:1 }}>{t.realName}</div>
                </div>
                <div style={{ display:'flex', alignItems:'center', gap:8, flexShrink:0 }}>
                  <span style={{ fontFamily:'Cinzel, serif', fontSize:9, letterSpacing:'0.1em', color:'rgba(245,240,232,0.25)' }}>{dur}</span>
                  {t.locked
                    ? <span style={{ fontSize:10, color:'rgba(245,240,232,0.2)' }}>Locked</span>
                    : <span style={{ fontSize:14, color:`rgba(${el.rgb},0.5)` }}>›</span>
                  }
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function ElementIconLarge({ el }) {
  const s = `rgba(${el.rgb},0.85)`;
  if (el.id === 'kaze') return <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M4 10 Q8 7 11 10 Q14 13 18 10" stroke={s} strokeWidth="0.85" strokeLinecap="round" /><path d="M6 14 Q9 11 11 14" stroke={`rgba(${el.rgb},0.5)`} strokeWidth="0.7" strokeLinecap="round" /></svg>;
  if (el.id === 'chi') return <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><polygon points="11,5 17,15 5,15" stroke={s} strokeWidth="0.85" strokeLinejoin="round" /><line x1="5" y1="11" x2="17" y2="11" stroke={`rgba(${el.rgb},0.5)`} strokeWidth="0.7" /></svg>;
  if (el.id === 'mizu') return <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M11 4 Q15 9 11 15 Q7 9 11 4Z" stroke={s} strokeWidth="0.85" /><path d="M6 16 Q8.5 13 11 16 Q13.5 13 16 16" stroke={`rgba(${el.rgb},0.5)`} strokeWidth="0.7" strokeLinecap="round" /></svg>;
  if (el.id === 'hi') return <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M11 3 Q15 8 13 13 Q11 15 9 13 Q7 8 11 3Z" stroke={s} strokeWidth="0.85" /><path d="M7 17 Q9 14 11 17 Q13 14 15 17" stroke={`rgba(${el.rgb},0.5)`} strokeWidth="0.7" strokeLinecap="round" /></svg>;
  return null;
}

const S = {
  topbar: { height:44, display:'flex', alignItems:'center', padding:'0 20px', borderBottom:'0.5px solid rgba(245,240,232,0.07)', flexShrink:0 },
  back: { fontFamily:'Cinzel, serif', fontSize:10, letterSpacing:'0.12em', color:'rgba(245,240,232,0.35)', background:'none', border:'none', cursor:'pointer', padding:0, width:80 },
  title: { flex:1, textAlign:'center', fontFamily:'Cinzel, serif', fontSize:11, letterSpacing:'0.2em' },
};
