'use client';

import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

// 光束扫描效果组件
interface BeamScanProps {
  className?: string;
  beamColor?: string;
  duration?: number;
  repeatDelay?: number;
}

/**
 * 光束扫描效果组件
 */
export function BeamScan({
  className,
  beamColor = 'hsl(var(--primary))',
  duration = 2,
  repeatDelay = 3,
}: BeamScanProps) {
  return (
    <div className={cn('relative overflow-hidden', className)}>
      <motion.div
        className="absolute inset-y-0 w-1 bg-gradient-to-b from-transparent via-current to-transparent opacity-60"
        style={{ color: beamColor }}
        initial={{ x: '-100%', opacity: 0 }}
        animate={{
          x: '100vw',
          opacity: [0, 1, 0],
        }}
        transition={{
          duration,
          ease: 'linear',
          repeat: Infinity,
          repeatDelay,
        }}
      />
    </div>
  );
}

// 脉冲发光效果组件
interface PulseGlowProps extends HTMLMotionProps<'div'> {
  glowColor?: string;
  intensity?: 'low' | 'medium' | 'high';
  speed?: 'slow' | 'normal' | 'fast';
  className?: string;
  children: React.ReactNode;
}

/**
 * 脉冲发光效果组件
 */
export function PulseGlow({
  glowColor = 'hsl(var(--primary))',
  intensity = 'medium',
  speed = 'normal',
  className,
  children,
  ...props
}: PulseGlowProps) {
  const intensityMap = {
    low: ['0 0 5px', '0 0 15px'],
    medium: ['0 0 5px', '0 0 20px, 0 0 30px'],
    high: ['0 0 10px', '0 0 30px, 0 0 50px, 0 0 70px'],
  };

  const speedMap = {
    slow: 3,
    normal: 2,
    fast: 1,
  };

  const shadows = intensityMap[intensity].map(
    (shadow) => `${shadow} ${glowColor}`
  );

  return (
    <motion.div
      className={cn('aceternity-pulse-glow', className)}
      animate={{
        boxShadow: shadows,
      }}
      transition={{
        duration: speedMap[speed],
        ease: 'easeInOut',
        repeat: Infinity,
        repeatType: 'reverse',
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

// 浮动效果组件
interface FloatingProps extends HTMLMotionProps<'div'> {
  amplitude?: number;
  duration?: number;
  className?: string;
  children: React.ReactNode;
}

/**
 * 浮动效果组件
 */
export function Floating({
  amplitude = 10,
  duration = 3,
  className,
  children,
  ...props
}: FloatingProps) {
  return (
    <motion.div
      className={cn('', className)}
      animate={{
        y: [-amplitude, amplitude, -amplitude],
      }}
      transition={{
        duration,
        ease: 'easeInOut',
        repeat: Infinity,
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

// 渐变移动背景组件
interface GradientShiftProps {
  className?: string;
  colors?: string[];
  direction?: 'horizontal' | 'vertical' | 'diagonal';
  speed?: 'slow' | 'normal' | 'fast';
}

/**
 * 渐变移动背景组件
 */
export function GradientShift({
  className,
  colors = [
    'hsl(var(--primary))',
    'hsl(var(--secondary))',
    'hsl(var(--accent))',
  ],
  direction = 'horizontal',
  speed = 'normal',
}: GradientShiftProps) {
  const directionMap = {
    horizontal: 'to right',
    vertical: 'to bottom',
    diagonal: 'to bottom right',
  };

  const speedMap = {
    slow: 6,
    normal: 4,
    fast: 2,
  };

  const gradientColors = colors.join(', ');

  return (
    <motion.div
      className={cn('aceternity-gradient-shift absolute inset-0', className)}
      style={{
        background: `linear-gradient(${directionMap[direction]}, ${gradientColors})`,
        backgroundSize: '200% 200%',
      }}
      animate={{
        backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
      }}
      transition={{
        duration: speedMap[speed],
        ease: 'linear',
        repeat: Infinity,
      }}
    />
  );
}

// 粒子效果组件
interface ParticleEffectProps {
  className?: string;
  particleCount?: number;
  particleColor?: string;
  particleSize?: number;
  speed?: number;
}

/**
 * 粒子效果组件
 */
export function ParticleEffect({
  className,
  particleCount = 50,
  particleSize = 2,
  speed = 20,
}: ParticleEffectProps) {
  const [particles, setParticles] = React.useState<
    Array<{
      id: number;
      x: number;
      y: number;
      vx: number;
      vy: number;
    }>
  >([]);

  React.useEffect(() => {
    const newParticles = Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      vx: (Math.random() - 0.5) * speed,
      vy: (Math.random() - 0.5) * speed,
    }));
    setParticles(newParticles);
  }, [particleCount, speed]);

  return (
    <div className={cn('aceternity-particles', className)}>
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="aceternity-particle absolute opacity-60"
          style={{
            width: particleSize,
            height: particleSize,
            left: `${particle.x}%`,
            top: `${particle.y}%`,
          }}
          animate={{
            x: [0, particle.vx, 0],
            y: [0, particle.vy, 0],
            opacity: [0.6, 0.2, 0.6],
          }}
          transition={{
            duration: 4 + Math.random() * 2,
            ease: 'linear',
            repeat: Infinity,
          }}
        />
      ))}
    </div>
  );
}

// 磁场效果组件
interface MagneticProps extends HTMLMotionProps<'div'> {
  strength?: number;
  className?: string;
  children: React.ReactNode;
}

/**
 * 磁场效果组件
 * 鼠标靠近时元素会被"吸引"
 */
export function Magnetic({
  strength = 0.3,
  className,
  children,
  ...props
}: MagneticProps) {
  const [mousePosition, setMousePosition] = React.useState({ x: 0, y: 0 });
  const elementRef = React.useRef<HTMLDivElement>(null);

  const handleMouseMove = (event: React.MouseEvent) => {
    if (!elementRef.current) return;

    const rect = elementRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = (event.clientX - centerX) * strength;
    const deltaY = (event.clientY - centerY) * strength;

    setMousePosition({ x: deltaX, y: deltaY });
  };

  const handleMouseLeave = () => {
    setMousePosition({ x: 0, y: 0 });
  };

  return (
    <motion.div
      ref={elementRef}
      className={cn('aceternity-magnetic', className)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{
        x: mousePosition.x,
        y: mousePosition.y,
      }}
      transition={{
        type: 'spring',
        stiffness: 200,
        damping: 20,
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

// 波纹扩散效果组件
interface RippleWaveProps {
  className?: string;
  waveColor?: string;
  waveCount?: number;
  duration?: number;
  trigger?: boolean;
}

/**
 * 波纹扩散效果组件
 */
export function RippleWave({
  className,
  waveColor = 'hsl(var(--primary))',
  waveCount = 3,
  duration = 2,
  trigger = true,
}: RippleWaveProps) {
  return (
    <div
      className={cn(
        'pointer-events-none absolute inset-0 flex items-center justify-center',
        className
      )}
    >
      {Array.from({ length: waveCount }, (_, i) => (
        <motion.div
          key={i}
          className="aceternity-ripple absolute rounded-full border-2 opacity-60"
          style={{ borderColor: waveColor }}
          initial={{ scale: 0, opacity: 0.6 }}
          animate={
            trigger
              ? {
                  scale: [0, 2, 4],
                  opacity: [0.6, 0.3, 0],
                }
              : {}
          }
          transition={{
            duration,
            ease: 'easeOut',
            repeat: Infinity,
            delay: i * 0.3,
          }}
        />
      ))}
    </div>
  );
}
