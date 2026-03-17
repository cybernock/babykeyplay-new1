import React, { useEffect, useRef } from 'react';
import { useParentPanel } from '@/hooks/useParentPanel.jsx';
import { useAudioManager } from '@/hooks/useAudioManager.js';
import { useMotionDetection } from '@/hooks/MotionDetectionSystem.js';
import ParticleSystem from './ParticleSystem.jsx';
import MultiplayerMode from './MultiplayerMode.jsx';
import AudioVisualizer from './AudioVisualizer.jsx';
import MusicGenerator from './MusicGenerator.jsx';
import SurpriseEffects from './SurpriseEffects.jsx';
import VoiceReactions from './VoiceReactions.jsx';
import IdleDemo from './IdleDemo.jsx';
import PerformanceMonitor from './PerformanceMonitor.jsx';
import FallingStarsSystem from './FallingStarsSystem.jsx';
import MotionEffectsRenderer from './MotionEffectsRenderer.jsx';
import ScrollEffectsRenderer from './ScrollEffectsRenderer.jsx';
import DeviceMotionHandler from './DeviceMotionHandler.jsx';
import MouseMovementTracker from './MouseMovementTracker.jsx';
import TouchSwipeDetector from './TouchSwipeDetector.jsx';

const BabyKeyPlay = () => {
  const particleSystemRef = useRef(null);
  const { 
    isLocked, soundEnabled, multiplayer, theme, 
    reduceMotion, starsEnabled, motionEffectsEnabled 
  } = useParentPanel();
  
  const { playPop, playNote, initAudio } = useAudioManager();
  const [motionState, requestDeviceMotionPermission, permissionState] = useMotionDetection(reduceMotion);

  useEffect(() => {
    const handleInteraction = (x, y, player = 1) => {
      if (isLocked) return;
      if (soundEnabled) initAudio();

      window.dispatchEvent(new CustomEvent('bkp-interaction'));
      
      if (multiplayer) {
        window.dispatchEvent(new CustomEvent('bkp-score', { detail: { player, points: 10 } }));
      }

      particleSystemRef.current?.spawnExplosion(x, y, 20);
      
      if (soundEnabled) {
        const pan = x / window.innerWidth;
        playPop(pan);
      }
    };

    const handleKeyDown = (e) => {
      if (e.repeat || isLocked) return;
      
      const w = window.innerWidth;
      const h = window.innerHeight;
      
      if (multiplayer) {
        if (['w','a','s','d'].includes(e.key.toLowerCase())) {
          handleInteraction(w * 0.25, h * 0.5, 1);
          if (soundEnabled) playNote(e.key, false, 0.25);
        }
        else if (['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.key)) {
          handleInteraction(w * 0.75, h * 0.5, 2);
          if (soundEnabled) playNote(e.key, false, 0.75);
        }
      } else {
        const x = Math.random() * w * 0.8 + w * 0.1;
        const y = Math.random() * h * 0.8 + h * 0.1;
        handleInteraction(x, y, 1);
        if (soundEnabled) playNote(e.key, false, x / w);
      }
    };

    const handlePointerDown = (e) => {
      if (isLocked) return;
      const player = multiplayer ? (e.clientX < window.innerWidth / 2 ? 1 : 2) : 1;
      handleInteraction(e.clientX, e.clientY, player);
    };

    const handleDemoInteraction = (e) => {
      handleInteraction(e.detail.x, e.detail.y, 1);
    };

    const handleSurprise = (e) => {
      if (e.detail === 'emoji-rain') {
        particleSystemRef.current?.spawnEmojiRain();
      } else {
        particleSystemRef.current?.spawnExplosion(window.innerWidth/2, window.innerHeight/2, 100, 'star');
      }
    };

    const handleSpawnParticles = (e) => {
      const { x, y, count, type } = e.detail;
      particleSystemRef.current?.spawnExplosion(x, y, count, type);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('bkp-demo-interaction', handleDemoInteraction);
    window.addEventListener('bkp-surprise', handleSurprise);
    window.addEventListener('bkp-spawn-particles', handleSpawnParticles);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('bkp-demo-interaction', handleDemoInteraction);
      window.removeEventListener('bkp-surprise', handleSurprise);
      window.removeEventListener('bkp-spawn-particles', handleSpawnParticles);
    };
  }, [isLocked, soundEnabled, multiplayer, initAudio, playPop, playNote]);

  return (
    <div className="relative w-full h-full overflow-hidden bg-black">
      <ParticleSystem ref={particleSystemRef} />
      
      {/* Phase 4: Motion & Stars Systems */}
      <FallingStarsSystem theme={theme} isEnabled={starsEnabled && !reduceMotion} />
      <MotionEffectsRenderer motionState={motionState} theme={theme} isEnabled={motionEffectsEnabled && !reduceMotion} />
      <ScrollEffectsRenderer motionState={motionState} theme={theme} isEnabled={motionEffectsEnabled && !reduceMotion} />
      <DeviceMotionHandler motionState={motionState} requestPermission={requestDeviceMotionPermission} permissionState={permissionState} theme={theme} isEnabled={motionEffectsEnabled && !reduceMotion} />
      <MouseMovementTracker motionState={motionState} theme={theme} isEnabled={motionEffectsEnabled && !reduceMotion} />
      <TouchSwipeDetector motionState={motionState} theme={theme} isEnabled={motionEffectsEnabled && !reduceMotion} />

      <MultiplayerMode />
      <AudioVisualizer />
      <MusicGenerator />
      <SurpriseEffects />
      <VoiceReactions />
      <IdleDemo />
      <PerformanceMonitor />
    </div>
  );
};

export default BabyKeyPlay;
