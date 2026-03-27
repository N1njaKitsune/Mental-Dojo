import React from 'react';

const DISCIPLINES = [
  {
    id: 'metsuke',
    kanji: '目付',
    name: 'Metsuke',
    subtitle: 'The Reading Mind',
    color: '#8DB8D4',
    rgb: '141,184,212',
    bg: '#080E14',
    mantra: '"The untrained eye sees. The ninja\'s eye reads."',
    desc: 'Perception · Comprehension · Intake',
    live: false,
  },
  {
    id: 'mushin',
    kanji: '無心',
    name: 'Mushin',
    subtitle: 'The Still Mind',
    color: '#7AB89A',
    rgb: '122,184,154',
    bg: '#060E0A',
    mantra: '"The untrained mind is full of noise. The ninja\'s mind is full of space."',
    desc: 'Breath · Focus · Regulation',
    live: true,
  },
  {
    id: 'tachi',
    kanji: '太刀',
    name: 'Tachi',
    subtitle: 'The Striking Mind',
    color: '#D4826A',
    rgb: '212,130,106',
    bg: '#100806',
    mantra: '"The untrained mind rushes or freezes. The ninja\'s mind is always ready."',
    desc: 'Strategy · Speed · Output',
    live: false,
  },
];

export default function Home({ navigate }) {
  return (
    <div style={styles.wrap}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.monWrap}>
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
            <circle cx="18" cy="18" r="16" stroke="rgba(200,146,42,0.35)" strokeWidth="0.75" />
            <circle cx="18" cy="18" r="4" fill="rgba(200,146,42,0.7)" />
            <circle cx="18" cy="18" r="9" fill="none" stroke="rgba(200,146,42,0.4)" strokeWidth="0.75" />
            {[0, 120, 240].map(deg => {
              const rad = (deg - 90) * Math.PI / 180;
              const x1 = 18 + 9 * Math.cos(rad);
              const y1 = 18 + 9 * Math.sin(rad);
              const x2 = 18 + 15 * Math.cos(rad);
              const y2 = 18 + 15 * Math.sin(rad);
              return <line key={deg} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(200,146,42,0.45)" strokeWidth="0.75" />;
            })}
            {[0, 120, 240].map(deg => {
              const rad = (deg - 90) * Math.PI / 180;
              const cx = 18 + 15 * Math.cos(rad);
              const cy = 18 + 15 * Math.sin(rad);
              return <circle key={deg} cx={cx} cy={cy} r="1.5" fill="rgba(200,146,42,0.55)" />;
            })}
          </svg>
        </div>
        <div>
          <div style={styles.title}>THE MENTAL DOJO</div>
          <div style={styles.subtitle}>Where the mind becomes a weapon</div>
        </div>
      </div>

      <div style={styles.rule} />

      {/* Intro */}
      <div style={styles.intro}>
        A ninja's greatest weapon is their mind — trained in three ways.
        Read clearly. Strike decisively. Be still.
      </div>

      {/* Three discipline cards */}
      <div style={styles.cards}>
        {DISCIPLINES.map(d => (
          <DisciplineCard
            key={d.id}
            d={d}
            onClick={() => {
              if (d.live) navigate(d.id);
              else navigate('coming-soon', { discipline: d });
            }}
          />
        ))}
      </div>
    </div>
  );
}

function DisciplineCard({ d, onClick }) {
  const [hover, setHover] = React.useState(false);
  return (
    <div
      style={{
        ...styles.card,
        borderColor: hover ? d.color + '40' : 'rgba(245,240,232,0.07)',
        background: hover ? `rgba(${d.rgb},0.06)` : 'rgba(245,240,232,0.02)',
        transform: hover ? 'scale(1.01)' : 'scale(1)',
      }}
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {/* Subtle bg glow */}
      <div style={{
        position: 'absolute', inset: 0, borderRadius: 12,
        background: `radial-gradient(ellipse at 30% 50%, rgba(${d.rgb},0.1) 0%, transparent 70%)`,
        opacity: hover ? 1 : 0.5, pointerEvents: 'none', transition: 'opacity 0.3s',
      }} />

      <div style={{ position: 'relative', zIndex: 1, padding: '18px 16px 16px' }}>
        {/* Kanji */}
        <div style={{ fontFamily: 'Cinzel, serif', fontSize: 28, fontWeight: 700, color: d.color, marginBottom: 2, letterSpacing: '0.02em' }}>
          {d.kanji}
        </div>
        {/* English name */}
        <div style={{ fontFamily: 'Cinzel, serif', fontSize: 14, fontWeight: 700, color: d.color, letterSpacing: '0.06em', marginBottom: 2 }}>
          {d.name}
        </div>
        <div style={{ fontFamily: 'Cinzel, serif', fontSize: 8, letterSpacing: '0.18em', color: `rgba(${d.rgb},0.5)`, marginBottom: 10, textTransform: 'uppercase' }}>
          {d.subtitle}
        </div>

        {/* Rule */}
        <div style={{ width: 32, height: 1, background: `linear-gradient(90deg,${d.color},transparent)`, marginBottom: 10 }} />

        {/* Desc */}
        <div style={{ fontSize: 11, fontStyle: 'italic', color: 'rgba(245,240,232,0.55)', lineHeight: 1.6, marginBottom: 8 }}>
          {d.desc}
        </div>

        {/* Mantra */}
        <div style={{ fontSize: 10, color: 'rgba(245,240,232,0.3)', lineHeight: 1.5, marginBottom: 12 }}>
          {d.mantra}
        </div>

        {/* Status */}
        <div style={{
          display: 'inline-block',
          fontFamily: 'Cinzel, serif', fontSize: 8, letterSpacing: '0.18em',
          padding: '4px 10px', borderRadius: 20,
          border: `0.5px solid ${d.live ? d.color + '55' : 'rgba(245,240,232,0.1)'}`,
          color: d.live ? d.color : 'rgba(245,240,232,0.3)',
          background: d.live ? `rgba(${d.rgb},0.08)` : 'transparent',
        }}>
          {d.live ? 'Enter' : 'Coming Soon'}
        </div>
      </div>
    </div>
  );
}

const styles = {
  wrap: {
    width: '100%', height: '100%', background: '#0A0A12',
    display: 'flex', flexDirection: 'column',
    padding: '0 0 12px',
  },
  header: {
    height: 52, display: 'flex', alignItems: 'center', gap: 14,
    padding: '0 20px',
    borderBottom: '0.5px solid rgba(245,240,232,0.07)',
    flexShrink: 0,
  },
  monWrap: { flexShrink: 0 },
  title: {
    fontFamily: 'Cinzel, serif', fontSize: 14, fontWeight: 700,
    letterSpacing: '0.12em', color: '#F5F0E8', lineHeight: 1,
  },
  subtitle: {
    fontSize: 10, fontStyle: 'italic', color: 'rgba(245,240,232,0.38)',
    marginTop: 3, letterSpacing: '0.04em',
  },
  rule: {
    height: 1,
    background: 'linear-gradient(90deg,transparent,rgba(200,146,42,0.25),transparent)',
  },
  intro: {
    textAlign: 'center', fontSize: 12, fontStyle: 'italic',
    color: 'rgba(245,240,232,0.4)', lineHeight: 1.65,
    padding: '14px 28px 12px',
  },
  cards: {
    flex: 1, display: 'flex', gap: 8, padding: '0 16px 0',
    overflow: 'hidden',
  },
  card: {
    flex: 1, borderRadius: 12, border: '0.5px solid',
    position: 'relative', overflow: 'hidden', cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
};
