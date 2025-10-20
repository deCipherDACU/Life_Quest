'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
  type: 'spark' | 'star' | 'circle' | 'plus' | 'diamond';
}

interface ParticleSystemProps {
  trigger?: boolean;
  count?: number;
  duration?: number;
  colors?: string[];
  size?: { min: number; max: number };
  velocity?: { min: number; max: number };
  gravity?: number;
  className?: string;
  onComplete?: () => void;
}

export function ParticleSystem({
  trigger = false,
  count = 20,
  duration = 2000,
  colors = ['#FFD700', '#FF6B35', '#F7931E', '#FFE135'],
  size = { min: 2, max: 6 },
  velocity = { min: 2, max: 8 },
  gravity = 0.1,
  className = '',
  onComplete
}: ParticleSystemProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const [particles, setParticles] = useState<Particle[]>([]);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (trigger && !isActive) {
      createParticles();
      setIsActive(true);
    }
  }, [trigger]);

  const createParticles = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const newParticles: Particle[] = [];

    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5;
      const speed = velocity.min + Math.random() * (velocity.max - velocity.min);
      
      newParticles.push({
        id: i,
        x: centerX,
        y: centerY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 0,
        maxLife: duration / 16, // 60fps approximation
        size: size.min + Math.random() * (size.max - size.min),
        color: colors[Math.floor(Math.random() * colors.length)],
        type: ['spark', 'star', 'circle', 'plus', 'diamond'][Math.floor(Math.random() * 5)] as Particle['type']
      });
    }

    setParticles(newParticles);
    animate();
  };

  const animate = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    setParticles(prevParticles => {
      const updatedParticles = prevParticles
        .map(particle => ({
          ...particle,
          x: particle.x + particle.vx,
          y: particle.y + particle.vy,
          vy: particle.vy + gravity,
          life: particle.life + 1
        }))
        .filter(particle => particle.life < particle.maxLife);

      // Draw particles
      updatedParticles.forEach(particle => {
        const alpha = 1 - (particle.life / particle.maxLife);
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = particle.color;
        
        drawParticle(ctx, particle);
        
        ctx.restore();
      });

      if (updatedParticles.length > 0) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setIsActive(false);
        onComplete?.();
      }

      return updatedParticles;
    });
  };

  const drawParticle = (ctx: CanvasRenderingContext2D, particle: Particle) => {
    const { x, y, size, type } = particle;
    
    switch (type) {
      case 'circle':
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
        break;
        
      case 'star':
        drawStar(ctx, x, y, size);
        break;
        
      case 'plus':
        ctx.fillRect(x - size, y - size/3, size * 2, size * 2/3);
        ctx.fillRect(x - size/3, y - size, size * 2/3, size * 2);
        break;
        
      case 'diamond':
        ctx.beginPath();
        ctx.moveTo(x, y - size);
        ctx.lineTo(x + size, y);
        ctx.lineTo(x, y + size);
        ctx.lineTo(x - size, y);
        ctx.closePath();
        ctx.fill();
        break;
        
      case 'spark':
      default:
        ctx.fillRect(x - size/2, y - size/2, size, size);
        break;
    }
  };

  const drawStar = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
    const spikes = 5;
    const outerRadius = size;
    const innerRadius = size * 0.4;
    
    ctx.beginPath();
    for (let i = 0; i < spikes * 2; i++) {
      const angle = (i * Math.PI) / spikes;
      const radius = i % 2 === 0 ? outerRadius : innerRadius;
      const px = x + Math.cos(angle) * radius;
      const py = y + Math.sin(angle) * radius;
      
      if (i === 0) {
        ctx.moveTo(px, py);
      } else {
        ctx.lineTo(px, py);
      }
    }
    ctx.closePath();
    ctx.fill();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{ width: '100%', height: '100%' }}
    />
  );
}

// Confetti Effect Component
interface ConfettiProps {
  active: boolean;
  onComplete?: () => void;
}

export function Confetti({ active, onComplete }: ConfettiProps) {
  return (
    <ParticleSystem
      trigger={active}
      count={50}
      duration={3000}
      colors={['#FFD700', '#FF6B35', '#F7931E', '#FFE135', '#FF1744', '#E91E63', '#9C27B0', '#673AB7']}
      size={{ min: 3, max: 8 }}
      velocity={{ min: 5, max: 15 }}
      gravity={0.2}
      onComplete={onComplete}
    />
  );
}

// XP Burst Effect
interface XPBurstProps {
  active: boolean;
  amount: number;
  onComplete?: () => void;
}

