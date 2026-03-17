import React, { useEffect, useState } from 'react';
import { useParentPanel } from '@/hooks/useParentPanel.jsx';
import { motion } from 'framer-motion';

export default function MultiplayerMode() {
  const { multiplayer, isLocked } = useParentPanel();
  const [score1, setScore1] = useState(0);
  const [score2, setScore2] = useState(0);

  useEffect(() => {
    if (!multiplayer || isLocked) return;

    const handleInteraction = (e) => {
      const { player, points } = e.detail;
      if (player === 1) setScore1(s => s + points);
      if (player === 2) setScore2(s => s + points);
    };

    window.addEventListener('bkp-score', handleInteraction);
    return () => window.removeEventListener('bkp-score', handleInteraction);
  }, [multiplayer, isLocked]);

  if (!multiplayer) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-20 flex">
      {/* Split line */}
      <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-white/20 -translate-x-1/2" />
      
      {/* Player 1 Score */}
      <div className="flex-1 p-8">
        <motion.div 
          key={score1}
          initial={{ scale: 1.2, color: '#fff' }}
          animate={{ scale: 1, color: '#4ade80' }}
          className="text-4xl font-bold text-green-400 drop-shadow-lg"
        >
          P1: {score1}
        </motion.div>
        <div className="text-white/50 text-sm mt-2">WASD / Left Side</div>
      </div>

      {/* Player 2 Score */}
      <div className="flex-1 p-8 text-right">
        <motion.div 
          key={score2}
          initial={{ scale: 1.2, color: '#fff' }}
          animate={{ scale: 1, color: '#60a5fa' }}
          className="text-4xl font-bold text-blue-400 drop-shadow-lg"
        >
          P2: {score2}
        </motion.div>
        <div className="text-white/50 text-sm mt-2">Arrows / Right Side</div>
      </div>
    </div>
  );
}
