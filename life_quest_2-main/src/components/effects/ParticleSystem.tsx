'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Particle {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
  type: 'star' | 'ember' | 'bubble' | 'lightning' | 'leaf' | 'coin' | 'xp';
}

interface ParticleSystemProps {
  type: 'stars' | 'embers' | 'bubbles' | 'lightning' | 'leaves' | 'celebration';
  intensity?: number;
  trigger?: boolean;
  position?: { x: number; y: number };
}

export function ParticleSystem({ 
  type, 
  intensity = 1, 
  trigger = false, 
  position 
}: ParticleSystemProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const particlesRef = useRef<Particle[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const createParticle = (x?: number, y?: number): Particle => {
      const configs = {
        stars: {
          x: x ?? Math.random() * canvas.width,
          y: y ?? Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          life: 300,
          size: Math.random() * 2 + 1,
          color: `hsl(${Math.random() * 60 + 200}, 70%, 80%)`,
          type: 'star' as const
        },
        embers: {
          x: x ?? Math.random() * canvas.width,
          y: y ?? canvas.height + 10,
          vx: (Math.random() - 0.5) * 2,
          vy: -Math.random() * 3 - 1,
          life: 200,
          size: Math.random() * 4 + 2,
          color: `hsl(${Math.random() * 30 + 10}, 90%, 60%)`,
          type: 'ember' as const
        },
        bubbles: {
          x: x ?? Math.random() * canvas.width,
          y: y ?? canvas.height + 10,
          vx: (Math.random() - 0.5) * 1,
          vy: -Math.random() * 2 - 0.5,
          life: 400,
          size: Math.random() * 8 + 4,
          color: `hsla(200, 70%, 80%, 0.6)`,
          type: 'bubble' as const
        },
        lightning: {
          x: x ?? Math.random() * canvas.width,
          y: y ?? Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 4,
          vy: (Math.random() - 0.5) * 4,
          life: 100,
          size: Math.random() * 3 + 1,
          color: `hsl(240, 100%, ${Math.random() * 30 + 70}%)`,
          type: 'lightning' as const
        },
        leaves: {
          x: x ?? Math.random() * canvas.width,
          y: y ?? -10,
          vx: (Math.random() - 0.5) * 2,
          vy: Math.random() * 2 + 0.5,
          life: 500,
          size: Math.random() * 6 + 3,
          color: `hsl(${Math.random() * 60 + 80}, 60%, 50%)`,
          type: 'leaf' as const
        },
        celebration: {
          x: x ?? canvas.width / 2,
          y: y ?? canvas.height / 2,
          vx: (Math.random() - 0.5) * 8,
          vy: (Math.random() - 0.5) * 8,
          life: 150,
          size: Math.random() * 4 + 2,
          color: `hsl(${Math.random() * 360}, 80%, 60%)`,
          type: Math.random() > 0.5 ? 'coin' : 'xp' as const
        }
      };

      const config = configs[type];
      return {
        id: Math.random().toString(36),
        ...config,
        maxLife: config.life
      };
    };

    const updateParticles = () => {
      particlesRef.current = particlesRef.current.filter(particle => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.life--;

        // Apply gravity for certain types
        if (particle.type === 'ember' || particle.type === 'leaf') {
          particle.vy += 0.02;
        }

        // Bounce bubbles
        if (particle.type === 'bubble') {
          if (particle.x <= 0 || particle.x >= canvas.width) particle.vx *= -0.8;
          if (particle.y <= 0) particle.vy *= -0.8;
        }

        return particle.life > 0 && 
               particle.x > -50 && particle.x < canvas.width + 50 &&
               particle.y > -50 && particle.y < canvas.height + 50;
      });

      // Add new particles
      if (type === 'celebration' && trigger) {
        for (let i = 0; i < 5 * intensity; i++) {
          particlesRef.current.push(createParticle(position?.x, position?.y));
        }
      } else if (Math.random() < 0.1 * intensity) {
        particlesRef.current.push(createParticle());
      }
    };

    const drawParticle = (particle: Particle) => {
      const alpha = particle.life / particle.maxLife;
      ctx.save();
      ctx.globalAlpha = alpha;

      switch (particle.type) {
        case 'star':
          ctx.fillStyle = particle.color;
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
          ctx.fill();
          
          // Add twinkle effect
          if (Math.random() < 0.1) {
            ctx.strokeStyle = 'white';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particle.x - particle.size * 2, particle.y);
            ctx.lineTo(particle.x + particle.size * 2, particle.y);
            ctx.moveTo(particle.x, particle.y - particle.size * 2);
            ctx.lineTo(particle.x, particle.y + particle.size * 2);
            ctx.stroke();
          }
          break;

        case 'ember':
          const gradient = ctx.createRadialGradient(
            particle.x, particle.y, 0,
            particle.x, particle.y, particle.size
          );
          gradient.addColorStop(0, particle.color);
          gradient.addColorStop(1, 'transparent');
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
          ctx.fill();
          break;

        case 'bubble':
          ctx.strokeStyle = particle.color;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
          ctx.stroke();
          
          // Add highlight
          ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
          ctx.beginPath();
          ctx.arc(particle.x - particle.size * 0.3, particle.y - particle.size * 0.3, particle.size * 0.2, 0, Math.PI * 2);
          ctx.fill();
          break;

        case 'lightning':
          ctx.strokeStyle = particle.color;
          ctx.lineWidth = particle.size;
          ctx.lineCap = 'round';
          ctx.beginPath();
          ctx.moveTo(particle.x, particle.y);
          ctx.lineTo(particle.x + particle.vx * 2, particle.y + particle.vy * 2);
          ctx.stroke();
          break;

        case 'leaf':
          ctx.fillStyle = particle.color;
          ctx.save();
          ctx.translate(particle.x, particle.y);
          ctx.rotate(particle.life * 0.1);
          ctx.beginPath();
          ctx.ellipse(0, 0, particle.size, particle.size * 0.6, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
          break;

        case 'coin':
          ctx.fillStyle = '#FFD700';
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = '#FFA500';
          ctx.lineWidth = 1;
          ctx.stroke();
          break;

        case 'xp':
          ctx.fillStyle = '#8B5CF6';
          ctx.font = `${particle.size * 2}px bold sans-serif`;
          ctx.textAlign = 'center';
          ctx.fillText('+XP', particle.x, particle.y);
          break;
      }

      ctx.restore();
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      updateParticles();
      particlesRef.current.forEach(drawParticle);
      
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [type, intensity, trigger, position]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ mixBlendMode: 'screen' }}
    />
  );
}