export function XPBurst({ active, amount, onComplete }: XPBurstProps) {
  const particleCount = Math.min(Math.max(amount / 10, 5), 30);
  
  return (
    <ParticleSystem
      trigger={active}
      count={particleCount}
      duration={1500}
      colors={['#FFD700', '#FFA000', '#FF8F00']}
      size={{ min: 2, max: 5 }}
      velocity={{ min: 3, max: 10 }}
      gravity={0.05}
      onComplete={onComplete}
    />
  );
}

// Level Up Effect
interface LevelUpEffectProps {
  active: boolean;
  onComplete?: () => void;
}

export function LevelUpEffect({ active, onComplete }: LevelUpEffectProps) {
  return (
    <div className="relative">
      <ParticleSystem
        trigger={active}
        count={40}
        duration={2500}
        colors={['#00E676', '#00C853', '#1DE9B6', '#00BCD4']}
        size={{ min: 4, max: 10 }}
        velocity={{ min: 8, max: 20 }}
        gravity={0.1}
        onComplete={onComplete}
      />
      
      {/* Ring expansion effect */}
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 3, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="absolute inset-0 border-4 border-green-400 rounded-full"
            style={{
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              width: '20px',
              height: '20px'
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// Achievement Unlock Effect
interface AchievementEffectProps {
  active: boolean;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  onComplete?: () => void;
}

export function AchievementEffect({ active, rarity, onComplete }: AchievementEffectProps) {
  const rarityColors = {
    common: ['#9E9E9E', '#757575'],
    rare: ['#2196F3', '#1976D2'],
    epic: ['#9C27B0', '#7B1FA2'],
    legendary: ['#FFD700', '#FF8F00', '#FF6F00']
  };

  const particleCount = {
    common: 15,
    rare: 25,
    epic: 35,
    legendary: 50
  };

  return (
    <div className="relative">
      <ParticleSystem
        trigger={active}
        count={particleCount[rarity]}
        duration={rarity === 'legendary' ? 4000 : 2500}
        colors={rarityColors[rarity]}
        size={{ min: 3, max: rarity === 'legendary' ? 12 : 8 }}
        velocity={{ min: 6, max: rarity === 'legendary' ? 25 : 18 }}
        gravity={0.08}
        onComplete={onComplete}
      />
      
      {/* Special effects for legendary */}
      {rarity === 'legendary' && (
        <AnimatePresence>
          {active && (
            <>
              {/* Golden rings */}
              {[0, 1, 2].map(i => (
                <motion.div
                  key={i}
                  initial={{ scale: 0, opacity: 1, rotate: 0 }}
                  animate={{ 
                    scale: [0, 2, 3], 
                    opacity: [1, 0.5, 0],
                    rotate: 360
                  }}
                  transition={{ 
                    duration: 2,
                    delay: i * 0.3,
                    ease: "easeOut"
                  }}
                  className="absolute inset-0 border-2 border-yellow-400 rounded-full"
                  style={{
                    left: '50%',
                    top: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '30px',
                    height: '30px'
                  }}
                />
              ))}
              
              {/* Sparkle overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0] }}
                transition={{ 
                  duration: 3,
                  repeat: 2,
                  ease: "easeInOut"
                }}
                className="absolute inset-0 bg-gradient-radial from-yellow-400/30 via-transparent to-transparent"
              />
            </>
          )}
        </AnimatePresence>
      )}
    </div>
  );
}

// Floating Text Effect
interface FloatingTextProps {
  text: string;
  active: boolean;
  color?: string;
  size?: 'sm' | 'md' | 'lg';
  onComplete?: () => void;
}

export function FloatingText({ 
  text, 
  active, 
  color = 'text-white', 
  size = 'md',
  onComplete 
}: FloatingTextProps) {
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-2xl'
  };

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          initial={{ opacity: 0, y: 0, scale: 0.5 }}
          animate={{ 
            opacity: [0, 1, 1, 0], 
            y: [0, -30, -60, -100],
            scale: [0.5, 1.2, 1, 0.8]
          }}
          exit={{ opacity: 0 }}
          transition={{ 
            duration: 2,
            times: [0, 0.2, 0.8, 1],
            ease: "easeOut"
          }}
          onAnimationComplete={onComplete}
          className={`absolute pointer-events-none z-50 font-bold ${color} ${sizeClasses[size]}`}
          style={{
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)'
          }}
        >
          {text}
        </motion.div>
      )}
    </AnimatePresence>
  );
}