'use client';

import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'frosted' | 'crystal' | 'neon' | 'aurora' | 'gaming';
  hover?: boolean;
  glow?: boolean;
  interactive?: boolean;
  particles?: boolean;
  gradient?: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'danger';
}

const gradientClasses = {
  primary: 'from-primary/20 via-primary/10 to-transparent',
  secondary: 'from-secondary/20 via-secondary/10 to-transparent',
  accent: 'from-accent/20 via-accent/10 to-transparent',
  success: 'from-green-500/20 via-green-500/10 to-transparent',
  warning: 'from-yellow-500/20 via-yellow-500/10 to-transparent',
  danger: 'from-red-500/20 via-red-500/10 to-transparent',
};

const variantClasses = {
  default: "bg-background/40 backdrop-blur-xl border-white/20",
  frosted: "bg-white/5 backdrop-blur-2xl border-white/10 shadow-2xl",
  crystal: "bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-lg border-white/30",
  neon: "bg-gradient-to-br from-purple-500/20 to-blue-500/20 backdrop-blur-md border-purple-500/30",
  aurora: "bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-blue-500/10 backdrop-blur-xl border-gradient-to-r from-purple-500/50 to-blue-500/50",
  gaming: "bg-gradient-to-br from-emerald-500/15 via-blue-500/15 to-purple-500/15 backdrop-blur-lg border-emerald-500/30"
};

export function GlassCard({ 
  children, 
  className, 
  variant = 'default',
  hover = true, 
  glow = false,
  interactive = true,
  particles = false,
  gradient = 'primary'
}: GlassCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      whileHover={hover ? { 
        y: -4, 
        scale: 1.02,
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1)"
      } : undefined}
      whileTap={interactive ? { scale: 0.98 } : undefined}
      transition={{ 
        duration: 0.3, 
        ease: [0.4, 0, 0.2, 1],
        type: "spring",
        stiffness: 300,
        damping: 30
      }}
      className={cn(
        // Base glass effect
        "relative overflow-hidden rounded-xl border",
        variantClasses[variant],
        // Gradient overlay
        "before:absolute before:inset-0 before:rounded-xl before:bg-gradient-to-br",
        `before:${gradientClasses[gradient]}`,
        "before:opacity-60 before:pointer-events-none",
        // Glow effect
        glow && "shadow-2xl shadow-primary/25 drop-shadow-2xl",
        // Hover effects
        hover && "hover:shadow-2xl hover:border-white/30 transition-all duration-300",
        className
      )}
    >
      {/* Enhanced background effects */}
      <div className="absolute inset-0">
        {/* Shimmer effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          initial={{ x: '-100%' }}
          animate={{ x: '100%' }}
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatDelay: 5,
            ease: "easeInOut"
          }}
        />
        
        {/* Noise texture overlay */}
        <div 
          className="absolute inset-0 opacity-[0.015] mix-blend-overlay"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
          }}
        />
      </div>

      {/* Particles effect */}
      {particles && <ParticleEffect />}
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>

      {/* Interactive border glow */}
      {interactive && (
        <motion.div
          className="absolute inset-0 rounded-xl border border-white/0"
          whileHover={{
            borderColor: "rgba(255, 255, 255, 0.3)",
            boxShadow: "inset 0 0 20px rgba(255, 255, 255, 0.1)"
          }}
          transition={{ duration: 0.3 }}
        />
      )}
    </motion.div>
  );
}

// Particle Effect Component
function ParticleEffect() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      life: number;
      maxLife: number;
    }> = [];

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const createParticle = () => {
      particles.push({
        x: Math.random() * canvas.width,
        y: canvas.height + 10,
        vx: (Math.random() - 0.5) * 0.5,
        vy: -Math.random() * 2 - 0.5,
        life: 0,
        maxLife: Math.random() * 100 + 50
      });
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Create new particles occasionally
      if (Math.random() < 0.02) {
        createParticle();
      }

      // Update and draw particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const particle = particles[i];
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.life++;

        const alpha = 1 - (particle.life / particle.maxLife);
        
        if (particle.life >= particle.maxLife || particle.y < -10) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = alpha * 0.3;
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, 1, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ width: '100%', height: '100%' }}
    />
  );
}

// Enhanced Animated Background Component
interface AnimatedBackgroundProps {
  variant?: 'particles' | 'waves' | 'gradient' | 'aurora' | 'matrix' | 'constellation';
  intensity?: 'low' | 'medium' | 'high';
  className?: string;
}

