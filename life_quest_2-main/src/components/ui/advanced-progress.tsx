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
}

export function RadialProgress({
  value,
  max,
  size = 120,
  strokeWidth = 8,
  className,
  children,
  gradient = true,
  glow = false
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
          {gradient && (
            <linearGradient id="progress-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(var(--primary))" />
              <stop offset="100%" stopColor="hsl(var(--accent))" />
            </linearGradient>
          )}
          {glow && (
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge> 
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          )}
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
          stroke={gradient ? "url(#progress-gradient)" : "hsl(var(--primary))"}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeLinecap="round"
          strokeDasharray={strokeDasharray}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1, ease: "easeOut" }}
          filter={glow ? "url(#glow)" : undefined}
        />
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