import React, { useEffect, useRef } from 'react';
import { useParentPanel } from '@/hooks/useParentPanel.jsx';
import { motion, AnimatePresence } from 'framer-motion';

export default function IdleDemo() {
  const { isLocked } = useParentPanel();
  const [isIdle, setIsIdle] = React.useState(false);
  const timeoutRef = useRef(null);
  const demoIntervalRef = useRef(null);

  useEffect(() => {
    if (isLocked) {
      setIsIdle(false);
      return;
    }

    const resetIdle = () => {
      setIsIdle(false);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (demoIntervalRef.current) clearInterval(demoIntervalRef.current);
      
      timeoutRef.current = setTimeout(() => {
        setIsIdle(true);
      }, 30000); // 30 seconds to idle
    };

    window.addEventListener('mousemove', resetIdle);
    window.addEventListener('keydown', resetIdle);
    window.addEventListener('touchstart', resetIdle);
    
    resetIdle();

    return () => {
      window.removeEventListener('mousemove', resetIdle);
      window.removeEventListener('keydown', resetIdle);
      window.removeEventListener('touchstart', resetIdle);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (demoIntervalRef.current) clearInterval(demoIntervalRef.current);
    };
  }, [isLocked]);

  useEffect(() => {
    if (isIdle) {
      demoIntervalRef.current = setInterval(() => {
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight;
        window.dispatchEvent(new CustomEvent('bkp-demo-interaction', { detail: { x, y } }));
      }, 1000);
    } else {
      if (demoIntervalRef.current) clearInterval(demoIntervalRef.current);
    }
    return () => {
      if (demoIntervalRef.current) clearInterval(demoIntervalRef.current);
    };
  }, [isIdle]);

  return (
    <AnimatePresence>
      {isIdle && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 pointer-events-none z-30 flex items-center justify-center"
        >
          <div className="bg-black/40 backdrop-blur-sm px-8 py-4 rounded-full text-white text-2xl font-bold tracking-widest animate-pulse">
            Tap to Play!
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
