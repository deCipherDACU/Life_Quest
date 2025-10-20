'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface RadialProgressProps {
  value: number;
  max: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
  children?: React.ReactNode;
  gradient?: boolean;
  glow?: boolean;
  animated?: boolean;
  particles?: boolean;
  color?: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'danger' | 'rainbow';
}

export function RadialProgress({
  value,
  max,
  size = 120,
  strokeWidth = 8,
  className,
  children,
  gradient = true,
  glow = false,
  animated = true,
  particles = false,
  color = 'primary'
}: RadialProgressProps) {
  const percentage = Math.min((value / max) * 100, 100);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className={cn("relative", className)} style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        <defs>
          {gradient && color === 'rainbow' && (
            <linearGradient id="rainbow-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ef4444" />
              <stop offset="16.66%" stopColor="#f97316" />
              <stop offset="33.33%" stopColor="#eab308" />
              <stop offset="50%" stopColor="#22c55e" />
              <stop offset="66.66%" stopColor="#3b82f6" />
              <stop offset="83.33%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#ec4899" />
            </linearGradient>
          )}
          {gradient && color !== 'rainbow' && (
            <linearGradient id="progress-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(var(--primary))" />
              <stop offset="100%" stopColor="hsl(var(--accent))" />
            </linearGradient>
          )}
          {glow && (
            <filter id="glow">
              <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
              <feMerge> 
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          )}
          <filter id="pulse-glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Background Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="hsl(var(--muted))"
          strokeWidth={strokeWidth}
          fill="transparent"
          opacity={0.3}
        />
        
        {/* Progress Circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={
            gradient && color === 'rainbow' 
              ? "url(#rainbow-gradient)" 
              : gradient 
                ? "url(#progress-gradient)" 
                : "hsl(var(--primary))"
          }
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeLinecap="round"
          strokeDasharray={strokeDasharray}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ 
            duration: animated ? 2 : 0, 
            ease: [0.4, 0, 0.2, 1],
            type: "spring",
            stiffness: 100
          }}
          filter={glow ? "url(#glow)" : undefined}
        />
        
        {/* Animated pulse ring */}
        {animated && percentage > 0 && (
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="hsl(var(--primary))"
            strokeWidth="2"
            fill="transparent"
            opacity="0.3"
            filter="url(#pulse-glow)"
            animate={{
              r: [radius, radius + 5, radius],
              opacity: [0.3, 0.1, 0.3]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        )}
      </svg>
      
      {/* Center Content */}
      <div className="absolute inset-0 flex items-center justify-center">
        {children || (
          <div className="text-center">
            <div className="text-2xl font-bold">{Math.round(percentage)}%</div>
            <div className="text-xs text-muted-foreground">{value}/{max}</div>
          </div>
        )}
      </div>
    </div>
  );
}

interface Progress3DProps {
  value: number;
  max: number;
  className?: string;
  height?: number;
  animated?: boolean;
}

export function Progress3D({
  value,
  max,
  className,
  height = 24,
  animated = true
}: Progress3DProps) {
  const percentage = Math.min((value / max) * 100, 100);

  return (
    <div className={cn("relative overflow-hidden rounded-lg", className)} style={{ height }}>
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-muted/50 to-muted/30 rounded-lg" />
      
      {/* Progress Bar */}
      <motion.div
        className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary via-primary/90 to-accent rounded-lg"
        style={{
          background: `linear-gradient(135deg, 
            hsl(var(--primary)) 0%, 
            hsl(var(--primary)) 50%, 
            hsl(var(--accent)) 100%)`,
          boxShadow: `
            inset 0 1px 0 rgba(255,255,255,0.3),
            inset 0 -1px 0 rgba(0,0,0,0.2),
            0 2px 4px rgba(0,0,0,0.1)
          `
        }}
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={{ duration: animated ? 1 : 0, ease: "easeOut" }}
      />
      
      {/* Shine Effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
        style={{ width: '30%' }}
        animate={{ x: ['-100%', '400%'] }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatDelay: 3,
          ease: "easeInOut"
        }}
      />
      
      {/* Text Overlay */}
      <div className="absolute inset-0 flex items-center justify-center text-xs font-medium text-white mix-blend-difference">
        {value} / {max}
      </div>
    </div>
  );
}

interface SkillNodeProps {
  skill: {
    name: string;
    level: number;
    maxLevel: number;
    cost: number;
    description: string;
  };
  unlocked: boolean;
  canUpgrade: boolean;
  onUpgrade?: () => void;
  position: { x: number; y: number };
  connections?: Array<{ x: number; y: number }>;
}

export function SkillNode({
  skill,
  unlocked,
  canUpgrade,
  onUpgrade,
  position,
  connections = []
}: SkillNodeProps) {
  return (
    <div
      className="absolute"
      style={{ left: position.x, top: position.y, transform: 'translate(-50%, -50%)' }}
    >
      {/* Connection Lines */}
      {connections.map((connection, index) => {
        const dx = connection.x - position.x;
        const dy = connection.y - position.y;
        const length = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dy, dx) * (180 / Math.PI);
        
        return (
          <div
            key={index}
            className={cn(
              "absolute h-0.5 origin-left transition-all duration-500",
              unlocked ? "bg-primary/60" : "bg-muted/30"
            )}
            style={{
              width: length,
              transform: `rotate(${angle}deg)`,
              transformOrigin: '0 50%'
            }}
          />
        );
      })}
      
      {/* Skill Node */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={canUpgrade ? onUpgrade : undefined}
        className={cn(
          "relative w-16 h-16 rounded-full border-2 transition-all duration-300",
          "flex items-center justify-center group",
          unlocked
            ? "bg-gradient-to-br from-primary to-accent border-primary/50 shadow-lg shadow-primary/25"
            : "bg-muted/50 border-muted/30",
          canUpgrade && "ring-2 ring-primary/50 ring-offset-2 ring-offset-background",
          !unlocked && !canUpgrade && "opacity-50 cursor-not-allowed"
        )}
        disabled={!canUpgrade}
      >
        {/* Level Indicator */}
        <div className="text-sm font-bold text-white">
          {skill.level}
        </div>
        
        {/* Hover Tooltip */}
        <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
          <div className="bg-background/95 backdrop-blur-sm border rounded-lg p-3 shadow-xl min-w-48">
            <h4 className="font-semibold text-sm">{skill.name}</h4>
            <p className="text-xs text-muted-foreground mt-1">{skill.description}</p>
            <div className="flex items-center justify-between mt-2 text-xs">
              <span>Level {skill.level}/{skill.maxLevel}</span>
              {canUpgrade && <span className="text-primary">Cost: {skill.cost} SP</span>}
            </div>
          </div>
        </div>
      </motion.button>
    </div>
  );
}
// P
article Ring Effect for RadialProgress
function ParticleRing({ size, percentage }: { size: number; percentage: number }) {
  const particleCount = Math.floor(percentage / 10);
  const radius = size / 2 - 20;
  
  return (
    <div className="absolute inset-0 pointer-events-none">
      {Array.from({ length: particleCount }).map((_, i) => {
        const angle = (i / particleCount) * 360;
        const x = Math.cos(angle * Math.PI / 180) * radius;
        const y = Math.sin(angle * Math.PI / 180) * radius;
        
        return (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-primary rounded-full"
            style={{
              left: '50%',
              top: '50%',
              transform: `translate(-50%, -50%) translate(${x}px, ${y}px)`
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.1,
              ease: "easeInOut"
            }}
          />
        );
      })}
    </div>
  );
}

// XP Gain Animation Component
interface XPGainAnimationProps {
  amount: number;
  onComplete?: () => void;
  className?: string;
}

export function XPGainAnimation({ amount, onComplete, className }: XPGainAnimationProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 0, scale: 0.5 }}
      animate={{ 
        opacity: [0, 1, 1, 0], 
        y: [0, -50, -80, -120],
        scale: [0.5, 1.2, 1, 0.8]
      }}
      transition={{ 
        duration: 2.5,
        times: [0, 0.2, 0.8, 1],
        ease: "easeOut"
      }}
      onAnimationComplete={onComplete}
      className={cn("absolute pointer-events-none z-50", className)}
    >
      <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-full font-bold text-lg shadow-lg border border-yellow-300">
        +{amount} XP
      </div>
      
      {/* Particle burst */}
      <div className="absolute inset-0">
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i / 12) * 360;
          return (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-yellow-400 rounded-full"
              style={{
                left: '50%',
                top: '50%'
              }}
              animate={{
                x: Math.cos(angle * Math.PI / 180) * 40,
                y: Math.sin(angle * Math.PI / 180) * 40,
                opacity: [1, 0],
                scale: [1, 0]
              }}
              transition={{
                duration: 1.5,
                ease: "easeOut"
              }}
            />
          );
        })}
      </div>
    </motion.div>
  );
}

