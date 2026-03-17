import React, { useEffect } from 'react';
import { useParentPanel } from '@/hooks/useParentPanel.jsx';

export default function SurpriseEffects() {
  const { surpriseEffects, isLocked } = useParentPanel();

  useEffect(() => {
    if (!surpriseEffects || isLocked) return;

    const interval = setInterval(() => {
      const effects = ['emoji-rain', 'starburst', 'color-wave'];
      const randomEffect = effects[Math.floor(Math.random() * effects.length)];
      window.dispatchEvent(new CustomEvent('bkp-surprise', { detail: randomEffect }));
    }, 15000); // Every 15 seconds

    return () => clearInterval(interval);
  }, [surpriseEffects, isLocked]);

  return null;
}
