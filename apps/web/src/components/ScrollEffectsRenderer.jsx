import React, { useEffect } from 'react';

export default function ScrollEffectsRenderer({ motionState, theme, isEnabled }) {
  useEffect(() => {
    if (!isEnabled || motionState.type !== 'scroll' || !motionState.isActive) return;

    if (motionState.velocity > 50) {
      // Create scroll trail
      const count = Math.min(5, Math.floor(motionState.velocity / 100));
      
      // Determine position based on scroll direction
      const x = motionState.direction.x !== 0 
        ? (motionState.direction.x > 0 ? window.innerWidth : 0) 
        : Math.random() * window.innerWidth;
        
      const y = motionState.direction.y !== 0 
        ? (motionState.direction.y > 0 ? window.innerHeight : 0) 
        : Math.random() * window.innerHeight;

      window.dispatchEvent(new CustomEvent('bkp-spawn-particles', { 
        detail: { x, y, count, type: 'square' } 
      }));
    }
  }, [motionState, isEnabled]);

  return null;
}