// Achievement Unlock Animation
interface AchievementUnlockProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  rarity?: 'common' | 'rare' | 'epic' | 'legendary';
  onComplete?: () => void;
}

export function AchievementUnlock({ 
  title, 
  description, 
  icon, 
  rarity = 'common',
  onComplete 
}: AchievementUnlockProps) {
  const rarityColors = {
    common: 'from-gray-400 to-gray-600',
    rare: 'from-blue-400 to-blue-600',
    epic: 'from-purple-400 to-purple-600',
    legendary: 'from-yellow-400 to-orange-500'
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5, y: 50 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, y: -50 }}
      transition={{ 
        duration: 0.6,
        type: "spring",
        stiffness: 200,
        damping: 20
      }}
      onAnimationComplete={onComplete}
      className="fixed top-4 right-4 z-50 max-w-sm"
    >
      <div className={cn(
        "bg-gradient-to-r text-white p-4 rounded-lg shadow-2xl border",
        rarityColors[rarity],
        "backdrop-blur-sm"
      )}>
        <div className="flex items-start gap-3">
          {icon && (
            <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center">
              {icon}
            </div>
          )}
          <div className="flex-1">
            <h3 className="font-bold text-lg">Achievement Unlocked!</h3>
            <h4 className="font-semibold">{title}</h4>
            <p className="text-sm opacity-90 mt-1">{description}</p>
          </div>
        </div>
        
        {/* Sparkle effects */}
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 8 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full"
              style={{
                left: `${20 + Math.random() * 60}%`,
                top: `${20 + Math.random() * 60}%`
              }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1.5, 0],
                rotate: [0, 180, 360]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// Micro-interaction Button Component
interface MicroInteractionButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'success' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  className?: string;
}

export function MicroInteractionButton({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  className
}: MicroInteractionButtonProps) {
  const variants = {
    primary: 'bg-primary hover:bg-primary/90 text-primary-foreground',
    secondary: 'bg-secondary hover:bg-secondary/90 text-secondary-foreground',
    success: 'bg-green-500 hover:bg-green-600 text-white',
    danger: 'bg-red-500 hover:bg-red-600 text-white'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ 
        scale: 0.95,
        boxShadow: "inset 0 2px 4px rgba(0,0,0,0.2)"
      }}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'relative overflow-hidden rounded-lg font-medium transition-all duration-200',
        'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary',
        variants[variant],
        sizes[size],
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
    >
      {/* Ripple effect */}
      <motion.div
        className="absolute inset-0 bg-white/20 rounded-full scale-0"
        whileTap={{ scale: 4, opacity: [0.3, 0] }}
        transition={{ duration: 0.3 }}
      />
      
      {/* Button content */}
      <span className="relative z-10">{children}</span>
      
      {/* Shine effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
        animate={{ x: ['-100%', '100%'] }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatDelay: 3,
          ease: "easeInOut"
        }}
      />
    </motion.button>
  );
}