export const ELEMENTS = {
  kaze: {
    id: 'kaze', name: 'Kaze', element: 'Air', color: '#8DB8D4', rgb: '141,184,212',
    bg: { base: '#080E14', a1: '#0D1E2E', a2: '#0A1520' },
    pts: [[55,35],[185,75],[115,165],[38,118],[205,142],[90,55],[160,155]],
    desc: 'Kaze breathing calms the nervous system, lowers the heart rate, and helps you settle. Use after intensity, before focus work, or whenever you feel overwhelmed.',
    techniques: ['cloud','raven','lantern'],
  },
  chi: {
    id: 'chi', name: 'Chi', element: 'Earth', color: '#C8A46A', rgb: '200,164,106',
    bg: { base: '#0E0A06', a1: '#1E1208', a2: '#160E05' },
    pts: [[48,58],[192,48],[98,172],[162,118],[68,148],[140,60],[200,160]],
    desc: 'Chi breathing grounds scattered attention and builds inner steadiness. Use before a challenge, when distracted, or to reset after strong emotion.',
    techniques: ['warrior','stone','mountain'],
  },
  mizu: {
    id: 'mizu', name: 'Mizu', element: 'Water', color: '#6A9CC8', rgb: '106,156,200',
    bg: { base: '#060C14', a1: '#0A1828', a2: '#08111E' },
    pts: [[78,48],[162,88],[48,152],[202,118],[128,172],[55,85],[185,148]],
    desc: 'Mizu breathing develops awareness and expands lung capacity. Use during cool-down, reflection, or to deepen into stillness.',
    techniques: ['wave','tide'],
  },
  hi: {
    id: 'hi', name: 'Hi', element: 'Fire', color: '#D4826A', rgb: '212,130,106',
    bg: { base: '#100806', a1: '#200E08', a2: '#180A05' },
    pts: [[88,38],[172,68],[58,142],[212,108],[108,178],[45,100],[195,130]],
    desc: 'Hi breathing energises and activates. Always begins with slow preparation. Use before training, when energy is low, or to sharpen focus fast.',
    techniques: ['phoenix','dragon','bellows'],
  },
};

export const SHIHO = {
  id: 'shiho', name: 'Shiho', realName: 'Box Breathing', elem: 'centre',
  color: '#C8D8E8', rgb: '200,216,232',
  bg: { base: '#080C10', a1: '#0D1620', a2: '#0A1218' },
  pts: [[40,30],[200,50],[60,160],[190,140],[110,80],[150,170]],
  type: 'cycle', inhale: 4, hold: 4, exhale: 4, endHold: 4, dur: 64, cycles: 4,
  cue: '"Four sides. Four counts. Perfect balance. Find the box and stay inside it."',
  closeCue: '"Return to the box. Carry the stillness with you."',
  best: 'Opens and closes every session. Use to calibrate, centre, and return to baseline.',
  word: 'Centred',
};

