'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { reactBitUtils } from './utils';
import type { AnimatedTextProps } from './types';

export function AnimatedText({
  children,
  variant = 'default',
  animation = 'fadeIn',
  speed = 50,
  delay = 0,
  stagger = 0.05,
  gradient = ['#3b82f6', '#8b5cf6', '#ef4444'],
  className,
  onComplete,
  ...props
}: AnimatedTextProps) {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const text = typeof children === 'string' ? children : '';

  // 打字机效果
  useEffect(() => {
    if (variant === 'typewriter' && text) {
      if (currentIndex < text.length) {
        const timeout = setTimeout(
          () => {
            setDisplayText((prev) => prev + text[currentIndex]);
            setCurrentIndex((prev) => prev + 1);
          },
          currentIndex === 0 ? delay : speed
        );

        return () => clearTimeout(timeout);
      } else if (onComplete) {
        onComplete();
      }
    }
  }, [currentIndex, text, speed, delay, variant, onComplete]);

  const getVariantStyles = () => {
    switch (variant) {
      case 'gradient':
        return {
          background: `linear-gradient(45deg, ${gradient.join(', ')})`,
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          color: 'transparent',
          backgroundSize: '200% 200%',
        };
      case 'glow':
        return {
          textShadow: `0 0 10px ${gradient[0]}, 0 0 20px ${gradient[0]}, 0 0 30px ${gradient[0]}`,
        };
      default:
        return {};
    }
  };

  const getAnimationProps = () => {
    if (!reactBitUtils.shouldAnimate()) return {};

    switch (animation) {
      case 'fadeIn':
        return reactBitUtils.getPreset('fadeIn');
      case 'slideUp':
        return reactBitUtils.getPreset('slideUp');
      case 'slideDown':
        return reactBitUtils.getPreset('slideDown');
      case 'slideLeft':
        return reactBitUtils.getPreset('slideLeft');
      case 'slideRight':
        return reactBitUtils.getPreset('slideRight');
      case 'scale':
        return reactBitUtils.getPreset('scale');
      case 'rotate':
        return reactBitUtils.getPreset('rotate');
      case 'bounce':
        return reactBitUtils.getPreset('bounce');
      default:
        return {};
    }
  };

  // 渐变动画
  const gradientAnimation =
    variant === 'gradient'
      ? {
          backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
          transition: {
            duration: 3,
            repeat: Infinity,
          },
        }
      : {};

  // 发光动画
  const glowAnimation =
    variant === 'glow'
      ? {
          textShadow: [
            `0 0 10px ${gradient[0]}`,
            `0 0 20px ${gradient[0]}, 0 0 30px ${gradient[0]}`,
            `0 0 10px ${gradient[0]}`,
          ],
          transition: {
            duration: 2,
            repeat: Infinity,
          },
        }
      : {};

  // 分割文字动画
  if (variant === 'split' && typeof children === 'string') {
    const letters = children.split('');

    return (
      <motion.span
        className={cn('inline-block', className)}
        initial="hidden"
        animate="visible"
        transition={{ staggerChildren: stagger }}
        style={getVariantStyles()}
        {...props}
      >
        {letters.map((letter, index) => (
          <motion.span
            key={index}
            variants={getAnimationProps()}
            transition={{ duration: 0.5 }}
            className="inline-block"
            style={letter === ' ' ? { width: '0.25em' } : {}}
          >
            {letter === ' ' ? '\u00A0' : letter}
          </motion.span>
        ))}
      </motion.span>
    );
  }

  // 打字机效果
  if (variant === 'typewriter') {
    return (
      <motion.span
        className={cn('inline-block', className)}
        style={getVariantStyles()}
        {...props}
      >
        {displayText}
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
          className="ml-1 inline-block h-5 w-0.5 bg-current"
        />
      </motion.span>
    );
  }

  // 默认动画
  return (
    <motion.span
      className={cn('inline-block', className)}
      style={getVariantStyles()}
      animate={{
        ...gradientAnimation,
        ...glowAnimation,
      }}
      {...getAnimationProps()}
      {...props}
    >
      {children}
    </motion.span>
  );
}
