'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  usePerformance,
  useDeviceType,
  useNetworkStatus,
} from '@/hooks/useResponsive';

interface PerformanceConfig {
  enableAnimations: boolean;
  particleCount: number;
  imageQuality: number;
  enableParallax: boolean;
  enableBlur: boolean;
  enableShadows: boolean;
  animationDuration: number;
  enableAutoplay: boolean;
}

interface PerformanceContextType {
  config: PerformanceConfig;
  updateConfig: (updates: Partial<PerformanceConfig>) => void;
  isLowPerformance: boolean;
  shouldReduceMotion: boolean;
}

const PerformanceContext = createContext<PerformanceContextType | undefined>(
  undefined
);

export function usePerformanceConfig() {
  const context = useContext(PerformanceContext);
  if (!context) {
    throw new Error(
      'usePerformanceConfig must be used within a PerformanceProvider'
    );
  }
  return context;
}

interface PerformanceProviderProps {
  children: React.ReactNode;
  defaultConfig?: Partial<PerformanceConfig>;
}

export function PerformanceProvider({
  children,
  defaultConfig = {},
}: PerformanceProviderProps) {
  const { performance, reducedMotion } = usePerformance();
  const { isMobile } = useDeviceType();
  const { isSlowConnection } = useNetworkStatus();

  // 稳定 defaultConfig 以避免无限循环
  const stableDefaultConfig = React.useMemo(
    () => defaultConfig,
    [defaultConfig]
  );

  const getOptimalConfig = React.useCallback((): PerformanceConfig => {
    const baseConfig: PerformanceConfig = {
      enableAnimations: true,
      particleCount: 50,
      imageQuality: 75,
      enableParallax: true,
      enableBlur: true,
      enableShadows: true,
      animationDuration: 0.6,
      enableAutoplay: true,
    };

    // 根据性能等级调整配置
    if (performance === 'low' || reducedMotion || isSlowConnection) {
      return {
        ...baseConfig,
        enableAnimations: !reducedMotion,
        particleCount: 10,
        imageQuality: 50,
        enableParallax: false,
        enableBlur: false,
        enableShadows: false,
        animationDuration: 0.3,
        enableAutoplay: false,
      };
    }

    if (performance === 'medium' || isMobile) {
      return {
        ...baseConfig,
        particleCount: 25,
        imageQuality: 65,
        enableParallax: !isMobile,
        animationDuration: 0.4,
      };
    }

    return { ...baseConfig, ...stableDefaultConfig };
  }, [
    performance,
    reducedMotion,
    isMobile,
    isSlowConnection,
    stableDefaultConfig,
  ]);

  const [config, setConfig] = useState<PerformanceConfig>(() => {
    const baseConfig: PerformanceConfig = {
      enableAnimations: true,
      particleCount: 50,
      imageQuality: 75,
      enableParallax: true,
      enableBlur: true,
      enableShadows: true,
      animationDuration: 0.6,
      enableAutoplay: true,
    };

    return { ...baseConfig, ...stableDefaultConfig };
  });

  // 在性能检测完成后更新配置
  useEffect(() => {
    const newConfig = getOptimalConfig();

    // 只在配置真正改变时才更新，避免无限循环
    setConfig((prevConfig) => {
      const hasChanged =
        JSON.stringify(prevConfig) !== JSON.stringify(newConfig);
      return hasChanged ? newConfig : prevConfig;
    });
  }, [getOptimalConfig]);

  const updateConfig = React.useCallback(
    (updates: Partial<PerformanceConfig>) => {
      setConfig((prev) => ({ ...prev, ...updates }));
    },
    []
  );

  const value = React.useMemo(
    () => ({
      config,
      updateConfig,
      isLowPerformance: performance === 'low',
      shouldReduceMotion: reducedMotion,
    }),
    [config, updateConfig, performance, reducedMotion]
  );

  return (
    <PerformanceContext.Provider value={value}>
      {children}
    </PerformanceContext.Provider>
  );
}