export const TECHNIQUES = {
  shiho: SHIHO,
  cloud: {
    id:'cloud', name:'Cloud Breathing', realName:'Diaphragmatic', elem:'kaze',
    color:'#8DB8D4', rgb:'141,184,212', bg:{base:'#080E14',a1:'#0D1E2E',a2:'#0A1520'},
    pts:[[55,35],[185,75],[115,165],[38,118],[205,142],[90,55],[160,155]],
    type:'cycle', inhale:4, hold:0, exhale:4, endHold:0, dur:56,
    cue:'"Fill the belly like a cloud getting bigger. Shoulders soft, chest at ease."',
    best:'Best for settling after excitement, preparing for focused work, or when overwhelmed.',
    word:'Settled', locked:false,
  },
  raven: {
    id:'raven', name:"Raven's Breath", realName:'Lengthened Exhale', elem:'kaze',
    color:'#8DB8D4', rgb:'141,184,212', bg:{base:'#080E14',a1:'#0D1E2E',a2:'#0A1520'},
    pts:[[45,45],[195,65],[105,175],[30,128],[210,132],[85,60],[165,160]],
    type:'cycle', inhale:4, hold:0, exhale:6, endHold:0, dur:60,
    cue:'"Breathe in quietly, then let the breath glide out for longer. The exhale is the settling."',
    best:'Best for lowering heart rate, releasing tension, and calming after intensity.',
    word:'Calm', locked:false,
  },
  lantern: {
    id:'lantern', name:'Lantern Breathing', realName:'4-7-8 Breath', elem:'kaze',
    color:'#8DB8D4', rgb:'141,184,212', bg:{base:'#080E14',a1:'#0D1E2E',a2:'#0A1520'},
    pts:[[50,40],[190,70],[110,170],[35,120],[205,138],[88,58],[162,158]],
    type:'cycle', inhale:4, hold:5, exhale:6, endHold:0, dur:60,
    cue:'"Light the lantern, keep it glowing, then let it slowly fade. Stay soft during the hold."',
    best:'Best for deep relaxation, impulse control, and end-of-day recovery.',
    word:'Still', locked:true,
  },
  warrior: {
    id:'warrior', name:"Warrior's Breath", realName:'Bhramari', elem:'chi',
    color:'#C8A46A', rgb:'200,164,106', bg:{base:'#0E0A06',a1:'#1E1208',a2:'#160E05'},
    pts:[[48,58],[192,48],[98,172],[162,118],[68,148],[140,60],[200,160]],
    type:'cycle', inhale:4, hold:0, exhale:6, endHold:0, dur:60,
    cue:'"Hum steadily as you breathe out. Feel the vibration settle deep in your chest."',
    best:'Best for grounding when distracted, steadying before a challenge, or resetting after emotion.',
    word:'Rooted', locked:false,
  },
  stone: {
    id:'stone', name:'Stone Breathing', realName:'Ujjayi', elem:'chi',
    color:'#C8A46A', rgb:'200,164,106', bg:{base:'#0E0A06',a1:'#1E1208',a2:'#160E05'},
    pts:[[52,55],[188,52],[102,168],[158,122],[72,145],[136,64],[196,162]],
    type:'cycle', inhale:4, hold:0, exhale:5, endHold:0, dur:54,
    cue:'"Make a soft secret sound in the throat. Breathe like stone — strong, slow, steady."',
    best:'Best for concentration practice, grounding before challenge work, and sustained calm effort.',
    word:'Solid', locked:true,
  },
  mountain: {
    id:'mountain', name:'Mountain Breathing', realName:'Resonance', elem:'chi',
    color:'#C8A46A', rgb:'200,164,106', bg:{base:'#0E0A06',a1:'#1E1208',a2:'#160E05'},
    pts:[[46,62],[194,44],[96,176],[164,114],[66,152],[142,56],[202,158]],
    type:'cycle', inhale:3, hold:0, exhale:3, endHold:0, dur:60,
    cue:'"Breathe like a mountain — steady, patient, unmoving. Keep every breath the same size."',
    best:'Best for daily regulation, calm focus before class, and restoring stability.',
    word:'Steady', locked:true,
  },
  wave: {
    id:'wave', name:'Wave Breathing', realName:'Intercostal Expansion', elem:'mizu',
    color:'#6A9CC8', rgb:'106,156,200', bg:{base:'#060C14',a1:'#0A1828',a2:'#08111E'},
    pts:[[78,48],[162,88],[48,152],[202,118],[128,172],[55,85],[185,148]],
    type:'cycle', inhale:4, hold:0, exhale:5, endHold:0, dur:54,
    cue:'"Send the breath into the sides and back of the ribcage. Grow wide, not just forward."',
    best:'Best for deepening body awareness, expanding lung capacity, or moving into a meditative state.',
    word:'Open', locked:false,
  },
  tide: {
    id:'tide', name:'Tide Breathing', realName:'Alternate Nostril', elem:'mizu',
    color:'#6A9CC8', rgb:'106,156,200', bg:{base:'#060C14',a1:'#0A1828',a2:'#08111E'},
    pts:[[74,52],[166,84],[52,156],[198,122],[132,168],[58,88],[182,152]],
    type:'cycle', inhale:4, hold:0, exhale:4, endHold:0, dur:56,
    cue:'"The breath flows side to side like the tide changing direction. Move slowly and carefully."',
    best:'Best for balancing energy, mindfulness sessions, and calm seated practice.',
    word:'Balanced', locked:true,
  },
  phoenix: {
    id:'phoenix', name:'Phoenix Breath', realName:'Kapalabhati', elem:'hi',
    color:'#D4826A', rgb:'212,130,106', bg:{base:'#100806',a1:'#200E08',a2:'#180A05'},
    pts:[[88,38],[172,68],[58,142],[212,108],[108,178],[45,100],[195,130]],
    type:'fire',
    phases:[
      {name:'prepare', label:'Prepare', desc:'Two slow warm-up breaths', inhale:4, hold:0, exhale:4, endHold:0, cycles:2},
      {name:'activate', label:'Activate', desc:'Rapid pulse exhales', inhale:1, hold:0, exhale:1, endHold:0, cycles:15},
      {name:'settle', label:'Settle', desc:'Return to stillness', inhale:4, hold:0, exhale:4, endHold:0, cycles:1},
    ],
    cue:'"Short, sharp bursts through the nose. The inhale follows naturally between each pulse."',
    best:'Best for low energy, activating the body before training, or sharpening focus fast.',
    word:'Ignited', locked:false,
  },
  dragon: {
    id:'dragon', name:'Dragon Breath', realName:'Bhastrika', elem:'hi',
    color:'#D4826A', rgb:'212,130,106', bg:{base:'#100806',a1:'#200E08',a2:'#180A05'},
    pts:[[82,42],[178,64],[62,138],[208,112],[112,174],[50,96],[190,134]],
    type:'fire',
    phases:[
      {name:'prepare', label:'Prepare', desc:'One slow breath to settle', inhale:4, hold:0, exhale:4, endHold:0, cycles:1},
      {name:'activate', label:'Activate', desc:'Strong active cycles', inhale:2, hold:0, exhale:2, endHold:0, cycles:10},
      {name:'settle', label:'Settle', desc:'Return to baseline', inhale:4, hold:0, exhale:4, endHold:0, cycles:1},
    ],
    cue:'"Strong in, strong out. Like a dragon building fire. Powerful but controlled."',
    best:'Best before athletic work, explosive games, or activating body and mind together.',
    word:'Fierce', locked:true,
  },
  bellows: {
    id:'bellows', name:'Bellows Breath', realName:'Wim Hof adapted', elem:'hi',
    color:'#D4826A', rgb:'212,130,106', bg:{base:'#100806',a1:'#200E08',a2:'#180A05'},
    pts:[[85,40],[175,66],[60,140],[210,110],[110,176],[48,98],[192,132]],
    type:'fire',
    phases:[
      {name:'prepare', label:'Prepare', desc:'Two deep breaths to oxygenate', inhale:4, hold:0, exhale:4, endHold:0, cycles:2},
      {name:'activate', label:'Activate', desc:'Deep breath cycles', inhale:2, hold:0, exhale:2, endHold:0, cycles:8},
      {name:'hold', label:'Hold', desc:'Brief retention', inhale:0, hold:5, exhale:0, endHold:0, cycles:1},
      {name:'settle', label:'Settle', desc:'Gentle release and return', inhale:4, hold:0, exhale:4, endHold:0, cycles:1},
    ],
    cue:'"Fill up, release, fill up, release. Build energy, then stay calm in the hold."',
    best:'Best for controlled activation before demanding tasks and resilience practice.',
    word:'Charged', locked:true,
  },
};

