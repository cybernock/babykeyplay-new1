import React, { useEffect, useRef } from 'react';
import { useParentPanel } from '@/hooks/useParentPanel.jsx';
import { useAudioManager } from '@/hooks/useAudioManager.js';

const SCALES = {
  major: [261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88, 523.25],
  pentatonic: [261.63, 293.66, 329.63, 392.00, 440.00, 523.25],
  ocean: [261.63, 311.13, 349.23, 392.00, 466.16], // Minor pentatonic
};

export default function MusicGenerator() {
  const { musicEnabled, theme, isLocked } = useParentPanel();
  const { playNote } = useAudioManager();
  const intervalRef = useRef(null);
  const stepRef = useRef(0);

  useEffect(() => {
    if (!musicEnabled || isLocked) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    const scale = theme === 'ocean' ? SCALES.ocean : SCALES.pentatonic;
    const tempo = theme === 'neon' ? 300 : 600;

    intervalRef.current = setInterval(() => {
      // Generative pattern: walk up and down the scale with some randomness
      stepRef.current = (stepRef.current + (Math.random() > 0.3 ? 1 : -1) + scale.length) % scale.length;
      const freq = scale[stepRef.current];
      
      // Randomly skip notes for rhythm
      if (Math.random() > 0.2) {
        playNote(freq, false, Math.random());
      }
    }, tempo);

    return () => clearInterval(intervalRef.current);
  }, [musicEnabled, theme, isLocked, playNote]);

  return null;
}
