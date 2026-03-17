import React, { createContext, useContext, useState, useEffect } from 'react';

const ParentPanelContext = createContext(null);

export function ParentPanelProvider({ children }) {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem('bkp_theme') || 'space');
  const [mode, setMode] = useState(() => localStorage.getItem('bkp_mode') || 'free_play');
  const [soundEnabled, setSoundEnabled] = useState(() => localStorage.getItem('bkp_sound') !== 'false');
  const [brightness, setBrightness] = useState(() => parseInt(localStorage.getItem('bkp_brightness') || '100', 10));
  const [reduceMotion, setReduceMotion] = useState(() => localStorage.getItem('bkp_motion') === 'true');
  const [sessionTime, setSessionTime] = useState(0); // 0 means infinite
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [showModeIndicator, setShowModeIndicator] = useState(() => localStorage.getItem('bkp_indicator') !== 'false');

  // Persist settings
  useEffect(() => {
    localStorage.setItem('bkp_theme', theme);
    localStorage.setItem('bkp_mode', mode);
    localStorage.setItem('bkp_sound', soundEnabled);
    localStorage.setItem('bkp_brightness', brightness);
    localStorage.setItem('bkp_motion', reduceMotion);
    localStorage.setItem('bkp_indicator', showModeIndicator);
  }, [theme, mode, soundEnabled, brightness, reduceMotion, showModeIndicator]);

  // Timer logic
  useEffect(() => {
    if (sessionTime > 0 && !isLocked) {
      setTimeRemaining(sessionTime * 60);
    }
  }, [sessionTime, isLocked]);

  useEffect(() => {
    if (timeRemaining > 0 && !isLocked) {
      const timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            setIsLocked(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [timeRemaining, isLocked]);

  const value = {
    isPanelOpen, openPanel: () => setIsPanelOpen(true), closePanel: () => setIsPanelOpen(false),
    isLocked, lockScreen: () => setIsLocked(true), unlockScreen: () => setIsLocked(false),
    theme, setTheme,
    mode, setMode,
    soundEnabled, toggleSound: () => setSoundEnabled(!soundEnabled),
    brightness, setBrightness,
    reduceMotion, toggleReduceMotion: () => setReduceMotion(!reduceMotion),
    sessionTime, setSessionTime,
    timeRemaining,
    showModeIndicator, toggleModeIndicator: () => setShowModeIndicator(!showModeIndicator)
  };

  return (
    <ParentPanelContext.Provider value={value}>
      {children}
    </ParentPanelContext.Provider>
  );
}

export function useParentPanel() {
  return useContext(ParentPanelContext);
}
