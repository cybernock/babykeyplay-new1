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
  const [sessionTime, setSessionTime] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [showModeIndicator, setShowModeIndicator] = useState(() => localStorage.getItem('bkp_indicator') !== 'false');
  
  // Phase 3 Settings
  const [particleDensity, setParticleDensity] = useState(() => parseInt(localStorage.getItem('bkp_density') || '100', 10));
  const [musicEnabled, setMusicEnabled] = useState(() => localStorage.getItem('bkp_music') === 'true');
  const [multiplayer, setMultiplayer] = useState(() => localStorage.getItem('bkp_multiplayer') === 'true');
  const [surpriseEffects, setSurpriseEffects] = useState(() => localStorage.getItem('bkp_surprise') !== 'false');
  const [voiceReactions, setVoiceReactions] = useState(() => localStorage.getItem('bkp_voice') !== 'false');
  const [fpsCap, setFpsCap] = useState(() => parseInt(localStorage.getItem('bkp_fps') || '60', 10));
  const [audioVisualizer, setAudioVisualizer] = useState(() => localStorage.getItem('bkp_visualizer') === 'true');

  // Phase 4 Settings
  const [starsEnabled, setStarsEnabled] = useState(() => localStorage.getItem('bkp_stars') !== 'false');
  const [motionEffectsEnabled, setMotionEffectsEnabled] = useState(() => localStorage.getItem('bkp_motion_effects') !== 'false');

  useEffect(() => {
    localStorage.setItem('bkp_theme', theme);
    localStorage.setItem('bkp_mode', mode);
    localStorage.setItem('bkp_sound', soundEnabled);
    localStorage.setItem('bkp_brightness', brightness);
    localStorage.setItem('bkp_motion', reduceMotion);
    localStorage.setItem('bkp_indicator', showModeIndicator);
    localStorage.setItem('bkp_density', particleDensity);
    localStorage.setItem('bkp_music', musicEnabled);
    localStorage.setItem('bkp_multiplayer', multiplayer);
    localStorage.setItem('bkp_surprise', surpriseEffects);
    localStorage.setItem('bkp_voice', voiceReactions);
    localStorage.setItem('bkp_fps', fpsCap);
    localStorage.setItem('bkp_visualizer', audioVisualizer);
    localStorage.setItem('bkp_stars', starsEnabled);
    localStorage.setItem('bkp_motion_effects', motionEffectsEnabled);
  }, [theme, mode, soundEnabled, brightness, reduceMotion, showModeIndicator, particleDensity, musicEnabled, multiplayer, surpriseEffects, voiceReactions, fpsCap, audioVisualizer, starsEnabled, motionEffectsEnabled]);

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
    showModeIndicator, toggleModeIndicator: () => setShowModeIndicator(!showModeIndicator),
    particleDensity, setParticleDensity,
    musicEnabled, toggleMusic: () => setMusicEnabled(!musicEnabled),
    multiplayer, toggleMultiplayer: () => setMultiplayer(!multiplayer),
    surpriseEffects, toggleSurpriseEffects: () => setSurpriseEffects(!surpriseEffects),
    voiceReactions, toggleVoiceReactions: () => setVoiceReactions(!voiceReactions),
    fpsCap, setFpsCap,
    audioVisualizer, toggleAudioVisualizer: () => setAudioVisualizer(!audioVisualizer),
    starsEnabled, toggleStars: () => setStarsEnabled(!starsEnabled),
    motionEffectsEnabled, toggleMotionEffects: () => setMotionEffectsEnabled(!motionEffectsEnabled)
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
