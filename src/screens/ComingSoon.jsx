import React from 'react';

export default function ComingSoon({ navigate, params }) {
  const d = params?.discipline || {};
  return (
    <div style={styles.wrap}>
      <div style={styles.topbar}>
        <button style={styles.back} onClick={() => navigate('home')}>← Mental Dojo</button>
        <div style={styles.title}>{d.name || 'Coming Soon'}</div>
        <div style={{ width: 80 }} />
      </div>
      <div style={styles.body}>
        <div style={styles.kanji}>{d.kanji || ''}</div>
        <div style={{ fontFamily: 'Cinzel, serif', fontSize: 20, fontWeight: 700, color: d.color || '#F5F0E8', letterSpacing: '0.06em', marginBottom: 4 }}>
          {d.name}
        </div>
        <div style={{ fontFamily: 'Cinzel, serif', fontSize: 9, letterSpacing: '0.2em', color: `rgba(${d.rgb},0.45)`, marginBottom: 14 }}>
          {d.subtitle?.toUpperCase()}
        </div>
        <div style={{ width: 48, height: 1, background: `linear-gradient(90deg,transparent,${d.color || '#F5F0E8'},transparent)`, margin: '0 auto 14px' }} />
        <div style={{ fontSize: 13, fontStyle: 'italic', color: 'rgba(245,240,232,0.55)', lineHeight: 1.7, maxWidth: 320, marginBottom: 8 }}>
          {d.mantra}
        </div>
        <div style={{ fontSize: 11, color: 'rgba(245,240,232,0.32)', lineHeight: 1.6, maxWidth: 280, marginBottom: 28 }}>
          This discipline is being forged. Return when it is ready.
        </div>
        <button style={{ ...styles.btn, borderColor: (d.color || '#7AB89A') + '55', color: d.color || '#7AB89A' }} onClick={() => navigate('home')}>
          Return to dojo
        </button>
      </div>
    </div>
  );
}

const styles = {
  wrap: { width: '100%', height: '100%', background: '#0A0A12', display: 'flex', flexDirection: 'column' },
  topbar: { height: 44, display: 'flex', alignItems: 'center', padding: '0 20px', borderBottom: '0.5px solid rgba(245,240,232,0.07)', flexShrink: 0 },
  back: { fontFamily: 'Cinzel, serif', fontSize: 10, letterSpacing: '0.12em', color: 'rgba(245,240,232,0.35)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, width: 80 },
  title: { flex: 1, textAlign: 'center', fontFamily: 'Cinzel, serif', fontSize: 11, letterSpacing: '0.2em', color: 'rgba(245,240,232,0.28)' },
  body: { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px', textAlign: 'center' },
  kanji: { fontFamily: 'Cinzel, serif', fontSize: 52, fontWeight: 700, marginBottom: 8, opacity: 0.6 },
  btn: { padding: '10px 28px', borderRadius: 8, border: '0.5px solid', background: 'transparent', fontFamily: 'Cinzel, serif', fontSize: 10, letterSpacing: '0.18em', cursor: 'pointer' },
};
