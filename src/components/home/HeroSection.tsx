'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { TextGenerateEffect, AnimatedText } from '@/components/ui/AnimatedText';
import { usePerformanceConfig } from '@/components/ui/PerformanceOptimizer';
import { GridScan } from '@/components/reactbit';
import { cn } from '@/lib/utils';

interface HeroSectionProps {
  className?: string;
}

export function HeroSection({ className }: HeroSectionProps) {
  const { config } = usePerformanceConfig();

  const heroVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
    },
  };

  const heroTransition = {
    duration: config.animationDuration * 1.3,
    ease: [0.25, 0.46, 0.45, 0.94] as const,
    staggerChildren: 0.2,
  };

  const itemTransition = {
    duration: config.animationDuration,
    ease: [0.25, 0.46, 0.45, 0.94] as const,
  };

  return (
    <div
      className={cn(
        'relative flex min-h-screen items-center justify-center overflow-hidden',
        className
      )}
    >
      <div className="absolute inset-0 z-0">
        <GridScan
          sensitivity={0.55}
          lineThickness={1}
          linesColor="#2a2a4a"
          gridScale={0.1}
          colors={[
            '#6366f1', // Advanced Blue (Indigo)
            '#ef4444', // Advanced Red
            '#FFE600', // Bright Yellow
          ]}
          scanOpacity={0.5}
          enablePost
          bloomIntensity={0.6}
          chromaticAberration={0.002}
          noiseIntensity={0.01}
        />
      </div>

      {/* 主要内容 */}
      <motion.div
        className="container relative z-10 mx-auto px-4 py-16 text-center"
        variants={heroVariants}
        initial="hidden"
        animate="visible"
        transition={heroTransition}
      >
        {/* 主标题 - 使用 TextGenerateEffect */}
        <motion.div
          variants={itemVariants}
          transition={itemTransition}
          className="mb-6"
        >
          <h1 id="hero-title" className="sr-only">
            PraxisGrove
          </h1>
          <TextGenerateEffect
            text="PraxisGrove"
            className="mb-4 text-4xl font-bold text-white md:text-6xl lg:text-7xl"
          />
          <AnimatedText
            text="一所无需许可的学校"
            variant="typewriter"
            className="text-2xl font-light text-indigo-400 md:text-4xl lg:text-5xl"
            speed={100}
            delay={1000}
          />
        </motion.div>

        {/* 副标题 */}
        <motion.p
          variants={itemVariants}
          transition={itemTransition}
          className="mx-auto mb-8 max-w-3xl text-lg leading-relaxed text-gray-300 md:text-xl"
        >
          通过人工智能和区块链技术，为您提供个性化学习体验。
          探索知识的无限可能，开启智慧学习新时代。
        </motion.p>

        {/* CTA 按钮组 */}
        <motion.div
          variants={itemVariants}
          transition={itemTransition}
          className="mb-12 flex flex-col justify-center gap-4 sm:flex-row"
        >
          <Button
            size="lg"
            className={cn(
              'px-8 py-4 text-lg font-semibold',
              'bg-primary text-primary-foreground',
              'hover:bg-primary/90',
              'transform transition-all duration-200 hover:scale-105'
            )}
          >
            开始学习之旅
          </Button>
          <Button
            variant="outline"
            size="lg"
            className={cn(
              'px-8 py-4 text-lg font-semibold',
              'border-secondary text-secondary',
              'hover:bg-secondary/10 hover:border-secondary/80',
              'transform transition-all duration-200 hover:scale-105'
            )}
          >
            探索知识宇宙
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}