// 性能监控组件
export function PerformanceMonitor() {
  const [metrics, setMetrics] = useState({
    fps: 0,
    memory: 0,
    loadTime: 0,
  });

  useEffect(() => {
    // 检查是否在浏览器环境
    if (typeof window === 'undefined' || typeof performance === 'undefined')
      return;

    let frameCount = 0;
    let lastTime = performance.now();
    let animationId: number;

    const measureFPS = () => {
      frameCount++;
      const currentTime = performance.now();

      if (currentTime >= lastTime + 1000) {
        const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
        setMetrics((prev) => ({ ...prev, fps }));
        frameCount = 0;
        lastTime = currentTime;
      }

      animationId = requestAnimationFrame(measureFPS);
    };

    const measureMemory = () => {
      if ('memory' in performance) {
        const memory = Math.round(
          (performance as any).memory.usedJSHeapSize / 1048576
        );
        setMetrics((prev) => ({ ...prev, memory }));
      }
    };

    const measureLoadTime = () => {
      if (performance.timing) {
        const loadTime =
          performance.timing.loadEventEnd - performance.timing.navigationStart;
        setMetrics((prev) => ({ ...prev, loadTime }));
      }
    };

    measureFPS();
    measureMemory();
    measureLoadTime();

    const memoryInterval = setInterval(measureMemory, 5000);

    return () => {
      cancelAnimationFrame(animationId);
      clearInterval(memoryInterval);
    };
  }, []);

  // 仅在开发环境显示
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 z-50 rounded bg-black/80 p-2 font-mono text-xs text-white">
      <div>FPS: {metrics.fps}</div>
      <div>Memory: {metrics.memory}MB</div>
      <div>Load: {metrics.loadTime}ms</div>
    </div>
  );
}

// 条件渲染组件
export function ConditionalRender({
  condition,
  fallback,
  children,
}: {
  condition: keyof PerformanceConfig | ((config: PerformanceConfig) => boolean);
  fallback?: React.ReactNode;
  children: React.ReactNode;
}) {
  const { config } = usePerformanceConfig();

  const shouldRender =
    typeof condition === 'function' ? condition(config) : config[condition];

  return shouldRender ? <>{children}</> : <>{fallback}</>;
}

// 自适应粒子组件
export function AdaptiveParticles({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const { config, isLowPerformance } = usePerformanceConfig();
  // 动态导入粒子组件以避免不必要的加载
  const [ParticleComponent, setParticleComponent] =
    useState<React.ComponentType<any> | null>(null);

  // 稳定配置值以避免无限循环
  const shouldEnableAnimations = React.useMemo(
    () => config.enableAnimations,
    [config.enableAnimations]
  );
  const particleCount = React.useMemo(
    () => config.particleCount,
    [config.particleCount]
  );

  useEffect(() => {
    if (shouldEnableAnimations && particleCount > 0) {
      import('@/components/ui/ParticleBackground').then((module) => {
        setParticleComponent(() => module.ParticleBackground);
      });
    }
  }, [shouldEnableAnimations, particleCount]);

  if (!config.enableAnimations || config.particleCount === 0) {
    return <div className={className}>{children}</div>;
  }

  if (!ParticleComponent) {
    return <div className={className}>{children}</div>;
  }

  return (
    <ParticleComponent
      className={className}
      particleCount={config.particleCount}
      interactive={!isLowPerformance}
    >
      {children}
    </ParticleComponent>
  );
}

// 自适应动画包装器
export function AdaptiveMotion({
  children,
  animation = 'fade',
  duration,
  ...props
}: {
  children: React.ReactNode;
  animation?: 'fade' | 'slide' | 'scale' | 'none';
  duration?: number;
  [key: string]: any;
}) {
  const { config } = usePerformanceConfig();

  const variants = React.useMemo(
    () => ({
      fade: {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
      },
      slide: {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
      },
      scale: {
        hidden: { opacity: 0, scale: 0.8 },
        visible: { opacity: 1, scale: 1 },
      },
    }),
    []
  );

  const selectedVariants = React.useMemo(
    () =>
      animation !== 'none'
        ? variants[animation as keyof typeof variants]
        : undefined,
    [animation, variants]
  );

  const transition = React.useMemo(
    () => ({
      duration: duration || config.animationDuration,
      ease: 'easeOut' as const,
    }),
    [duration, config.animationDuration]
  );

  if (!config.enableAnimations) {
    return <div {...props}>{children}</div>;
  }

  return (
    <motion.div
      variants={selectedVariants}
      initial="hidden"
      animate="visible"
      transition={transition}
      {...props}
    >
      {children}
    </motion.div>
  );
}
