/**
 * 性能监控工具
 * 用于监控组件库的性能表现和优化建议
 */

import React from 'react';

interface PerformanceMetrics {
  renderTime: number;
  memoryUsage: number;
  animationFPS: number;
  bundleSize: number;
  componentCount: number;
}

interface PerformanceReport {
  metrics: PerformanceMetrics;
  recommendations: string[];
  score: number;
  timestamp: number;
}

class PerformanceMonitor {
  private metrics: PerformanceMetrics = {
    renderTime: 0,
    memoryUsage: 0,
    animationFPS: 0,
    bundleSize: 0,
    componentCount: 0,
  };

  private observers: PerformanceObserver[] = [];
  private animationFrameId: number | null = null;
  private frameCount = 0;
  private lastTime = 0;

  constructor() {
    this.initializeObservers();
  }

  private initializeObservers() {
    if (typeof window === 'undefined') return;

    // 监控渲染性能
    if ('PerformanceObserver' in window) {
      const renderObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (entry.entryType === 'measure') {
            this.metrics.renderTime = entry.duration;
          }
        });
      });

      renderObserver.observe({ entryTypes: ['measure'] });
      this.observers.push(renderObserver);

      // 监控长任务
      const longTaskObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (entry.duration > 50) {
            console.warn(`Long task detected: ${entry.duration}ms`);
          }
        });
      });

      try {
        longTaskObserver.observe({ entryTypes: ['longtask'] });
        this.observers.push(longTaskObserver);
      } catch {
        // longtask 可能不被支持
      }
    }
  }

  // 开始监控组件渲染
  startComponentRender(componentName: string) {
    if (typeof window === 'undefined') return;

    performance.mark(`${componentName}-start`);
  }

  // 结束监控组件渲染
  endComponentRender(componentName: string) {
    if (typeof window === 'undefined') return;

    performance.mark(`${componentName}-end`);
    performance.measure(
      `${componentName}-render`,
      `${componentName}-start`,
      `${componentName}-end`
    );
  }

  // 监控内存使用
  measureMemoryUsage(): number {
    if (typeof window === 'undefined') return 0;

    // @ts-ignore - performance.memory 可能不存在
    const memory = (performance as any).memory;
    if (memory) {
      this.metrics.memoryUsage = memory.usedJSHeapSize / 1024 / 1024; // MB
      return this.metrics.memoryUsage;
    }
    return 0;
  }

  // 开始监控动画 FPS
  startFPSMonitoring() {
    if (typeof window === 'undefined') return;

    this.frameCount = 0;
    this.lastTime = performance.now();

    const measureFPS = (currentTime: number) => {
      this.frameCount++;

      if (currentTime - this.lastTime >= 1000) {
        this.metrics.animationFPS = this.frameCount;
        this.frameCount = 0;
        this.lastTime = currentTime;
      }

      this.animationFrameId = requestAnimationFrame(measureFPS);
    };

    this.animationFrameId = requestAnimationFrame(measureFPS);
  }

  // 停止监控动画 FPS
  stopFPSMonitoring() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  // 获取当前性能指标
  getMetrics(): PerformanceMetrics {
    this.measureMemoryUsage();
    return { ...this.metrics };
  }

  // 生成性能报告
  generateReport(): PerformanceReport {
    const metrics = this.getMetrics();
    const recommendations: string[] = [];
    let score = 100;

    // 渲染时间评估
    if (metrics.renderTime > 16) {
      recommendations.push(
        '组件渲染时间过长，考虑使用 React.memo 或优化渲染逻辑'
      );
      score -= 20;
    }

    // 内存使用评估
    if (metrics.memoryUsage > 50) {
      recommendations.push('内存使用过高，检查是否有内存泄漏或过多的组件实例');
      score -= 15;
    }

    // FPS 评估
    if (metrics.animationFPS < 30) {
      recommendations.push('动画帧率过低，考虑简化动画或使用 CSS 动画');
      score -= 25;
    }

    // 组件数量评估
    if (metrics.componentCount > 100) {
      recommendations.push('页面组件数量过多，考虑使用虚拟化或分页');
      score -= 10;
    }

    return {
      metrics,
      recommendations,
      score: Math.max(0, score),
      timestamp: Date.now(),
    };
  }

  // 设置组件数量
  setComponentCount(count: number) {
    this.metrics.componentCount = count;
  }

  // 清理监控器
  cleanup() {
    this.observers.forEach((observer) => observer.disconnect());
    this.observers = [];
    this.stopFPSMonitoring();
  }
}

// 创建全局性能监控实例（延迟初始化）
let performanceMonitorInstance: PerformanceMonitor | null = null;

