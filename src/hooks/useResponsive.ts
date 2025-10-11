'use client';

import React, { useState, useEffect } from 'react';

interface BreakpointConfig {
  sm: number;
  md: number;
  lg: number;
  xl: number;
  '2xl': number;
}

const defaultBreakpoints: BreakpointConfig = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
};

export function useResponsive(breakpoints: Partial<BreakpointConfig> = {}) {
  const bp = React.useMemo(
    () => ({ ...defaultBreakpoints, ...breakpoints }),
    [breakpoints]
  );

  const [windowSize, setWindowSize] = useState({
    width: 0,
    height: 0,
  });

  const [breakpoint, setBreakpoint] = useState<keyof BreakpointConfig>('sm');

  // 提取断点值以避免复杂表达式
  const bpSm = bp.sm;
  const bpMd = bp.md;
  const bpLg = bp.lg;
  const bpXl = bp.xl;
  const bp2xl = bp['2xl'];

  useEffect(() => {
    // 检查是否在浏览器环境
    if (typeof window === 'undefined') return;

    function handleResize() {
      const width = window.innerWidth;
      const height = window.innerHeight;

      setWindowSize({ width, height });

      // 确定当前断点
      if (width >= bp2xl) {
        setBreakpoint('2xl');
      } else if (width >= bpXl) {
        setBreakpoint('xl');
      } else if (width >= bpLg) {
        setBreakpoint('lg');
      } else if (width >= bpMd) {
        setBreakpoint('md');
      } else {
        setBreakpoint('sm');
      }
    }

    // 初始化
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [bpSm, bpMd, bpLg, bpXl, bp2xl]);

  return {
    windowSize,
    breakpoint,
    isMobile: windowSize.width < bp.md,
    isTablet: windowSize.width >= bp.md && windowSize.width < bp.lg,
    isDesktop: windowSize.width >= bp.lg,
    isSmall: windowSize.width < bp.sm,
    isMedium: windowSize.width >= bp.md && windowSize.width < bp.lg,
    isLarge: windowSize.width >= bp.lg && windowSize.width < bp.xl,
    isXLarge: windowSize.width >= bp.xl,
    is2XLarge: windowSize.width >= bp['2xl'],
  };
}

// 设备类型检测
export function useDeviceType() {
  const [deviceType, setDeviceType] = useState<'mobile' | 'tablet' | 'desktop'>(
    'desktop'
  );
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>(
    'landscape'
  );
  const [touchDevice, setTouchDevice] = useState(false);

  useEffect(() => {
    // 检查是否在浏览器环境
    if (typeof window === 'undefined') return;

    function detectDevice() {
      const width = window.innerWidth;
      const height = window.innerHeight;

      // 检测设备类型
      if (width < 768) {
        setDeviceType('mobile');
      } else if (width < 1024) {
        setDeviceType('tablet');
      } else {
        setDeviceType('desktop');
      }

      // 检测屏幕方向
      setOrientation(height > width ? 'portrait' : 'landscape');

      // 检测触摸设备
      setTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
    }

    detectDevice();
    window.addEventListener('resize', detectDevice);
    window.addEventListener('orientationchange', detectDevice);

    return () => {
      window.removeEventListener('resize', detectDevice);
      window.removeEventListener('orientationchange', detectDevice);
    };
  }, []);

  return {
    deviceType,
    orientation,
    touchDevice,
    isMobile: deviceType === 'mobile',
    isTablet: deviceType === 'tablet',
    isDesktop: deviceType === 'desktop',
    isPortrait: orientation === 'portrait',
    isLandscape: orientation === 'landscape',
  };
}

// 性能检测
export function usePerformance() {
  const [performanceLevel, setPerformanceLevel] = useState<'low' | 'medium' | 'high'>(
    'medium'
  );
  const [reducedMotion, setReducedMotion] = useState(false);

  // 简单的性能检测函数
  const detectPerformance = React.useCallback(() => {
    const connection = (navigator as any).connection;
    const memory = (window.performance as any).memory;

    let score = 0;

    // 网络连接质量
    if (connection) {
      if (connection.effectiveType === '4g') score += 2;
      else if (connection.effectiveType === '3g') score += 1;
    } else {
      score += 1; // 默认中等
    }

    // 内存情况
    if (memory) {
      if (memory.jsHeapSizeLimit > 1000000000)
        score += 2; // > 1GB
      else if (memory.jsHeapSizeLimit > 500000000) score += 1; // > 500MB
    } else {
      score += 1; // 默认中等
    }

    // 硬件并发
    if (navigator.hardwareConcurrency >= 8) score += 2;
    else if (navigator.hardwareConcurrency >= 4) score += 1;

    // 设备像素比
    if (window.devicePixelRatio <= 1) score += 1;
    else if (window.devicePixelRatio <= 2) score += 0;
    else score -= 1;

    // 根据分数确定性能等级
    let newLevel: 'low' | 'medium' | 'high';
    if (score >= 5) newLevel = 'high';
    else if (score >= 3) newLevel = 'medium';
    else newLevel = 'low';
    
    // 只在性能等级真正改变时才更新，避免不必要的重渲染
    setPerformanceLevel((prev) => {
      return prev !== newLevel ? newLevel : prev;
    });
  }, []);

  useEffect(() => {
    // 检查是否在浏览器环境
    if (typeof window === 'undefined') return;

    // 检测用户偏好
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    setReducedMotion(prefersReducedMotion);

    // 执行性能检测
    detectPerformance();
  }, [detectPerformance]);

  return {
    performance: performanceLevel,
    reducedMotion,
    shouldReduceAnimations: reducedMotion || performanceLevel === 'low',
    shouldOptimizeImages: performanceLevel === 'low',
    shouldLimitParticles: performanceLevel !== 'high',
  };
}

// 网络状态检测
export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(true);
  const [connectionType, setConnectionType] = useState<string>('unknown');
  const [effectiveType, setEffectiveType] = useState<string>('4g');

  useEffect(() => {
    // 检查是否在浏览器环境
    if (typeof window === 'undefined') return;

    function updateOnlineStatus() {
      setIsOnline(navigator.onLine);
    }

    function updateConnectionInfo() {
      const connection = (navigator as any).connection;
      if (connection) {
        setConnectionType(connection.type || 'unknown');
        setEffectiveType(connection.effectiveType || '4g');
      }
    }

    updateOnlineStatus();
    updateConnectionInfo();

    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);

    const connection = (navigator as any).connection;
    if (connection) {
      connection.addEventListener('change', updateConnectionInfo);
    }

    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
      if (connection) {
        connection.removeEventListener('change', updateConnectionInfo);
      }
    };
  }, []);

  return {
    isOnline,
    connectionType,
    effectiveType,
    isSlowConnection: effectiveType === 'slow-2g' || effectiveType === '2g',
    isFastConnection: effectiveType === '4g',
  };
}
