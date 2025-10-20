'use client';

import { useState, useCallback, useRef } from 'react';

interface MicroInteractionState {
  isPressed: boolean;
  isHovered: boolean;
  isLoading: boolean;
  ripples: Array<{ id: number; x: number; y: number }>;
}

interface MicroInteractionOptions {
  hapticFeedback?: boolean;
  soundFeedback?: boolean;
  rippleEffect?: boolean;
  pressAnimation?: boolean;
  loadingState?: boolean;
}

export function useMicroInteractions(options: MicroInteractionOptions = {}) {
  const {
    hapticFeedback = true,
    soundFeedback = false,
    rippleEffect = true,
    pressAnimation = true,
    loadingState = false
  } = options;

  const [state, setState] = useState<MicroInteractionState>({
    isPressed: false,
    isHovered: false,
    isLoading: false,
    ripples: []
  });

  const rippleIdRef = useRef(0);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Haptic feedback (if supported)
  const triggerHaptic = useCallback((intensity: 'light' | 'medium' | 'heavy' = 'light') => {
    if (!hapticFeedback || !navigator.vibrate) return;
    
    const patterns = {
      light: [10],
      medium: [20],
      heavy: [30]
    };
    
    navigator.vibrate(patterns[intensity]);
  }, [hapticFeedback]);

  // Sound feedback
  const triggerSound = useCallback((frequency: number = 800, duration: number = 100) => {
    if (!soundFeedback) return;

    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }

      const ctx = audioContextRef.current;
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);
      oscillator.type = 'sine';

      gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration / 1000);

      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + duration / 1000);
    } catch (error) {
      console.warn('Audio feedback not supported:', error);
    }
  }, [soundFeedback]);

  // Create ripple effect
  const createRipple = useCallback((event: React.MouseEvent) => {
    if (!rippleEffect) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const rippleId = rippleIdRef.current++;

    setState(prev => ({
      ...prev,
      ripples: [...prev.ripples, { id: rippleId, x, y }]
    }));

    // Remove ripple after animation
    setTimeout(() => {
      setState(prev => ({
        ...prev,
        ripples: prev.ripples.filter(ripple => ripple.id !== rippleId)
      }));
    }, 600);
  }, [rippleEffect]);

  // Event handlers
  const handleMouseDown = useCallback((event: React.MouseEvent) => {
    if (pressAnimation) {
      setState(prev => ({ ...prev, isPressed: true }));
    }
    
    if (rippleEffect) {
      createRipple(event);
    }
    
    if (hapticFeedback) {
      triggerHaptic('light');
    }
    
    if (soundFeedback) {
      triggerSound(600, 50);
    }
  }, [pressAnimation, rippleEffect, hapticFeedback, soundFeedback, createRipple, triggerHaptic, triggerSound]);

  const handleMouseUp = useCallback(() => {
    if (pressAnimation) {
      setState(prev => ({ ...prev, isPressed: false }));
    }
  }, [pressAnimation]);

  const handleMouseEnter = useCallback(() => {
    setState(prev => ({ ...prev, isHovered: true }));
    
    if (soundFeedback) {
      triggerSound(400, 30);
    }
  }, [soundFeedback, triggerSound]);

  const handleMouseLeave = useCallback(() => {
    setState(prev => ({ 
      ...prev, 
      isHovered: false, 
      isPressed: false 
    }));
  }, []);

  const handleClick = useCallback((callback?: () => void | Promise<void>) => {
    return async (event: React.MouseEvent) => {
      if (hapticFeedback) {
        triggerHaptic('medium');
      }
      
      if (soundFeedback) {
        triggerSound(800, 100);
      }

      if (loadingState && callback) {
        setState(prev => ({ ...prev, isLoading: true }));
        
        try {
          await callback();
        } finally {
          setState(prev => ({ ...prev, isLoading: false }));
        }
      } else if (callback) {
        callback();
      }
    };
  }, [hapticFeedback, soundFeedback, loadingState, triggerHaptic, triggerSound]);

  // Animation variants for framer-motion
  const animationVariants = {
    initial: { scale: 1 },
    hover: { 
      scale: 1.05,
      transition: { duration: 0.2, ease: "easeOut" }
    },
    pressed: { 
      scale: 0.95,
      transition: { duration: 0.1, ease: "easeInOut" }
    },
    loading: {
      scale: [1, 1.05, 1],
      transition: { 
        duration: 1,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  // CSS classes for styling
  const getClasses = useCallback((baseClasses: string = '') => {
    const classes = [baseClasses];
    
    if (state.isHovered) classes.push('hover:shadow-lg');
    if (state.isPressed) classes.push('active:shadow-inner');
    if (state.isLoading) classes.push('cursor-wait');
    
    return classes.filter(Boolean).join(' ');
  }, [state]);

  // Ripple component
  const RippleEffect = useCallback(() => {
    if (!rippleEffect || state.ripples.length === 0) return null;

    return (
      <>
        {state.ripples.map(ripple => (
          <div
            key={ripple.id}
            className="absolute pointer-events-none"
            style={{
              left: ripple.x,
              top: ripple.y,
              transform: 'translate(-50%, -50%)'
            }}
          >
            <div className="w-0 h-0 bg-white/30 rounded-full animate-ping" 
                 style={{
                   animation: 'ripple 0.6s ease-out forwards'
                 }} 
            />
          </div>
        ))}
        <style jsx>{`
          @keyframes ripple {
            to {
              width: 100px;
              height: 100px;
              opacity: 0;
            }
          }
        `}</style>
      </>
    );
  }, [rippleEffect, state.ripples]);

  return {
    state,
    handlers: {
      onMouseDown: handleMouseDown,
      onMouseUp: handleMouseUp,
      onMouseEnter: handleMouseEnter,
      onMouseLeave: handleMouseLeave,
      onClick: handleClick
    },
    animationVariants,
    getClasses,
    RippleEffect,
    utils: {
      triggerHaptic,
      triggerSound,
      setLoading: (loading: boolean) => 
        setState(prev => ({ ...prev, isLoading: loading }))
    }
  };
}

// Success feedback hook
export function useSuccessFeedback() {
  const triggerSuccess = useCallback(() => {
    // Haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate([50, 50, 100]);
    }

    // Sound feedback
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Success chord (C major)
      const frequencies = [523.25, 659.25, 783.99]; // C5, E5, G5
      
      frequencies.forEach((freq, index) => {
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);
        
        oscillator.frequency.setValueAtTime(freq, ctx.currentTime);
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
        
        oscillator.start(ctx.currentTime + index * 0.1);
        oscillator.stop(ctx.currentTime + 0.5 + index * 0.1);
      });
    } catch (error) {
      console.warn('Audio feedback not supported:', error);
    }
  }, []);

  return { triggerSuccess };
}

// Error feedback hook
export function useErrorFeedback() {
  const triggerError = useCallback(() => {
    // Haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate([100, 50, 100, 50, 100]);
    }

    // Sound feedback
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      oscillator.frequency.setValueAtTime(200, ctx.currentTime);
      oscillator.type = 'sawtooth';
      
      gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
      
      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.3);
    } catch (error) {
      console.warn('Audio feedback not supported:', error);
    }
  }, []);

  return { triggerError };
}