export const performanceMonitor = {
  getInstance(): PerformanceMonitor | null {
    if (typeof window === 'undefined') return null;

    if (!performanceMonitorInstance) {
      performanceMonitorInstance = new PerformanceMonitor();
    }
    return performanceMonitorInstance;
  },

  // 代理方法
  startComponentRender(componentName: string) {
    return this.getInstance()?.startComponentRender(componentName);
  },

  endComponentRender(componentName: string) {
    return this.getInstance()?.endComponentRender(componentName);
  },

  measureMemoryUsage() {
    return this.getInstance()?.measureMemoryUsage() || 0;
  },

  startFPSMonitoring() {
    return this.getInstance()?.startFPSMonitoring();
  },

  stopFPSMonitoring() {
    return this.getInstance()?.stopFPSMonitoring();
  },

  getMetrics(): PerformanceMetrics {
    return (
      this.getInstance()?.getMetrics() || {
        renderTime: 0,
        memoryUsage: 0,
        animationFPS: 60,
        bundleSize: 0,
        componentCount: 0,
      }
    );
  },

  generateReport() {
    const instance = this.getInstance();
    if (!instance) {
      return {
        metrics: {},
        recommendations: [],
        score: 100,
        timestamp: Date.now(),
      };
    }
    return instance.generateReport();
  },

  setComponentCount(count: number) {
    return this.getInstance()?.setComponentCount(count);
  },

  cleanup() {
    return this.getInstance()?.cleanup();
  },
};

// React Hook 用于组件性能监控
export function usePerformanceMonitor(componentName: string) {
  React.useEffect(() => {
    performanceMonitor.startComponentRender(componentName);

    return () => {
      performanceMonitor.endComponentRender(componentName);
    };
  }, [componentName]);
}

// 性能优化建议
export const performanceOptimizations = {
  // 检查是否应该使用动画
  shouldUseAnimation(): boolean {
    const metrics = performanceMonitor.getMetrics();

    // 如果 FPS 低于 30 或内存使用过高，建议禁用复杂动画
    if (metrics.animationFPS < 30 || metrics.memoryUsage > 100) {
      return false;
    }

    // 检查用户偏好
    if (typeof window !== 'undefined') {
      const prefersReducedMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
      ).matches;
      if (prefersReducedMotion) return false;
    }

    return true;
  },

  // 获取推荐的动画复杂度
  getRecommendedAnimationComplexity(): 'simple' | 'moderate' | 'complex' {
    const metrics = performanceMonitor.getMetrics();

    if (metrics.animationFPS >= 50 && metrics.memoryUsage < 50) {
      return 'complex';
    } else if (metrics.animationFPS >= 30 && metrics.memoryUsage < 75) {
      return 'moderate';
    } else {
      return 'simple';
    }
  },

  // 获取推荐的组件数量限制
  getRecommendedComponentLimit(): number {
    const metrics = performanceMonitor.getMetrics();

    if (metrics.memoryUsage < 25) {
      return 200;
    } else if (metrics.memoryUsage < 50) {
      return 100;
    } else {
      return 50;
    }
  },

  // 检查是否需要虚拟化
  shouldUseVirtualization(itemCount: number): boolean {
    const limit = this.getRecommendedComponentLimit();
    return itemCount > limit;
  },
};

// 性能调试工具
export const performanceDebugger = {
  // 在控制台显示性能报告
  logReport() {
    const report = performanceMonitor.generateReport();

    console.group('🚀 性能监控报告');
    console.log('📊 性能指标:', report.metrics);
    console.log('⭐ 性能评分:', report.score);

    if (report.recommendations.length > 0) {
      console.group('💡 优化建议:');
      report.recommendations.forEach((rec, index) => {
        console.log(`${index + 1}. ${rec}`);
      });
      console.groupEnd();
    }

    console.groupEnd();
  },

  // 开始性能分析
  startProfiling() {
    performanceMonitor.startFPSMonitoring();
    console.log('🔍 开始性能分析...');
  },

  // 停止性能分析
  stopProfiling() {
    performanceMonitor.stopFPSMonitoring();
    this.logReport();
    console.log('✅ 性能分析完成');
  },

  // 监控特定组件
  profileComponent(componentName: string, renderFn: () => void) {
    performanceMonitor.startComponentRender(componentName);
    const startTime = performance.now();

    renderFn();

    const endTime = performance.now();
    performanceMonitor.endComponentRender(componentName);

    console.log(
      `⏱️ ${componentName} 渲染时间: ${(endTime - startTime).toFixed(2)}ms`
    );
  },
};

// 导出类型
export type { PerformanceMetrics, PerformanceReport };
