import React from 'react';
import { Lock } from 'lucide-react';
import { useParentPanel } from '@/hooks/useParentPanel.jsx';
import { motion, AnimatePresence } from 'framer-motion';

export default function LockScreen() {
  const { isLocked } = useParentPanel();

  return (
    <AnimatePresence>
      {isLocked && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-40 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm text-white"
        >
          <Lock className="w-24 h-24 mb-6 text-white/50" />
          <h1 className="text-5xl font-bold mb-4 tracking-tight">Locked</h1>
          <p className="text-xl text-white/70">Hold the top-left corner for 2 seconds to unlock</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
