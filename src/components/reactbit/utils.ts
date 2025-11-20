/**
 * ReactBit UI 工具函数
 * 提供动画、主题和性能相关的实用工具
 */

import { reactBitConfig, getCurrentAnimationConfig } from './config';
import type { ReactBitTheme } from './config';

// 动画工具函数
export const reactBitUtils = {
  // 检查是否应该启用动画
  shouldAnimate(): boolean {
    const config = getCurrentAnimationConfig();
    return (
      config.enabled && !config.reducedMotion && !config.prefersReducedMotion
    );
  },

  // 获取动画持续时间
  getDuration(speed: 'fast' | 'normal' | 'slow' = 'normal'): number {
    if (!this.shouldAnimate()) return 0;
    return reactBitConfig.theme.animations.duration[speed];
  },

  // 获取缓动函数
  getEasing(
    type: 'easeIn' | 'easeOut' | 'easeInOut' | 'bounce' = 'easeOut'
  ): string {
    return reactBitConfig.theme.animations.easing[type];
  },

  // 创建延迟函数
  createDelay(index: number, baseDelay: number = 0.1): number {
    if (!this.shouldAnimate()) return 0;
    return baseDelay * index;
  },

  // 创建交错动画配置
  createStagger(
    children: number,
    delayPerChild: number = 0.1,
    direction: 'normal' | 'reverse' = 'normal'
  ) {
    if (!this.shouldAnimate()) {
      return { staggerChildren: 0, delayChildren: 0 };
    }

    return {
      staggerChildren: delayPerChild,
      delayChildren: direction === 'reverse' ? children * delayPerChild : 0,
    };
  },

  // 创建弹簧动画配置
  createSpring(
    stiffness: number = 300,
    damping: number = 30,
    mass: number = 1
  ) {
    if (!this.shouldAnimate()) {
      return { type: 'tween', duration: 0 };
    }

    return {
      type: 'spring' as const,
      stiffness,
      damping,
      mass,
    };
  },

  // 创建缓动动画配置
  createTween(duration?: number, ease?: string) {
    if (!this.shouldAnimate()) {
      return { type: 'tween', duration: 0 };
    }

    return {
      type: 'tween' as const,
      duration: duration || this.getDuration(),
      ease: ease || this.getEasing(),
    };
  },

  // 获取预设动画
  getPreset(name: keyof typeof reactBitConfig.presets) {
    const preset = reactBitConfig.presets[name];
    if (!this.shouldAnimate()) {
      return {
        initial: preset.animate,
        animate: preset.animate,
        exit: preset.animate,
      };
    }
    return preset;
  },

  // 创建悬停动画
  createHover(scale: number = 1.05, duration: number = 0.2) {
    if (!this.shouldAnimate()) {
      return {};
    }

    return {
      scale,
      transition: { duration, ease: this.getEasing('easeOut') },
    };
  },

  // 创建点击动画
  createTap(scale: number = 0.95, duration: number = 0.1) {
    if (!this.shouldAnimate()) {
      return {};
    }

    return {
      scale,
      transition: { duration, ease: this.getEasing('easeOut') },
    };
  },

  // 创建无限循环动画
  createInfinite(
    keyframes: Record<string, any>,
    duration: number = 2,
    ease: string = 'linear'
  ) {
    if (!this.shouldAnimate()) {
      return {};
    }

    return {
      ...keyframes,
      transition: {
        duration,
        ease,
        repeat: Infinity,
        repeatType: 'loop' as const,
      },
    };
  },

  // 创建摇摆动画
  createWiggle(intensity: number = 5, duration: number = 0.5) {
    if (!this.shouldAnimate()) {
      return {};
    }

    return {
      x: [-intensity, intensity, -intensity, intensity, 0],
      transition: {
        duration,
        ease: this.getEasing('easeInOut'),
      },
    };
  },

  // 创建脉冲动画
  createPulse(scale: number = 1.1, duration: number = 1) {
    if (!this.shouldAnimate()) {
      return {};
    }

    return {
      scale: [1, scale, 1],
      transition: {
        duration,
        ease: this.getEasing('easeInOut'),
        repeat: Infinity,
        repeatType: 'loop' as const,
      },
    };
  },

  // 创建呼吸动画
  createBreathe(opacity: [number, number] = [0.5, 1], duration: number = 2) {
    if (!this.shouldAnimate()) {
      return {};
    }

    return {
      opacity,
      transition: {
        duration,
        ease: this.getEasing('easeInOut'),
        repeat: Infinity,
        repeatType: 'reverse' as const,
      },
    };
  },

  // 性能优化工具
  performance: {
    // 启用GPU加速
    enableGPU(element: HTMLElement) {
      if (reactBitConfig.performance.enableGPUAcceleration) {
        element.style.transform = 'translateZ(0)';
        element.style.willChange = 'transform';
      }
    },

    // 禁用GPU加速
    disableGPU(element: HTMLElement) {
      element.style.transform = '';
      element.style.willChange = '';
    },

    // 节流函数
    throttle<T extends (...args: any[]) => any>(
      func: T,
      limit: number
    ): (...args: Parameters<T>) => void {
      let inThrottle: boolean;
      return function (this: any, ...args: Parameters<T>) {
        if (!inThrottle) {
          func.apply(this, args);
          inThrottle = true;
          setTimeout(() => (inThrottle = false), limit);
        }
      };
    },

    // 防抖函数
    debounce<T extends (...args: any[]) => any>(
      func: T,
      delay: number
    ): (...args: Parameters<T>) => void {
      let timeoutId: NodeJS.Timeout;
      return function (this: any, ...args: Parameters<T>) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
      };
    },

    // 检查设备性能
    getDevicePerformance(): 'low' | 'medium' | 'high' {
      if (typeof window === 'undefined') return 'medium';

      const hardwareConcurrency = navigator.hardwareConcurrency || 4;
      const deviceMemory = (navigator as any).deviceMemory || 4;

      // 基于硬件信息判断性能
      if (hardwareConcurrency >= 8 && deviceMemory >= 8) {
        return 'high';
      } else if (hardwareConcurrency >= 4 && deviceMemory >= 4) {
        return 'medium';
      } else {
        return 'low';
      }
    },

    // 根据性能调整动画
    adjustForPerformance() {
      const performance = this.getDevicePerformance();

      switch (performance) {
        case 'low':
          reactBitConfig.animation.performance = 'low';
          reactBitConfig.performance.maxConcurrentAnimations = 3;
          break;
        case 'medium':
          reactBitConfig.animation.performance = 'medium';
          reactBitConfig.performance.maxConcurrentAnimations = 6;
          break;
        case 'high':
          reactBitConfig.animation.performance = 'high';
          reactBitConfig.performance.maxConcurrentAnimations = 10;
          break;
      }
    },
  },

  // 主题工具
  theme: {
    // 获取CSS变量值
    getCSSVariable(name: string): string {
      if (typeof window === 'undefined') return '';
      return getComputedStyle(document.documentElement)
        .getPropertyValue(name)
        .trim();
    },

    // 设置CSS变量
    setCSSVariable(name: string, value: string) {
      if (typeof window === 'undefined') return;
      document.documentElement.style.setProperty(name, value);
    },

    // 应用主题
    applyTheme(theme: Partial<ReactBitTheme>) {
      Object.entries(theme.colors || {}).forEach(([key, value]) => {
        this.setCSSVariable(`--reactbit-${key}`, value);
      });
    },

    // 检测暗色模式
    isDarkMode(): boolean {
      if (typeof window === 'undefined') return false;
      return document.documentElement.classList.contains('dark');
    },

    // 获取对比色
    getContrastColor(): string {
      // 简单的对比色计算，实际项目中可能需要更复杂的算法
      return this.isDarkMode() ? '#ffffff' : '#000000';
    },
  },

  // 可访问性工具
  accessibility: {
    // 检查是否偏好减少动画
    prefersReducedMotion(): boolean {
      if (typeof window === 'undefined') return false;
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    },

    // 检查是否偏好高对比度
    prefersHighContrast(): boolean {
      if (typeof window === 'undefined') return false;
      return window.matchMedia('(prefers-contrast: high)').matches;
    },

    // 添加焦点管理
    manageFocus(element: HTMLElement) {
      element.setAttribute('tabindex', '0');
      element.focus();
    },

    // 添加ARIA标签
    addAriaLabel(element: HTMLElement, label: string) {
      element.setAttribute('aria-label', label);
    },
  },
};
