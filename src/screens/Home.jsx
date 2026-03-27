import React from 'react';

const DISCIPLINES = [
  {
    kanji: '目付', name: 'Metsuke', sub: 'The Reading Mind',
    tags: 'Perception · Comprehension · Intake',
    quote: '"The untrained eye sees. The ninja\'s eye reads."',
    desc: 'Metsuke is the art of soft perception — training the eye to take in everything without fixing on any single point. In the Ninja School, it develops situational awareness, pattern recognition, and the ability to read a room before acting. A ninja who cannot read cannot respond.',
    color: '#B8A898', live: false,
  },
  {
    kanji: '無心', name: 'Mushin', sub: 'The Still Mind',
    tags: 'Breath · Focus · Regulation',
    quote: '"The untrained mind is full of noise. The ninja\'s mind is full of space."',
    desc: 'Mushin is the state of no-mind — where thought does not obstruct action. Through breath and regulation, students learn to quiet internal noise, reset under pressure, and return to baseline before entering any challenge. The still mind is not empty. It is clear.',
    color: '#7AB89A', live: true,
  },
  {
    kanji: '太刀', name: 'Tachi', sub: 'The Striking Mind',
    tags: 'Strategy · Speed · Output',
    quote: '"The untrained mind rushes or freezes. The ninja\'s mind is always ready."',
    desc: 'Tachi trains the mind to act with precision and intent — decisive, fast, and without hesitation. Where Metsuke reads and Mushin regulates, Tachi executes. Students learn to channel focus into output, and to strike — physically, mentally, or strategically — at exactly the right moment.',
    color: '#C8906A', live: false,
  },
];

export default function Home({ navigate }) {
  const go = navigate;
  return (
    <div style={S.wrap}>
      <div style={S.header}>
        <div style={S.logoMark}>
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <circle cx="16" cy="16" r="14" stroke="rgba(200,180,140,0.5)" strokeWidth="0.75"/>
            <circle cx="16" cy="16" r="9" stroke="rgba(200,180,140,0.3)" strokeWidth="0.5"/>
            <circle cx="16" cy="16" r="3" fill="rgba(200,180,140,0.6)"/>
            <line x1="16" y1="2" x2="16" y2="8" stroke="rgba(200,180,140,0.4)" strokeWidth="0.75"/>
            <line x1="16" y1="24" x2="16" y2="30" stroke="rgba(200,180,140,0.4)" strokeWidth="0.75"/>
            <line x1="2" y1="16" x2="8" y2="16" stroke="rgba(200,180,140,0.4)" strokeWidth="0.75"/>
            <line x1="24" y1="16" x2="30" y2="16" stroke="rgba(200,180,140,0.4)" strokeWidth="0.75"/>
          </svg>
        </div>
        <div style={S.headerText}>
          <div style={S.logoTitle}>The Mental Dojo</div>
          <div style={S.logoSub}>Where the mind becomes a weapon</div>
        </div>
      </div>

      <div style={S.tagline}>
        A ninja's greatest weapon is their mind — trained in three ways. Read clearly. Strike decisively. Be still.
      </div>

      <div style={S.grid}>
        {DISCIPLINES.map(d => (
          <div key={d.name} style={{ ...S.card, borderColor: `${d.color}22` }}>
            <div style={S.cardInner}>
              <div style={S.kanji(d.color)}>{d.kanji}</div>
              <div style={S.disciplineName(d.color)}>{d.name.toUpperCase()}</div>
              <div style={S.disciplineSub}>{d.sub.toUpperCase()}</div>
              <div style={S.rule(d.color)} />
              <div style={S.tags}>{d.tags}</div>
              <div style={S.quote}>{d.quote}</div>
              <div style={S.desc}>{d.desc}</div>
              <div style={S.spacer} />
              {d.live
                ? <button style={{ ...S.btn, borderColor: `${d.color}66`, color: d.color }} onClick={() => go('mushin')}>Enter</button>
                : <div style={S.coming}>Coming Soon</div>
              }
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const S = {
  wrap: { width: '100%', height: '100%', background: '#0A0A12', display: 'flex', flexDirection: 'column', overflow: 'hidden' },
  header: { display: 'flex', alignItems: 'center', gap: 12, padding: '10px 20px', borderBottom: '0.5px solid rgba(245,240,232,0.07)', flexShrink: 0 },
  logoMark: { flexShrink: 0 },
  headerText: { display: 'flex', flexDirection: 'column', gap: 1 },
  logoTitle: { fontFamily: 'Cinzel, serif', fontSize: 14, fontWeight: 700, letterSpacing: '0.08em', color: 'rgba(200,180,140,0.85)' },
  logoSub: { fontFamily: 'Cinzel, serif', fontSize: 8, letterSpacing: '0.15em', color: 'rgba(245,240,232,0.3)' },
  tagline: { textAlign: 'center', fontFamily: 'Crimson Pro, serif', fontSize: 12, fontStyle: 'italic', color: 'rgba(245,240,232,0.35)', padding: '8px 40px', borderBottom: '0.5px solid rgba(245,240,232,0.05)', flexShrink: 0 },
  grid: { flex: 1, display: 'flex', gap: 0, overflow: 'hidden' },
  card: { flex: 1, borderRight: '0.5px solid rgba(245,240,232,0.07)', display: 'flex', flexDirection: 'column', overflow: 'hidden' },
  cardInner: { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '20px 18px 18px', overflow: 'auto' },
  kanji: color => ({ fontSize: 44, lineHeight: 1, color, marginBottom: 6, fontWeight: 300 }),
  disciplineName: color => ({ fontFamily: 'Cinzel, serif', fontSize: 13, fontWeight: 700, letterSpacing: '0.18em', color, marginBottom: 3 }),
  disciplineSub: { fontFamily: 'Cinzel, serif', fontSize: 7.5, letterSpacing: '0.2em', color: 'rgba(245,240,232,0.35)', marginBottom: 10 },
  rule: color => ({ width: 28, height: 1, background: `linear-gradient(90deg, transparent, ${color}, transparent)`, marginBottom: 10 }),
  tags: { fontFamily: 'Cinzel, serif', fontSize: 8, letterSpacing: '0.1em', color: 'rgba(245,240,232,0.28)', fontStyle: 'italic', marginBottom: 10 },
  quote: { fontSize: 11, fontStyle: 'italic', color: 'rgba(245,240,232,0.45)', lineHeight: 1.55, marginBottom: 10, maxWidth: 260 },
  desc: { fontSize: 10.5, color: 'rgba(245,240,232,0.38)', lineHeight: 1.65, maxWidth: 270, marginBottom: 14 },
  spacer: { flex: 1 },
  btn: { background: 'none', border: '0.5px solid', borderRadius: 20, padding: '5px 20px', fontFamily: 'Cinzel, serif', fontSize: 8.5, letterSpacing: '0.2em', cursor: 'pointer', transition: 'opacity 0.15s' },
  coming: { fontFamily: 'Cinzel, serif', fontSize: 7.5, letterSpacing: '0.18em', color: 'rgba(245,240,232,0.2)', border: '0.5px solid rgba(245,240,232,0.1)', borderRadius: 20, padding: '4px 14px' },
};
