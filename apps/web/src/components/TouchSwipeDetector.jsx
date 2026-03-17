import React, { useEffect } from 'react';

export default function TouchSwipeDetector({ motionState, theme, isEnabled }) {
  useEffect(() => {
    if (!isEnabled || motionState.type !== 'touch' || !motionState.isActive) return;

    if (motionState.velocity > 1000) {
      // Fast swipe burst
      const count = Math.min(15, Math.floor(motionState.velocity / 150));
      window.dispatchEvent(new CustomEvent('bkp-spawn-particles', { 
        detail: { 
          x: motionState.origin.x, 
          y: motionState.origin.y, 
          count,
          type: 'star'
        } 
      }));
    }
  }, [motionState, isEnabled]);

  return null;
}
