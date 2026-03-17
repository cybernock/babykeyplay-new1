import React, { useState, useRef } from 'react';
import { useParentPanel } from '@/hooks/useParentPanel.jsx';

export default function ParentUnlockDetector() {
  const { openPanel, isPanelOpen, isLocked, unlockScreen } = useParentPanel();
  const [progress, setProgress] = useState(0);
  const timerRef = useRef(null);
  const intervalRef = useRef(null);

  if (isPanelOpen) return null;

  const handleStart = (e) => {
    e.preventDefault();
    let currentProgress = 0;
    
    intervalRef.current = setInterval(() => {
      currentProgress += 5; // 5% every 100ms = 2 seconds total
      setProgress(currentProgress);
      
      if (currentProgress >= 100) {
        clearInterval(intervalRef.current);
        setProgress(0);
        if (isLocked) {
          unlockScreen();
        } else {
          openPanel();
        }
      }
    }, 100);
  };

  const handleEnd = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setProgress(0);
  };

  return (
    <div 
      className="fixed top-0 left-0 w-16 h-16 z-50 flex items-start justify-start p-2 cursor-pointer"
      onMouseDown={handleStart}
      onMouseUp={handleEnd}
      onMouseLeave={handleEnd}
      onTouchStart={handleStart}
      onTouchEnd={handleEnd}
      style={{ touchAction: 'none' }}
    >
      {progress > 0 && (
        <div className="w-8 h-8 rounded-full border-4 border-white/20 relative overflow-hidden">
          <div 
            className="absolute bottom-0 left-0 w-full bg-white/80 transition-all duration-100"
            style={{ height: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
}
