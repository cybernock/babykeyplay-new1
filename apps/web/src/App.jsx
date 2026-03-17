import React from 'react';
import { ParentPanelProvider } from '@/hooks/useParentPanel.jsx';
import BabyKeyPlay from '@/components/BabyKeyPlay.jsx';
import ParentControlPanel from '@/components/ParentControlPanel.jsx';
import ParentUnlockDetector from '@/components/ParentUnlockDetector.jsx';
import LockScreen from '@/components/LockScreen.jsx';

function App() {
  return (
    <ParentPanelProvider>
      <BabyKeyPlay />
      <ParentUnlockDetector />
      <ParentControlPanel />
      <LockScreen />
    </ParentPanelProvider>
  );
}

export default App;
