import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Volume2, Sun, Settings, Clock, Activity, Lock, Users, Sparkles, Music, Mic, MonitorPlay, BarChart2, Zap, Smartphone } from 'lucide-react';
import { useParentPanel } from '@/hooks/useParentPanel.jsx';
import { THEMES } from '@/hooks/useThemeConfig.js';
import { MODES } from '@/hooks/useModeConfig.js';

export default function ParentControlPanel() {
  const { 
    isPanelOpen, closePanel, 
    theme, setTheme, 
    mode, setMode,
    soundEnabled, toggleSound,
    brightness, setBrightness,
    reduceMotion, toggleReduceMotion,
    sessionTime, setSessionTime,
    timeRemaining,
    lockScreen,
    particleDensity, setParticleDensity,
    musicEnabled, toggleMusic,
    multiplayer, toggleMultiplayer,
    surpriseEffects, toggleSurpriseEffects,
    voiceReactions, toggleVoiceReactions,
    fpsCap, setFpsCap,
    audioVisualizer, toggleAudioVisualizer,
    starsEnabled, toggleStars,
    motionEffectsEnabled, toggleMotionEffects
  } = useParentPanel();

  const timeoutRef = useRef(null);

  const resetTimeout = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      closePanel();
    }, 60000);
  };

  useEffect(() => {
    if (isPanelOpen) resetTimeout();
    return () => clearTimeout(timeoutRef.current);
  }, [isPanelOpen]);

  if (!isPanelOpen) return null;

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const ToggleRow = ({ icon: Icon, label, checked, onChange, disabled = false }) => (
    <button 
      onClick={onChange}
      disabled={disabled}
      className={`w-full flex items-center justify-between p-4 rounded-xl border transition-colors ${
        disabled ? 'bg-zinc-900/50 border-zinc-800/50 opacity-50 cursor-not-allowed' : 'bg-zinc-900 border-zinc-800 hover:border-zinc-600'
      }`}
    >
      <div className="flex items-center gap-3">
        <Icon className={`w-5 h-5 ${checked && !disabled ? 'text-white' : 'text-zinc-500'}`} />
        <span>{label}</span>
      </div>
      <div className={`w-12 h-6 rounded-full transition-colors relative ${checked && !disabled ? 'bg-green-500' : 'bg-zinc-700'}`}>
        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${checked && !disabled ? 'left-7' : 'left-1'}`} />
      </div>
    </button>
  );

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
        onClick={closePanel}
        onMouseMove={resetTimeout}
        onTouchStart={resetTimeout}
      >
        <motion.div 
          initial={{ scale: 0.95, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.95, y: 20 }}
          onClick={e => e.stopPropagation()}
          className="bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden text-zinc-100 flex flex-col max-h-[90vh]"
        >
          <div className="flex items-center justify-between p-6 border-b border-zinc-800 shrink-0">
            <div className="flex items-center gap-3">
              <Settings className="w-6 h-6 text-zinc-400" />
              <h2 className="text-2xl font-semibold">Parent Controls</h2>
            </div>
            <button onClick={closePanel} className="p-2 rounded-full hover:bg-zinc-800 transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="p-6 overflow-y-auto space-y-10">
            
            {/* Core Settings */}
            <section>
              <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-wider mb-4">Theme & Mode</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  {Object.values(THEMES).map(t => (
                    <button
                      key={t.id}
                      onClick={() => setTheme(t.id)}
                      className={`w-full px-4 py-3 rounded-xl border text-left font-medium transition-all ${
                        theme === t.id ? 'bg-white text-black border-white' : 'bg-zinc-900 border-zinc-800 hover:border-zinc-600'
                      }`}
                    >
                      {t.name}
                    </button>
                  ))}
                </div>
                <div className="space-y-3">
                  {Object.values(MODES).map(m => (
                    <button
                      key={m.id}
                      onClick={() => setMode(m.id)}
                      className={`w-full p-3 rounded-xl border text-left transition-all ${
                        mode === m.id ? 'bg-white text-black border-white' : 'bg-zinc-900 border-zinc-800 hover:border-zinc-600'
                      }`}
                    >
                      <div className="font-medium">{m.name}</div>
                      <div className={`text-xs mt-1 ${mode === m.id ? 'text-zinc-600' : 'text-zinc-500'}`}>{m.description}</div>
                    </button>
                  ))}
                </div>
              </div>
            </section>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Gameplay & Audio */}
              <section className="space-y-4">
                <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-wider">Gameplay & Audio</h3>
                <ToggleRow icon={Users} label="Multiplayer (Split Screen)" checked={multiplayer} onChange={toggleMultiplayer} />
                <ToggleRow icon={Sparkles} label="Surprise Effects (Every 15s)" checked={surpriseEffects} onChange={toggleSurpriseEffects} />
                <ToggleRow icon={Volume2} label="Sound Effects" checked={soundEnabled} onChange={toggleSound} />
                <ToggleRow icon={Music} label="Generative Background Music" checked={musicEnabled} onChange={toggleMusic} />
                <ToggleRow icon={Mic} label="Voice Reactions (Combos)" checked={voiceReactions} onChange={toggleVoiceReactions} />
                <ToggleRow icon={BarChart2} label="Audio Visualizer" checked={audioVisualizer} onChange={toggleAudioVisualizer} />
              </section>

              {/* Graphics & Motion */}
              <section className="space-y-4">
                <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-wider">Graphics & Motion</h3>
                <ToggleRow icon={Activity} label="Reduce Motion" checked={reduceMotion} onChange={toggleReduceMotion} />
                <ToggleRow icon={Sparkles} label="Falling Stars" checked={starsEnabled} onChange={toggleStars} disabled={reduceMotion} />
                <ToggleRow icon={Zap} label="Motion Effects (Shake/Swipe)" checked={motionEffectsEnabled} onChange={toggleMotionEffects} disabled={reduceMotion} />
                
                <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3"><Sun className="w-5 h-5" /><span>Brightness</span></div>
                    <span className="text-sm text-zinc-400">{brightness}%</span>
                  </div>
                  <input type="range" min="50" max="150" value={brightness} onChange={(e) => setBrightness(e.target.value)} className="w-full accent-white" />
                </div>

                <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3"><Sparkles className="w-5 h-5" /><span>Particle Density</span></div>
                    <span className="text-sm text-zinc-400">{particleDensity}%</span>
                  </div>
                  <input type="range" min="10" max="200" step="10" value={particleDensity} onChange={(e) => setParticleDensity(e.target.value)} className="w-full accent-white" />
                </div>

                <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3"><MonitorPlay className="w-5 h-5" /><span>FPS Cap</span></div>
                  </div>
                  <div className="flex gap-2">
                    {[30, 60, 120].map(fps => (
                      <button key={fps} onClick={() => setFpsCap(fps)} className={`flex-1 py-2 rounded-lg text-sm transition-colors ${fpsCap === fps ? 'bg-white text-black' : 'bg-zinc-800 hover:bg-zinc-700'}`}>
                        {fps} FPS
                      </button>
                    ))}
                  </div>
                </div>
              </section>
            </div>

            {/* Timer */}
            <section>
              <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-wider mb-4">Session Timer</h3>
              <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3"><Clock className="w-5 h-5" /><span>Auto-Lock Timer</span></div>
                  {timeRemaining > 0 && <span className="text-sm font-mono text-green-400">{formatTime(timeRemaining)}</span>}
                </div>
                <div className="flex gap-2">
                  {[0, 5, 15, 30, 60].map(mins => (
                    <button key={mins} onClick={() => setSessionTime(mins)} className={`flex-1 py-3 rounded-lg text-sm font-medium transition-colors ${sessionTime === mins ? 'bg-white text-black' : 'bg-zinc-800 hover:bg-zinc-700'}`}>
                      {mins === 0 ? 'Off' : `${mins}m`}
                    </button>
                  ))}
                </div>
              </div>
            </section>

          </div>

          <div className="p-6 border-t border-zinc-800 bg-zinc-900/50 flex justify-between items-center shrink-0">
            <button 
              onClick={() => { lockScreen(); closePanel(); }}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors font-medium"
            >
              <Lock className="w-5 h-5" />
              Lock Screen Now
            </button>
            <button 
              onClick={closePanel}
              className="px-8 py-3 rounded-xl bg-white text-black font-medium hover:bg-zinc-200 transition-colors"
            >
              Done
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
