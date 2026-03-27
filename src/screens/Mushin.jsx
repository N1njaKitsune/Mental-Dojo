import React, { useState } from 'react';
import BreathHome from '../mushin/BreathHome';
import ElementList from '../mushin/ElementList';
import Technique from '../mushin/Technique';
import Session from '../mushin/Session';

export default function MushinHub({ navigate }) {
  const [screen, setScreen] = useState('breath-home');
  const [params, setParams] = useState({});

  function go(s, p = {}) {
    setScreen(s);
    setParams(p);
  }

  function goHome() { navigate('home'); }

  const commonProps = { go, goHome, params };

  if (screen === 'breath-home')  return <BreathHome {...commonProps} />;
  if (screen === 'element')      return <ElementList {...commonProps} />;
  if (screen === 'technique')    return <Technique {...commonProps} />;
  if (screen === 'session')      return <Session {...commonProps} />;
  return <BreathHome {...commonProps} />;
}
