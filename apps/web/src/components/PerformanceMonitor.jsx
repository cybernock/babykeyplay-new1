import React, { useEffect, useRef } from 'react';
import { useParentPanel } from '@/hooks/useParentPanel.jsx';

export default function PerformanceMonitor() {
  const { fpsCap, setParticleDensity, particleDensity } = useParentPanel();
  const frameCountRef = useRef(0);
  const lastTimeRef = useRef(performance.now());
  const lowFpsCountRef = useRef(0);

  useEffect(() => {
    let animationId;
    
    const checkPerformance = (time) => {
      frameCountRef.current++;
      
      if (time - lastTimeRef.current >= 1000) {
        const fps = frameCountRef.current;
        
        // Auto-adjust density if FPS is consistently low
        if (fps < 30) {
          lowFpsCountRef.current++;
          if (lowFpsCountRef.current > 3 && particleDensity > 50) {
            setParticleDensity(prev => Math.max(50, prev - 20));
            lowFpsCountRef.current = 0;
          }
        } else {
          lowFpsCountRef.current = 0;
        }
        
        frameCountRef.current = 0;
        lastTimeRef.current = time;
      }
      
      animationId = requestAnimationFrame(checkPerformance);
    };
    
    animationId = requestAnimationFrame(checkPerformance);
    return () => cancelAnimationFrame(animationId);
  }, [particleDensity, setParticleDensity]);

  return null;
}
