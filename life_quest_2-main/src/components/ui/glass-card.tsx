'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
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

export function GlassCard({ 
  children, 
  className, 
  hover = true, 
  glow = false,
  gradient = 'primary'
}: GlassCardProps) {
  return (
    <motion.div
      whileHover={hover ? { y: -2, scale: 1.02 } : undefined}
      transition={{ duration: 0.2 }}
      className={cn(
        // Base glass effect
        "relative backdrop-blur-xl bg-background/40 border border-white/20",
        "rounded-xl shadow-xl",
        // Gradient overlay
        "before:absolute before:inset-0 before:rounded-xl before:bg-gradient-to-br",
        `before:${gradientClasses[gradient]}`,
        "before:opacity-50 before:pointer-events-none",
        // Glow effect
        glow && "shadow-2xl shadow-primary/25",
        // Hover effects
        hover && "hover:shadow-2xl hover:border-white/30 transition-all duration-300",
        className
      )}
    >
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
}

// Animated Background Component
export function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Gradient Orbs */}
      <motion.div
        animate={{
          x: [0, 100, 0],
          y: [0, -50, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-primary/30 to-accent/30 rounded-full blur-3xl"
      />
      
      <motion.div
        animate={{
          x: [0, -80, 0],
          y: [0, 60, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-accent/20 to-secondary/20 rounded-full blur-3xl"
      />

      {/* Particle Field */}
      <div className="absolute inset-0">
        {Array.from({ length: 50 }).map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
            className="absolute w-1 h-1 bg-primary/40 rounded-full"
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