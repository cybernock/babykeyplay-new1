import { useState, useEffect, useCallback, useRef } from 'react';

export function useMotionDetection(reduceMotion = false) {
  const [motionState, setMotionState] = useState({
    intensity: 0,
    type: null,
    origin: { x: 0, y: 0 },
    direction: { x: 0, y: 0 },
    velocity: 0,
    isActive: false,
    tilt: { pitch: 0, roll: 0, yaw: 0 },
    acceleration: { x: 0, y: 0, z: 0 }
  });

  const [permissionState, setPermissionState] = useState('unknown'); // 'granted', 'denied', 'prompt', 'unknown'
  
  const stateRef = useRef(motionState);
  const lastMouseRef = useRef({ x: 0, y: 0, time: performance.now() });
  const lastTouchRef = useRef(new Map());
  const lastScrollRef = useRef({ x: window.scrollX, y: window.scrollY, time: performance.now() });

  // Low-pass filter helper
  const smooth = (current, target, alpha = 0.2) => current + alpha * (target - current);

  const updateState = useCallback((updates) => {
    if (reduceMotion) return;
    
    const newState = { ...stateRef.current, ...updates, isActive: true };
    
    // Smooth intensity
    newState.intensity = smooth(stateRef.current.intensity, updates.intensity || 0, 0.3);
    // Cap intensity
    newState.intensity = Math.min(100, Math.max(0, newState.intensity));
    
    stateRef.current = newState;
    setMotionState(newState);

    // Auto-reset isActive after a short delay
    if (newState.resetTimeout) clearTimeout(newState.resetTimeout);
    newState.resetTimeout = setTimeout(() => {
      stateRef.current = { ...stateRef.current, isActive: false, intensity: smooth(stateRef.current.intensity, 0, 0.1) };
      setMotionState(stateRef.current);
    }, 150);
  }, [reduceMotion]);

  const requestDeviceMotionPermission = async () => {
    if (typeof DeviceMotionEvent !== 'undefined' && typeof DeviceMotionEvent.requestPermission === 'function') {
      try {
        const permission = await DeviceMotionEvent.requestPermission();
        setPermissionState(permission);
        return permission === 'granted';
      } catch (error) {
        console.error('Error requesting device motion permission:', error);
        setPermissionState('denied');
        return false;
      }
    } else {
      setPermissionState('granted'); // Non-iOS 13+ devices
      return true;
    }
  };

  useEffect(() => {
    if (reduceMotion) return;

    // Check initial permission state for iOS 13+
    if (typeof DeviceMotionEvent !== 'undefined' && typeof DeviceMotionEvent.requestPermission === 'function') {
      setPermissionState('prompt');
    } else {
      setPermissionState('granted');
    }

    const handleMouseMove = (e) => {
      const now = performance.now();
      const dt = now - lastMouseRef.current.time;
      if (dt < 16) return; // Throttle to ~60fps

      const dx = e.clientX - lastMouseRef.current.x;
      const dy = e.clientY - lastMouseRef.current.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const velocity = (distance / dt) * 1000; // px per second

      updateState({
        type: 'mouse',
        origin: { x: e.clientX, y: e.clientY },
        direction: { x: dx / (distance || 1), y: dy / (distance || 1) },
        velocity,
        intensity: Math.min(100, velocity / 20)
      });

      lastMouseRef.current = { x: e.clientX, y: e.clientY, time: now };
    };

    const handleTouchStart = (e) => {
      const now = performance.now();
      Array.from(e.changedTouches).forEach(touch => {
        lastTouchRef.current.set(touch.identifier, { x: touch.clientX, y: touch.clientY, time: now });
      });
    };

    const handleTouchMove = (e) => {
      const now = performance.now();
      let maxVelocity = 0;
      let primaryTouch = null;
      let dx = 0, dy = 0;

      Array.from(e.changedTouches).forEach(touch => {
        const last = lastTouchRef.current.get(touch.identifier);
        if (last) {
          const dt = now - last.time;
          if (dt > 0) {
            const tdx = touch.clientX - last.x;
            const tdy = touch.clientY - last.y;
            const distance = Math.sqrt(tdx * tdx + tdy * tdy);
            const velocity = (distance / dt) * 1000;
            
            if (velocity > maxVelocity) {
              maxVelocity = velocity;
              primaryTouch = touch;
              dx = tdx; dy = tdy;
            }
            lastTouchRef.current.set(touch.identifier, { x: touch.clientX, y: touch.clientY, time: now });
          }
        }
      });

      if (primaryTouch && maxVelocity > 50) {
        const distance = Math.sqrt(dx * dx + dy * dy);
        updateState({
          type: 'touch',
          origin: { x: primaryTouch.clientX, y: primaryTouch.clientY },
          direction: { x: dx / (distance || 1), y: dy / (distance || 1) },
          velocity: maxVelocity,
          intensity: Math.min(100, maxVelocity / 30)
        });
      }
    };

    const handleTouchEnd = (e) => {
      Array.from(e.changedTouches).forEach(touch => {
        lastTouchRef.current.delete(touch.identifier);
      });
    };

    const handleScroll = () => {
      const now = performance.now();
      const dt = now - lastScrollRef.current.time;
      if (dt < 16) return;

      const dx = window.scrollX - lastScrollRef.current.x;
      const dy = window.scrollY - lastScrollRef.current.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const velocity = (distance / dt) * 1000;

      if (velocity > 10) {
        updateState({
          type: 'scroll',
          origin: { x: window.innerWidth / 2, y: window.innerHeight / 2 },
          direction: { x: dx / (distance || 1), y: dy / (distance || 1) },
          velocity,
          intensity: Math.min(100, velocity / 15)
        });
      }

      lastScrollRef.current = { x: window.scrollX, y: window.scrollY, time: now };
    };

    let lastDeviceMotionTime = performance.now();
    const handleDeviceMotion = (e) => {
      const now = performance.now();
      if (now - lastDeviceMotionTime < 33) return; // Throttle to ~30Hz for battery
      lastDeviceMotionTime = now;

      const acc = e.accelerationIncludingGravity || e.acceleration;
      if (!acc) return;

      const x = acc.x || 0;
      const y = acc.y || 0;
      const z = acc.z || 0;
      
      // Calculate magnitude excluding 1g of gravity roughly
      const magnitude = Math.sqrt(x*x + y*y + z*z);
      const shakeIntensity = Math.max(0, magnitude - 9.8) * 5;

      if (shakeIntensity > 10) {
        updateState({
          type: 'device',
          acceleration: { x, y, z },
          intensity: Math.min(100, shakeIntensity),
          origin: { x: window.innerWidth / 2, y: window.innerHeight / 2 }
        });
      }
    };

    const handleDeviceOrientation = (e) => {
      updateState({
        tilt: {
          pitch: e.beta || 0, // -180 to 180
          roll: e.gamma || 0, // -90 to 90
          yaw: e.alpha || 0   // 0 to 360
        }
      });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    if (permissionState === 'granted') {
      window.addEventListener('devicemotion', handleDeviceMotion, { passive: true });
      window.addEventListener('deviceorientation', handleDeviceOrientation, { passive: true });
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('devicemotion', handleDeviceMotion);
      window.removeEventListener('deviceorientation', handleDeviceOrientation);
    };
  }, [reduceMotion, permissionState, updateState]);

  return [motionState, requestDeviceMotionPermission, permissionState];
}