export function AnimatedBackground({ 
  variant = 'gradient', 
  intensity = 'medium',
  className 
}: AnimatedBackgroundProps = {}) {
  const intensityClasses = {
    low: "opacity-20",
    medium: "opacity-40", 
    high: "opacity-60"
  };

  if (variant === 'gradient') {
    return (
      <div className={cn("fixed inset-0 -z-10 overflow-hidden", className)}>
        {/* Enhanced Gradient Orbs */}
        <motion.div
          animate={{
            x: [0, 100, -50, 0],
            y: [0, -50, 30, 0],
            scale: [1, 1.2, 0.8, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className={cn(
            "absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-primary/30 to-accent/30 rounded-full blur-3xl",
            intensityClasses[intensity]
          )}
        />
        
        <motion.div
          animate={{
            x: [0, -80, 60, 0],
            y: [0, 60, -40, 0],
            scale: [1, 0.8, 1.3, 1],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className={cn(
            "absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-accent/20 to-secondary/20 rounded-full blur-3xl",
            intensityClasses[intensity]
          )}
        />

        <motion.div
          animate={{
            x: [0, 120, -80, 0],
            y: [0, -80, 50, 0],
            scale: [1, 1.1, 0.9, 1],
          }}
          transition={{
            duration: 35,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className={cn(
            "absolute top-1/2 right-1/3 w-72 h-72 bg-gradient-to-r from-purple-500/25 to-pink-500/25 rounded-full blur-3xl",
            intensityClasses[intensity]
          )}
        />

        {/* Dynamic gradient overlay */}
        <motion.div
          className={cn(
            "absolute inset-0",
            intensityClasses[intensity]
          )}
          animate={{
            background: [
              "radial-gradient(circle at 20% 50%, rgba(147, 51, 234, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(37, 99, 235, 0.3) 0%, transparent 50%), radial-gradient(circle at 40% 80%, rgba(16, 185, 129, 0.3) 0%, transparent 50%)",
              "radial-gradient(circle at 80% 50%, rgba(37, 99, 235, 0.3) 0%, transparent 50%), radial-gradient(circle at 20% 20%, rgba(16, 185, 129, 0.3) 0%, transparent 50%), radial-gradient(circle at 60% 80%, rgba(147, 51, 234, 0.3) 0%, transparent 50%)",
              "radial-gradient(circle at 40% 50%, rgba(16, 185, 129, 0.3) 0%, transparent 50%), radial-gradient(circle at 60% 20%, rgba(147, 51, 234, 0.3) 0%, transparent 50%), radial-gradient(circle at 20% 80%, rgba(37, 99, 235, 0.3) 0%, transparent 50%)",
              "radial-gradient(circle at 20% 50%, rgba(147, 51, 234, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(37, 99, 235, 0.3) 0%, transparent 50%), radial-gradient(circle at 40% 80%, rgba(16, 185, 129, 0.3) 0%, transparent 50%)"
            ]
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>
    );
  }

  if (variant === 'aurora') {
    return (
      <div className={cn("fixed inset-0 -z-10 overflow-hidden", className)}>
        <motion.div
          className={cn(
            "absolute inset-0",
            intensityClasses[intensity]
          )}
          animate={{
            background: [
              "linear-gradient(45deg, rgba(147, 51, 234, 0.3), rgba(236, 72, 153, 0.2), rgba(37, 99, 235, 0.3))",
              "linear-gradient(90deg, rgba(236, 72, 153, 0.3), rgba(37, 99, 235, 0.2), rgba(16, 185, 129, 0.3))",
              "linear-gradient(135deg, rgba(37, 99, 235, 0.3), rgba(16, 185, 129, 0.2), rgba(147, 51, 234, 0.3))",
              "linear-gradient(180deg, rgba(16, 185, 129, 0.3), rgba(147, 51, 234, 0.2), rgba(236, 72, 153, 0.3))",
              "linear-gradient(45deg, rgba(147, 51, 234, 0.3), rgba(236, 72, 153, 0.2), rgba(37, 99, 235, 0.3))"
            ]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* Aurora waves */}
        <motion.div
          className="absolute inset-0"
          animate={{
            background: [
              "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(147, 51, 234, 0.4) 0%, transparent 60%)",
              "radial-gradient(ellipse 60% 40% at 30% 0%, rgba(236, 72, 153, 0.4) 0%, transparent 60%)",
              "radial-gradient(ellipse 70% 45% at 70% 0%, rgba(37, 99, 235, 0.4) 0%, transparent 60%)",
              "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(147, 51, 234, 0.4) 0%, transparent 60%)"
            ]
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>
    );
  }

  if (variant === 'constellation') {
    return (
      <div className={cn("fixed inset-0 -z-10 overflow-hidden", className)}>
        {/* Stars */}
        <div className="absolute inset-0">
          {Array.from({ length: 100 }).map((_, i) => (
            <motion.div
              key={i}
              animate={{
                opacity: [0.2, 1, 0.2],
                scale: [0.5, 1.2, 0.5],
              }}
              transition={{
                duration: 2 + Math.random() * 3,
                repeat: Infinity,
                delay: Math.random() * 5,
                ease: "easeInOut"
              }}
              className="absolute w-1 h-1 bg-white rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
            />
          ))}
        </div>
        
        {/* Connecting lines */}
        <svg className="absolute inset-0 w-full h-full">
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.line
              key={i}
              x1={`${Math.random() * 100}%`}
              y1={`${Math.random() * 100}%`}
              x2={`${Math.random() * 100}%`}
              y2={`${Math.random() * 100}%`}
              stroke="rgba(255, 255, 255, 0.1)"
              strokeWidth="0.5"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.3 }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                repeatType: "reverse",
                delay: Math.random() * 3
              }}
            />
          ))}
        </svg>
      </div>
    );
  }

  // Default particle field
  return (
    <div className={cn("fixed inset-0 -z-10 overflow-hidden", className)}>
      <div className="absolute inset-0">
        {Array.from({ length: 80 }).map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -30, 0],
              x: [0, Math.random() * 20 - 10, 0],
              opacity: [0.2, 0.8, 0.2],
              scale: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 4 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 3,
              ease: "easeInOut"
            }}
            className={cn(
              "absolute w-1 h-1 bg-primary/40 rounded-full",
              intensityClasses[intensity]
            )}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>
    </div>
  );
}