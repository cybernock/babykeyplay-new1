import React, { useEffect, useRef } from 'react';

export default function MotionEffectsRenderer({ motionState, theme, isEnabled }) {
  const wrapperRef = useRef(null);

  useEffect(() => {
    if (!isEnabled || !motionState.isActive) return;

    // Screen Flash & Camera Shake on high intensity
    if (motionState.intensity > 60 && wrapperRef.current) {
      const el = wrapperRef.current;
      
      if (motionState.intensity > 80) {
        el.classList.add('screen-flash');
        setTimeout(() => el.classList.remove('screen-flash'), 300);
      }
      
      el.classList.add('camera-shake');
      setTimeout(() => el.classList.remove('camera-shake'), 200);
    }

    // Dispatch particle bursts based on intensity
    if (motionState.intensity > 30 && Math.random() > 0.5) {
      const count = Math.floor(motionState.intensity / 10);
      window.dispatchEvent(new CustomEvent('bkp-spawn-particles', { 
        detail: { 
          x: motionState.origin.x, 
          y: motionState.origin.y, 
          count: count,
          type: 'circle'
        } 
      }));
    }

  }, [motionState, isEnabled]);

  if (!isEnabled) return null;

  return (
    <div 
      ref={wrapperRef} 
      className="fixed inset-0 pointer-events-none z-20 transition-transform duration-75"
    />
  );
}
