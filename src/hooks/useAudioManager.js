import { useRef, useCallback, useEffect } from 'react';

const NOTES = {
  'a': 261.63, // C4
  's': 293.66, // D4
  'd': 329.63, // E4
  'f': 349.23, // F4
  'g': 392.00, // G4
  'h': 440.00, // A4
  'j': 493.88, // B4
  'k': 523.25, // C5
};

const NOTE_FREQUENCIES = Object.values(NOTES);

export function useAudioManager() {
  const audioCtxRef = useRef(null);
  const analyserRef = useRef(null);
  const activeOscillators = useRef(new Map());

  const initAudio = useCallback(() => {
    if (!audioCtxRef.current) {
      try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        audioCtxRef.current = new AudioContext();
        analyserRef.current = audioCtxRef.current.createAnalyser();
        analyserRef.current.fftSize = 256;
        analyserRef.current.connect(audioCtxRef.current.destination);
      } catch (e) {
        console.warn('Web Audio API not supported');
      }
    }
    if (audioCtxRef.current?.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    return { ctx: audioCtxRef.current, analyser: analyserRef.current };
  }, []);

  const playNote = useCallback((key, sustain = false, xPosition = 0.5) => {
    const { ctx, analyser } = initAudio();
    if (!ctx) return;

    const freq = typeof key === 'number' ? key : (NOTES[key?.toLowerCase()] || NOTE_FREQUENCIES[Math.floor(Math.random() * NOTE_FREQUENCIES.length)]);
    
    if (sustain && activeOscillators.current.has(key)) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const panner = ctx.createStereoPanner ? ctx.createStereoPanner() : null;
    
    osc.type = 'sine';
    osc.frequency.value = freq;
    
    osc.connect(gain);
    
    if (panner) {
      panner.pan.value = (xPosition * 2) - 1; // -1 to 1
      gain.connect(panner);
      panner.connect(analyser);
    } else {
      gain.connect(analyser);
    }
    
    osc.start();
    
    if (sustain) {
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      activeOscillators.current.set(key, { osc, gain });
    } else {
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
      osc.stop(ctx.currentTime + 0.5);
    }
  }, [initAudio]);

  const stopNote = useCallback((key) => {
    const ctx = audioCtxRef.current;
    if (!ctx) return;
    
    const active = activeOscillators.current.get(key);
    if (active) {
      active.gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
      active.osc.stop(ctx.currentTime + 0.1);
      activeOscillators.current.delete(key);
    }
  }, []);

  const playAnimalSound = useCallback((xPosition = 0.5) => {
    const { ctx, analyser } = initAudio();
    if (!ctx) return;
    
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const panner = ctx.createStereoPanner ? ctx.createStereoPanner() : null;
    
    osc.type = Math.random() > 0.5 ? 'square' : 'sawtooth';
    osc.frequency.setValueAtTime(150 + Math.random() * 300, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + 0.3);
    
    osc.connect(gain);
    if (panner) {
      panner.pan.value = (xPosition * 2) - 1;
      gain.connect(panner);
      panner.connect(analyser);
    } else {
      gain.connect(analyser);
    }
    
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
    
    osc.start();
    osc.stop(ctx.currentTime + 0.3);
  }, [initAudio]);

  const playPop = useCallback((xPosition = 0.5) => {
    const { ctx, analyser } = initAudio();
    if (!ctx) return;
    
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const panner = ctx.createStereoPanner ? ctx.createStereoPanner() : null;
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.1);
    
    osc.connect(gain);
    if (panner) {
      panner.pan.value = (xPosition * 2) - 1;
      gain.connect(panner);
      panner.connect(analyser);
    } else {
      gain.connect(analyser);
    }
    
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
    
    osc.start();
    osc.stop(ctx.currentTime + 0.1);
  }, [initAudio]);

  const speak = useCallback((text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.pitch = 1.5; // Kid friendly high pitch
      utterance.rate = 1.2;
      utterance.volume = 0.8;
      window.speechSynthesis.speak(utterance);
    }
  }, []);

  return {
    initAudio,
    playNote,
    stopNote,
    playAnimalSound,
    playPop,
    speak,
    getAnalyser: () => analyserRef.current
  };
}