export const STATES = [
  {
    id:'stormy', word:'Stormy', desc:"Restless, busy, can't settle",
    color:'#8DB8D4', rgb:'141,184,212',
    msg:'Your mind is busy. Cloud Breathing will help you settle. Beginning with Air.',
    sequence:['cloud','warrior','wave'],
  },
  {
    id:'flat', word:'Flat', desc:'Low energy, heavy, tired',
    color:'#D4826A', rgb:'212,130,106',
    msg:'Your energy is low. Phoenix Breath will activate you. Beginning with Fire.',
    sequence:['phoenix','warrior','cloud'],
  },
  {
    id:'scattered', word:'Scattered', desc:'Distracted, unfocused',
    color:'#C8A46A', rgb:'200,164,106',
    msg:"Your attention is scattered. Warrior's Breath will ground you. Beginning with Earth.",
    sequence:['warrior','cloud','wave'],
  },
  {
    id:'clear', word:'Clear', desc:'Calm, ready to go deeper',
    color:'#7AB89A', rgb:'122,184,154',
    msg:"You're already clear. Wave Breathing will take you deeper. Beginning with Water.",
    sequence:['wave','warrior','cloud','phoenix'],
  },
];

export function buildFlatPhases(t, useDuration = true) {
  const out = [];
  if (t.type === 'cycle' || (t.inhale !== undefined && t.type !== 'fire')) {
    const cl = (t.inhale||0)+(t.hold||0)+(t.exhale||0)+(t.endHold||0);
    const cycles = useDuration ? Math.round((t.dur || 60) / cl) : (t.cycles || 4);
    for (let c = 0; c < cycles; c++) {
      if (t.inhale)   out.push({ name:'inhale',   dur:t.inhale,   cycle:c+1, tot:cycles, label:'Breathe in',  ls:0, le:1, ph:null });
      if (t.hold)     out.push({ name:'hold',     dur:t.hold,     cycle:c+1, tot:cycles, label:'Hold',        ls:1, le:1, ph:null });
      if (t.exhale)   out.push({ name:'exhale',   dur:t.exhale,   cycle:c+1, tot:cycles, label:'Breathe out', ls:1, le:0, ph:null });
      if (t.endHold)  out.push({ name:'endHold',  dur:t.endHold,  cycle:c+1, tot:cycles, label:'Hold',        ls:0, le:0, ph:null });
    }
  } else {
    (t.phases || []).forEach(ph => {
      for (let c = 0; c < ph.cycles; c++) {
        if (ph.hold && !ph.inhale && !ph.exhale) {
          out.push({ name:'hold', dur:ph.hold, cycle:c+1, tot:ph.cycles, label:'Hold still', ls:0.5, le:0.5, ph:ph.label });
        } else {
          if (ph.inhale) out.push({ name:'inhale',  dur:ph.inhale, cycle:c+1, tot:ph.cycles, label:'Breathe in',  ls:0, le:1, ph:ph.label });
          if (ph.hold)   out.push({ name:'hold',    dur:ph.hold,   cycle:c+1, tot:ph.cycles, label:'Hold',        ls:1, le:1, ph:ph.label });
          if (ph.exhale) out.push({ name:'exhale',  dur:ph.exhale, cycle:c+1, tot:ph.cycles, label:'Breathe out', ls:1, le:0, ph:ph.label });
          if (ph.endHold)out.push({ name:'endHold', dur:ph.endHold,cycle:c+1, tot:ph.cycles, label:'Hold',        ls:0, le:0, ph:ph.label });
        }
      }
    });
  }
  return out;
}

