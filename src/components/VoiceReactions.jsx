import React, { useEffect, useRef } from 'react';
import { useParentPanel } from '@/hooks/useParentPanel.jsx';
import { useAudioManager } from '@/hooks/useAudioManager.js';

export default function VoiceReactions() {
  const { voiceReactions, soundEnabled } = useParentPanel();
  const { speak } = useAudioManager();
  const comboRef = useRef(0);
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (!voiceReactions || !soundEnabled) return;

    const handleInteraction = () => {
      comboRef.current += 1;
      
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      
      if (comboRef.current === 10) speak("Yay!");
      else if (comboRef.current === 30) speak("Wow!");
      else if (comboRef.current === 50) speak("Super!");
      else if (comboRef.current === 100) speak("Amazing!");

      timeoutRef.current = setTimeout(() => {
        comboRef.current = 0;
      }, 2000);
    };

    window.addEventListener('bkp-interaction', handleInteraction);
    return () => {
      window.removeEventListener('bkp-interaction', handleInteraction);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [voiceReactions, soundEnabled, speak]);

  return null;
}
