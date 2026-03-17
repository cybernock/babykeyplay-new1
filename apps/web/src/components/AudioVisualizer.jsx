import React, { useEffect, useRef } from 'react';
import { useParentPanel } from '@/hooks/useParentPanel.jsx';
import { useAudioManager } from '@/hooks/useAudioManager.js';

export default function AudioVisualizer() {
  const { audioVisualizer, isLocked } = useParentPanel();
  const { getAnalyser } = useAudioManager();
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!audioVisualizer || isLocked) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const analyser = getAnalyser();
    
    if (!analyser) return;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    let animationId;

    const draw = () => {
      animationId = requestAnimationFrame(draw);
      
      canvas.width = window.innerWidth;
      canvas.height = 100;
      
      analyser.getByteFrequencyData(dataArray);
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const barWidth = (canvas.width / bufferLength) * 2.5;
      let barHeight;
      let x = 0;
      
      for(let i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i] / 2.5;
        
        ctx.fillStyle = `hsla(${i * 2}, 100%, 50%, 0.5)`;
        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
        
        x += barWidth + 1;
      }
    };

    draw();
    return () => cancelAnimationFrame(animationId);
  }, [audioVisualizer, isLocked, getAnalyser]);

  if (!audioVisualizer) return null;

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed bottom-0 left-0 w-full h-[100px] pointer-events-none z-10 opacity-50 mix-blend-screen"
    />
  );
}
