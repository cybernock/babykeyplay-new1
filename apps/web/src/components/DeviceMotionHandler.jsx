import React, { useEffect } from 'react';
import { Smartphone } from 'lucide-react';

export default function DeviceMotionHandler({ motionState, requestPermission, permissionState, theme, isEnabled }) {
  
  useEffect(() => {
    if (!isEnabled || motionState.type !== 'device' || !motionState.isActive) return;

    // Shake effect
    if (motionState.intensity > 40) {
      window.dispatchEvent(new CustomEvent('bkp-spawn-particles', { 
        detail: { 
          x: window.innerWidth / 2 + (Math.random() - 0.5) * 200, 
          y: window.innerHeight / 2 + (Math.random() - 0.5) * 200, 
          count: Math.floor(motionState.intensity / 5),
          type: 'star'
        } 
      }));
    }

    // Tilt effect
    if (Math.abs(motionState.tilt.roll) > 30 || Math.abs(motionState.tilt.pitch) > 30) {
      if (Math.random() > 0.8) {
        const x = motionState.tilt.roll > 0 ? window.innerWidth : 0;
        const y = motionState.tilt.pitch > 0 ? window.innerHeight : 0;
        window.dispatchEvent(new CustomEvent('bkp-spawn-particles', { 
          detail: { x: Math.abs(x), y: Math.abs(y), count: 2, type: 'circle' } 
        }));
      }
    }
  }, [motionState, isEnabled]);

  if (!isEnabled) return null;

  if (permissionState === 'prompt') {
    return (
      <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50">
        <button 
          onClick={requestPermission}
          className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 rounded-full text-white font-medium shadow-lg transition-all active:scale-95"
        >
          <Smartphone className="w-5 h-5" />
          Enable Motion Effects
        </button>
      </div>
    );
  }

  return null;
}
