'use client';

import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { AnimatedBackgroundProps } from './types';

export function AnimatedBackground({
  variant = 'particles',
  speed = 1,
  density = 50,
  colors = ['#3b82f6', '#8b5cf6', '#ef4444'],
  className,
  children,
  ...props
}: AnimatedBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (variant !== 'particles') return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      color: string;
    }> = [];

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    const createParticles = () => {
      particles.length = 0;
      for (let i = 0; i < density; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * speed,
          vy: (Math.random() - 0.5) * speed,
          size: Math.random() * 3 + 1,
          color: colors[Math.floor(Math.random() * colors.length)],
        });
      }
    };

    const updateParticles = () => {
      particles.forEach((particle) => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;
      });
    };

    const drawParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle) => {
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.globalAlpha = 0.6;
        ctx.fill();
      });
    };

    const animate = () => {
      updateParticles();
      drawParticles();
      requestAnimationFrame(animate);
    };

    resizeCanvas();
    createParticles();
    animate();

    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, [variant, speed, density, colors]);

  const GradientBackground = () => (
    <motion.div
      className="absolute inset-0"
      animate={{
        background: [
          `linear-gradient(45deg, ${colors[0]}, ${colors[1]})`,
          `linear-gradient(135deg, ${colors[1]}, ${colors[2] || colors[0]})`,
          `linear-gradient(225deg, ${colors[2] || colors[0]}, ${colors[0]})`,
          `linear-gradient(315deg, ${colors[0]}, ${colors[1]})`,
        ],
      }}
      transition={{
        duration: 10 / speed,
        repeat: Infinity,
      }}
    />
  );

  const WavesBackground = () => (
    <div className="absolute inset-0 overflow-hidden">
      {[0, 1, 2].map((index) => (
        <motion.div
          key={index}
          className="absolute inset-0"
          style={{
            background: `linear-gradient(45deg, ${colors[index % colors.length]}20, transparent)`,
          }}
          animate={{
            x: ['-100%', '100%'],
          }}
          transition={{
            duration: (20 - speed * 2) / speed,
            repeat: Infinity,
            delay: index * 2,
          }}
        />
      ))}
    </div>
  );

  const DotsBackground = () => (
    <div
      className="absolute inset-0"
      style={{
        backgroundImage: `radial-gradient(circle, ${colors[0]}40 1px, transparent 1px)`,
        backgroundSize: '20px 20px',
      }}
    >
      <motion.div
        className="absolute inset-0"
        animate={{
          backgroundPosition: ['0px 0px', '20px 20px'],
        }}
        transition={{
          duration: 10 / speed,
          repeat: Infinity,
        }}
        style={{
          backgroundImage: `radial-gradient(circle, ${colors[1] || colors[0]}20 1px, transparent 1px)`,
          backgroundSize: '20px 20px',
        }}
      />
    </div>
  );

  const renderBackground = () => {
    switch (variant) {
      case 'gradient':
        return <GradientBackground />;
      case 'waves':
        return <WavesBackground />;
      case 'dots':
        return <DotsBackground />;
      case 'particles':
        return (
          <canvas
            ref={canvasRef}
            className="pointer-events-none absolute inset-0"
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className={cn('relative', className)} {...props}>
      {renderBackground()}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
