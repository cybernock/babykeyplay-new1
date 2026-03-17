import React, { useEffect, useRef } from 'react';
import { getThemeConfig } from '@/hooks/useThemeConfig.js';

export default function FallingStarsSystem({ theme, isEnabled }) {
  const canvasRef = useRef(null);
  const starsRef = useRef([]);
  const themeConfig = getThemeConfig(theme);

  useEffect(() => {
    // Initialize pool
    const pool = new Array(200);
    for (let i = 0; i < 200; i++) {
      pool[i] = { active: false, x: 0, y: 0, vx: 0, vy: 0, size: 0, rotation: 0, vr: 0, color: '', life: 0, maxLife: 1 };
    }
    starsRef.current = pool;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !isEnabled) return;
    
    const ctx = canvas.getContext('2d');
    let animationId;
    let lastTime = performance.now();
    let spawnTimer = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const spawnStar = () => {
      const pool = starsRef.current;
      const star = pool.find(s => !s.active);
      if (star) {
        star.active = true;
        star.x = Math.random() * canvas.width;
        star.y = -20;
        star.vx = (Math.random() - 0.5) * 50;
        star.vy = Math.random() * 50 + 50;
        star.size = Math.random() * 4 + 2; // small to large
        star.rotation = Math.random() * Math.PI * 2;
        star.vr = (Math.random() - 0.5) * 5;
        star.color = themeConfig.particleColors[Math.floor(Math.random() * themeConfig.particleColors.length)];
        star.maxLife = Math.random() * 3 + 5; // 5-8 seconds
        star.life = star.maxLife;
      }
    };

    const animate = (currentTime) => {
      animationId = requestAnimationFrame(animate);
      const dt = Math.min((currentTime - lastTime) / 1000, 0.1);
      lastTime = currentTime;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Spawn logic (2-5 per second)
      spawnTimer += dt;
      if (spawnTimer > (Math.random() * 0.3 + 0.2)) {
        spawnStar();
        spawnTimer = 0;
      }

      const pool = starsRef.current;
      const gravity = 150;

      for (let i = 0; i < pool.length; i++) {
        const s = pool[i];
        if (!s.active) continue;

        s.vy += gravity * dt;
        s.x += s.vx * dt;
        s.y += s.vy * dt;
        s.rotation += s.vr * dt;
        s.life -= dt;

        // Bounce off bottom
        if (s.y > canvas.height - s.size && s.vy > 0) {
          s.y = canvas.height - s.size;
          s.vy *= -0.6;
          s.vx *= 0.8;
        }
        
        // Bounce off sides
        if ((s.x < s.size && s.vx < 0) || (s.x > canvas.width - s.size && s.vx > 0)) {
          s.vx *= -0.8;
        }

        if (s.life <= 0) {
          s.active = false;
          continue;
        }

        const opacity = Math.min(1, s.life / 2); // Fade out in last 2 seconds
        
        ctx.save();
        ctx.globalAlpha = opacity;
        ctx.translate(s.x, s.y);
        ctx.rotate(s.rotation);
        
        // Glow effect
        ctx.shadowBlur = 10;
        ctx.shadowColor = s.color;
        ctx.fillStyle = s.color;
        
        // Draw star shape
        ctx.beginPath();
        for (let j = 0; j < 5; j++) {
          ctx.lineTo(Math.cos((18 + j * 72) * Math.PI / 180) * s.size,
                     -Math.sin((18 + j * 72) * Math.PI / 180) * s.size);
          ctx.lineTo(Math.cos((54 + j * 72) * Math.PI / 180) * (s.size / 2),
                     -Math.sin((54 + j * 72) * Math.PI / 180) * (s.size / 2));
        }
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }
    };

    animationId = requestAnimationFrame(animate);
    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId);
    };
  }, [isEnabled, themeConfig]);

  if (!isEnabled) return null;

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 w-full h-full pointer-events-none z-10"
      style={{ mixBlendMode: 'screen' }}
    />
  );
}