// XP Gain Animation Component
interface XPGainProps {
  amount: number;
  position: { x: number; y: number };
  onComplete?: () => void;
}

export function XPGainAnimation({ amount, position, onComplete }: XPGainProps) {
  return (
    <AnimatePresence onExitComplete={onComplete}>
      <motion.div
        initial={{ 
          opacity: 1, 
          scale: 0.5, 
          x: position.x, 
          y: position.y 
        }}
        animate={{ 
          opacity: 0, 
          scale: 1.5, 
          y: position.y - 100 
        }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="fixed pointer-events-none z-50 text-2xl font-bold text-primary"
        style={{ left: 0, top: 0 }}
      >
        +{amount} XP
      </motion.div>
    </AnimatePresence>
  );
}

// Achievement Unlock Animation
interface AchievementUnlockProps {
  achievement: {
    title: string;
    description: string;
    rarity: string;
  };
  onComplete?: () => void;
}

export function AchievementUnlockAnimation({ achievement, onComplete }: AchievementUnlockProps) {
  return (
    <AnimatePresence onExitComplete={onComplete}>
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: -50 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="fixed bottom-4 right-4 z-50 max-w-sm"
      >
        <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white p-4 rounded-lg shadow-2xl border border-yellow-300">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              🏆
            </div>
            <div>
              <h3 className="font-bold">Achievement Unlocked!</h3>
              <p className="text-sm opacity-90">{achievement.title}</p>
              <p className="text-xs opacity-75">{achievement.description}</p>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}