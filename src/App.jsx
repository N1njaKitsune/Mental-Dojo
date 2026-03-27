import React, { useState } from 'react';
import Home from './screens/Home';
import MushinHub from './screens/Mushin';
import ComingSoon from './screens/ComingSoon';

export default function App() {
  const [screen, setScreen] = useState('home');
  const [params, setParams] = useState({});

  function navigate(s, p = {}) {
    setScreen(s);
    setParams(p);
  }

  if (screen === 'home')        return <Home navigate={navigate} />;
  if (screen === 'mushin')      return <MushinHub navigate={navigate} />;
  if (screen === 'coming-soon') return <ComingSoon navigate={navigate} params={params} />;
  return <Home navigate={navigate} />;
}