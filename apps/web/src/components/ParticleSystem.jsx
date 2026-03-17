import React, { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { useParentPanel } from '@/hooks/useParentPanel.jsx';
import { getThemeConfig } from '@/hooks/useThemeConfig.js';

const ParticleSystem = forwardRef((props, ref) => {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const { theme, reduceMotion, particleDensity, fpsCap, brightness } = useParentPanel();
  const themeConfig = getThemeConfig(theme);

  // Initialize highly optimized object pool
  useEffect(() => {
    const maxParticles = Math.min(5000, particleDensity * 20); // Scale with density
    const pool = new Array(maxParticles);
    for (let i = 0; i < maxParticles; i++) {
      pool[i] = { active: false, x: 0, y: 0, vx: 0, vy: 0, color: '#fff', size: 5, life: 0, maxLife: 1, type: 'circle', rotation: 0, vr: 0 };
    }
    particlesRef.current = pool;
  }, [particleDensity]);

  useImperativeHandle(ref, () => ({
    spawnExplosion: (x, y, count = 20, customType = null) => {
      if (reduceMotion) return;
      const pool = particlesRef.current;
      const colors = themeConfig.particleColors;
      const shapes = themeConfig.particleShapes;
      let spawned = 0;
      
      for (let i = 0; i < pool.length && spawned < count; i++) {
        const p = pool[i];
        if (!p.active) {
          const angle = Math.random() * Math.PI * 2;
          const speed = Math.random() * 200 + 50;
          p.active = true;
          p.x = x; p.y = y;
          p.vx = Math.cos(angle) * speed;
          p.vy = Math.sin(angle) * speed;
          p.color = colors[Math.floor(Math.random() * colors.length)];
          p.size = Math.random() * 10 + 5;
          p.life = p.maxLife = Math.random() * 1.5 + 0.5;
          p.type = customType || shapes[Math.floor(Math.random() * shapes.length)];
          p.rotation = Math.random() * Math.PI * 2;
          p.vr = (Math.random() - 0.5) * 10;
          spawned++;
        }
      }
    },
    spawnEmojiRain: () => {
      if (reduceMotion) return;
      const pool = particlesRef.current;
      const emojis = ['🌟','⭐','✨','🎉','🎊','🎈','🎁','🎀','🎂','🍰','🍭','🍬','🍪','🍩','🍫','🍦','🍧','🍨'];
      let spawned = 0;
      
      for (let i = 0; i < pool.length && spawned < 50; i++) {
        const p = pool[i];
        if (!p.active) {
          p.active = true;
          p.x = Math.random() * window.innerWidth;
          p.y = -50 - Math.random() * 200;
          p.vx = (Math.random() - 0.5) * 50;
          p.vy = Math.random() * 100 + 50;
          p.color = emojis[Math.floor(Math.random() * emojis.length)];
          p.size = Math.random() * 20 + 20;
          p.life = p.maxLife = 5;
          p.type = 'emoji';
          p.rotation = Math.random() * Math.PI * 2;
          p.vr = (Math.random() - 0.5) * 5;
          spawned++;
        }
      }
    }
  }));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false }); // Optimize for no transparency on base
    let animationId;
    let lastTime = performance.now();
    const frameInterval = 1000 / fpsCap;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Parse hex to rgb for trails
    const hexToRgb = (hex) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : '10, 14, 39';
    };
    const bgRgb = hexToRgb(themeConfig.backgroundColor);

    const animate = (currentTime) => {
      animationId = requestAnimationFrame(animate);
      
      const dt = currentTime - lastTime;
      if (dt < frameInterval) return;
      
      const deltaSec = Math.min(dt / 1000, 0.1);
      lastTime = currentTime - (dt % frameInterval);

      // Motion blur / Trails effect
      if (!reduceMotion && themeConfig.id !== 'neon') {
        ctx.fillStyle = `rgba(${bgRgb}, 0.2)`;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      } else {
        ctx.fillStyle = themeConfig.backgroundColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      const pool = particlesRef.current;
      const gravity = themeConfig.id === 'space' ? 0 : 300;
      const friction = 0.98;

      for (let i = 0; i < pool.length; i++) {
        const p = pool[i];
        if (!p.active) continue;

        p.vy += gravity * deltaSec;
        p.vx *= friction;
        p.vy *= friction;
        p.x += p.vx * deltaSec;
        p.y += p.vy * deltaSec;
        p.rotation += p.vr * deltaSec;
        p.life -= deltaSec;

        // Bounce off bottom
        if (p.y > canvas.height - p.size && p.vy > 0) {
          p.y = canvas.height - p.size;
          p.vy *= -0.6;
          p.vx *= 0.8;
        }

        if (p.life <= 0) {
          p.active = false;
          continue;
        }

        ctx.globalAlpha = Math.max(0, p.life / p.maxLife);
        
        if (p.type === 'emoji') {
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation);
          ctx.font = `${p.size}px Arial`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(p.color, 0, 0);
          ctx.restore();
        } else {
          ctx.fillStyle = p.color;
          if (p.type === 'circle' || p.type === 'bubble') {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
          } else {
            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(p.rotation);
            ctx.fillRect(-p.size/2, -p.size/2, p.size, p.size);
            ctx.restore();
          }
        }
      }
      ctx.globalAlpha = 1;
    };

    animationId = requestAnimationFrame(animate);
    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId);
    };
  }, [themeConfig, reduceMotion, fpsCap]);

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 w-full h-full"
      style={{ filter: `brightness(${brightness}%)` }}
    />
  );
});

ParticleSystem.displayName = 'ParticleSystem';
export default ParticleSystem;
