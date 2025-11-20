/**
 * Aceternity UI 动画配置和工具
 * 基于 Framer Motion 的高性能动画系统
 */

import { Variants } from 'framer-motion';

// 动画预设配置
export const animationPresets = {
  // 缓动函数
  easing: {
    easeInOut: [0.4, 0, 0.2, 1],
    easeOut: [0, 0, 0.2, 1],
    easeIn: [0.4, 0, 1, 1],
    sharp: [0.4, 0, 0.6, 1],
    bounce: [0.68, -0.55, 0.265, 1.55],
  },

  // 持续时间
  duration: {
    fast: 0.15,
    normal: 0.3,
    slow: 0.5,
    slower: 0.8,
  },

  // 延迟
  delay: {
    none: 0,
    short: 0.1,
    medium: 0.2,
    long: 0.4,
  },
} as const;

// 通用动画变体
export const commonVariants: Record<string, Variants> = {
  // 淡入淡出
  fadeIn: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: animationPresets.duration.normal,
        ease: animationPresets.easing.easeOut,
      },
    },
  },

  // 滑动进入
  slideUp: {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: animationPresets.duration.normal,
        ease: animationPresets.easing.easeOut,
      },
    },
  },

  slideDown: {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: animationPresets.duration.normal,
        ease: animationPresets.easing.easeOut,
      },
    },
  },

  slideLeft: {
    hidden: { opacity: 0, x: 20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: animationPresets.duration.normal,
        ease: animationPresets.easing.easeOut,
      },
    },
  },

  slideRight: {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: animationPresets.duration.normal,
        ease: animationPresets.easing.easeOut,
      },
    },
  },

  // 缩放动画
  scaleIn: {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: animationPresets.duration.normal,
        ease: animationPresets.easing.easeOut,
      },
    },
  },

  // 弹跳进入
  bounceIn: {
    hidden: { opacity: 0, scale: 0.3 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: animationPresets.duration.slow,
        ease: animationPresets.easing.bounce,
      },
    },
  },

  // 旋转进入
  rotateIn: {
    hidden: { opacity: 0, rotate: -180 },
    visible: {
      opacity: 1,
      rotate: 0,
      transition: {
        duration: animationPresets.duration.slow,
        ease: animationPresets.easing.easeOut,
      },
    },
  },
};

// 容器动画变体（用于子元素的交错动画）
export const containerVariants: Record<string, Variants> = {
  // 交错淡入
  staggerFadeIn: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  },

  // 交错滑动
  staggerSlideUp: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  },
};

// 特殊效果动画
export const specialEffects = {
  // 光束扫描效果
  beamScan: {
    initial: { x: '-100%', opacity: 0 },
    animate: {
      x: '100%',
      opacity: [0, 1, 0],
      transition: {
        duration: 2,
        ease: 'linear',
        repeat: Infinity,
        repeatDelay: 3,
      },
    },
  },

  // 脉冲发光
  pulseGlow: {
    animate: {
      boxShadow: [
        '0 0 5px hsl(var(--primary))',
        '0 0 20px hsl(var(--primary)), 0 0 30px hsl(var(--primary))',
        '0 0 5px hsl(var(--primary))',
      ],
      transition: {
        duration: 2,
        ease: 'easeInOut',
        repeat: Infinity,
      },
    },
  },

  // 浮动效果
  float: {
    animate: {
      y: [-5, 5, -5],
      transition: {
        duration: 3,
        ease: 'easeInOut',
        repeat: Infinity,
      },
    },
  },

  // 渐变移动
  gradientShift: {
    animate: {
      backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
      transition: {
        duration: 4,
        ease: 'linear',
        repeat: Infinity,
      },
    },
  },
};

// 动画工具函数
export const animationUtils = {
  /**
   * 创建交错动画配置
   */
  createStagger: (staggerDelay = 0.1, delayChildren = 0) => ({
    transition: {
      staggerChildren: staggerDelay,
      delayChildren,
    },
  }),

  /**
   * 创建弹簧动画配置
   */
  createSpring: (stiffness = 100, damping = 10, mass = 1) => ({
    type: 'spring' as const,
    stiffness,
    damping,
    mass,
  }),

  /**
   * 创建缓动动画配置
   */
  createEasing: (duration = 0.3, ease = animationPresets.easing.easeOut) => ({
    duration,
    ease,
  }),

  /**
   * 创建延迟动画配置
   */
  createDelay: (delay = 0, duration = 0.3) => ({
    delay,
    duration,
    ease: animationPresets.easing.easeOut,
  }),

  /**
   * 创建循环动画配置
   */
  createLoop: (duration = 2, ease = 'linear' as const, repeatDelay = 0) => ({
    duration,
    ease,
    repeat: Infinity,
    repeatDelay,
  }),

  /**
   * 创建悬停动画配置
   */
  createHover: (scale = 1.05, duration = 0.2) => ({
    scale,
    transition: {
      duration,
      ease: animationPresets.easing.easeOut,
    },
  }),

  /**
   * 创建点击动画配置
   */
  createTap: (scale = 0.95, duration = 0.1) => ({
    scale,
    transition: {
      duration,
      ease: animationPresets.easing.sharp,
    },
  }),
};

// 性能优化配置
export const performanceConfig = {
  // 减少动画的配置（用于低性能设备）
  reduced: {
    duration: animationPresets.duration.fast,
    ease: animationPresets.easing.easeOut,
  },

  // 禁用动画的配置
  disabled: {
    duration: 0,
    ease: 'linear' as const,
  },

  // GPU 加速的属性
  gpuAccelerated: ['transform', 'opacity', 'filter'],

  // 避免的属性（会触发重排）
  avoidProperties: ['width', 'height', 'top', 'left', 'margin', 'padding'],
};

// 导出类型
export type AnimationPreset = keyof typeof commonVariants;
export type ContainerAnimation = keyof typeof containerVariants;
export type SpecialEffect = keyof typeof specialEffects;
