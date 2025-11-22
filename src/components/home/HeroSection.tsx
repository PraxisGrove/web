'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { HoverBorderGradient } from '@/components/ui/hover-border-gradient';
import { Sparkles } from 'lucide-react';
import { usePerformanceConfig } from '@/components/ui/PerformanceOptimizer';
import { GridScan, Shuffle, SplitText } from '@/components/reactbit';
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
          <div className="mb-8 flex w-full flex-col items-center justify-center gap-4">
            <div className="relative">
              <Shuffle
                text="PraxisGrove"
                className="text-5xl font-black tracking-tight text-white md:text-7xl lg:text-8xl"
                shuffleDirection="right"
                duration={0.35}
                animationMode="evenodd"
                shuffleTimes={1}
                ease="power3.out"
                stagger={0.03}
                threshold={0.1}
                triggerOnce={true}
                triggerOnHover={true}
                respectReducedMotion={true}
              />
            </div>
            <div className="relative mt-2">
              <SplitText
                text="A Permissionless School"
                className="text-2xl font-medium tracking-wide text-gray-200 md:text-3xl lg:text-4xl"
                delay={100}
                duration={0.6}
                ease="power3.out"
                splitType="chars"
                from={{ opacity: 0, y: 40 }}
                to={{ opacity: 1, y: 0 }}
                threshold={0.1}
                rootMargin="-100px"
                textAlign="center"
              />
            </div>
          </div>
        </motion.div>

        {/* 副标题 */}
        <motion.p
          variants={itemVariants}
          transition={itemTransition}
          className="mx-auto mb-10 max-w-2xl text-base leading-relaxed text-gray-400 md:text-lg"
        >
          Empowering personalized learning through AI and blockchain technology.
          Explore infinite possibilities of knowledge and unlock a new era of
          intelligent learning.
        </motion.p>

        {/* CTA 按钮组 */}
        <motion.div
          variants={itemVariants}
          transition={itemTransition}
          className="mb-12 flex justify-center"
        >
          <HoverBorderGradient
            containerClassName="rounded-full"
            as="button"
            className="flex items-center space-x-2 bg-white/5 px-8 py-3 text-white backdrop-blur-sm transition-colors hover:bg-white/10"
          >
            <Sparkles className="h-5 w-5" />
            <span className="text-lg font-semibold">Start Learning</span>
          </HoverBorderGradient>
        </motion.div>
      </motion.div>
    </div>
  );
}
