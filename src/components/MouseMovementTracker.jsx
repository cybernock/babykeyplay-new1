import React, { useEffect } from 'react';

export default function MouseMovementTracker({ motionState, theme, isEnabled }) {
  useEffect(() => {
    if (!isEnabled || motionState.type !== 'mouse' || !motionState.isActive) return;

    if (motionState.velocity > 500) {
      // Motion blur trail
      const count = Math.min(10, Math.floor(motionState.velocity / 200));
      window.dispatchEvent(new CustomEvent('bkp-spawn-particles', { 
        detail: { 
          x: motionState.origin.x, 
          y: motionState.origin.y, 
          count,
          type: 'circle'
        } 
      }));
    }
  }, [motionState, isEnabled]);

  return null;
}