export function drawBreathCircle(canvas, lungScale, color, maxR = 82, minR = 14) {
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const w = canvas.width, h = canvas.height;
  ctx.clearRect(0, 0, w, h);
  const cx = w / 2, cy = h / 2;
  const r = minR + (maxR - minR) * lungScale;
  const rv = parseInt(color.slice(1,3),16);
  const gv = parseInt(color.slice(3,5),16);
  const bv = parseInt(color.slice(5,7),16);

  [1.0, 0.78, 0.6].forEach(rr => {
    ctx.beginPath(); ctx.arc(cx, cy, maxR * rr, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(${rv},${gv},${bv},0.04)`; ctx.lineWidth = 0.5; ctx.stroke();
  });
  ctx.beginPath(); ctx.arc(cx, cy, maxR, 0, Math.PI * 2);
  ctx.strokeStyle = lungScale > 0.96 ? `rgba(${rv},${gv},${bv},0.5)` : `rgba(${rv},${gv},${bv},0.13)`;
  ctx.lineWidth = 1; ctx.stroke();
  ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fillStyle = `rgba(${rv},${gv},${bv},0.09)`; ctx.fill();
  ctx.beginPath(); ctx.arc(cx, cy, r * 0.55, 0, Math.PI * 2);
  ctx.fillStyle = `rgba(${rv},${gv},${bv},0.1)`; ctx.fill();
  ctx.beginPath(); ctx.arc(cx, cy, r * 0.17, 0, Math.PI * 2);
  ctx.fillStyle = `rgba(${rv},${gv},${bv},0.6)`; ctx.fill();
  ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.strokeStyle = `rgba(${rv},${gv},${bv},0.55)`; ctx.lineWidth = 1.2; ctx.stroke();
}

export const PHASE_LABELS = {
  inhale: 'Breathe in', hold: 'Hold', exhale: 'Breathe out', endHold: 'Hold',
};
