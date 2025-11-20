'use client';

import React from 'react';

// 性能指标接口
export interface PerformanceMetrics {
  // Core Web Vitals
  fcp?: number; // First Contentful Paint
  lcp?: number; // Largest Contentful Paint
  fid?: number; // First Input Delay
  cls?: number; // Cumulative Layout Shift
  ttfb?: number; // Time to First Byte

  // 自定义指标
  domContentLoaded?: number;
  loadComplete?: number;
  firstInteraction?: number;

  // 内存使用
  memoryUsage?: {
    used: number;
    total: number;
    limit: number;
  };

  // 网络信息
  connection?: {
    effectiveType: string;
    downlink: number;
    rtt: number;
  };
}

// 性能监控类
export class PerformanceMonitor {
  private metrics: PerformanceMetrics = {};
  private observers: PerformanceObserver[] = [];
  private startTime: number = 0;

  constructor() {
    // 检查是否在浏览器环境
    if (typeof window !== 'undefined') {
      this.startTime = performance.now();
      this.initializeObservers();
      this.measureBasicMetrics();
    }
  }

  // 初始化性能观察器
  private initializeObservers() {
    // 检查是否在浏览器环境
    if (typeof window === 'undefined') return;

    // 观察 LCP
    if ('PerformanceObserver' in window) {
      try {
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1] as any;
          this.metrics.lcp = lastEntry.startTime;
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
        this.observers.push(lcpObserver);
      } catch {
        console.warn('LCP observer not supported');
      }

      // 观察 FID
      try {
        const fidObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry: any) => {
            this.metrics.fid = entry.processingStart - entry.startTime;
          });
        });
        fidObserver.observe({ entryTypes: ['first-input'] });
        this.observers.push(fidObserver);
      } catch {
        console.warn('FID observer not supported');
      }

      // 观察 CLS
      try {
        const clsObserver = new PerformanceObserver((list) => {
          let clsValue = 0;
          const entries = list.getEntries();
          entries.forEach((entry: any) => {
            if (!entry.hadRecentInput) {
              clsValue += entry.value;
            }
          });
          this.metrics.cls = clsValue;
        });
        clsObserver.observe({ entryTypes: ['layout-shift'] });
        this.observers.push(clsObserver);
      } catch {
        console.warn('CLS observer not supported');
      }

      // 观察导航时间
      try {
        const navigationObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry: any) => {
            this.metrics.ttfb = entry.responseStart - entry.requestStart;
            this.metrics.domContentLoaded =
              entry.domContentLoadedEventEnd - entry.domContentLoadedEventStart;
            this.metrics.loadComplete =
              entry.loadEventEnd - entry.loadEventStart;
          });
        });
        navigationObserver.observe({ entryTypes: ['navigation'] });
        this.observers.push(navigationObserver);
      } catch {
        console.warn('Navigation observer not supported');
      }
    }
  }

  // 测量基础指标
  private measureBasicMetrics() {
    // 检查是否在浏览器环境
    if (typeof window === 'undefined') return;

    // FCP
    if ('PerformancePaintTiming' in window) {
      const paintEntries = performance.getEntriesByType('paint');
      const fcpEntry = paintEntries.find(
        (entry) => entry.name === 'first-contentful-paint'
      );
      if (fcpEntry) {
        this.metrics.fcp = fcpEntry.startTime;
      }
    }

    // 内存使用情况
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      this.metrics.memoryUsage = {
        used: Math.round(memory.usedJSHeapSize / 1048576), // MB
        total: Math.round(memory.totalJSHeapSize / 1048576), // MB
        limit: Math.round(memory.jsHeapSizeLimit / 1048576), // MB
      };
    }

    // 网络连接信息
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      this.metrics.connection = {
        effectiveType: connection.effectiveType || 'unknown',
        downlink: connection.downlink || 0,
        rtt: connection.rtt || 0,
      };
    }
  }

  // 记录首次交互时间
  public recordFirstInteraction() {
    if (!this.metrics.firstInteraction) {
      this.metrics.firstInteraction = performance.now() - this.startTime;
    }
  }

  // 获取当前指标
  public getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  // 获取性能评分
  public getPerformanceScore(): {
    score: number;
    grade: 'A' | 'B' | 'C' | 'D' | 'F';
    details: Record<
      string,
      { value: number; score: number; threshold: number }
    >;
  } {
    const details: Record<
      string,
      { value: number; score: number; threshold: number }
    > = {};
    let totalScore = 0;
    let metricCount = 0;

    // LCP 评分 (0-2.5s = 100, 2.5-4s = 50, >4s = 0)
    if (this.metrics.lcp !== undefined) {
      const lcp = this.metrics.lcp / 1000;
      const score = lcp <= 2.5 ? 100 : lcp <= 4 ? 50 : 0;
      details.lcp = { value: lcp, score, threshold: 2.5 };
      totalScore += score;
      metricCount++;
    }

    // FID 评分 (0-100ms = 100, 100-300ms = 50, >300ms = 0)
    if (this.metrics.fid !== undefined) {
      const fid = this.metrics.fid;
      const score = fid <= 100 ? 100 : fid <= 300 ? 50 : 0;
      details.fid = { value: fid, score, threshold: 100 };
      totalScore += score;
      metricCount++;
    }

    // CLS 评分 (0-0.1 = 100, 0.1-0.25 = 50, >0.25 = 0)
    if (this.metrics.cls !== undefined) {
      const cls = this.metrics.cls;
      const score = cls <= 0.1 ? 100 : cls <= 0.25 ? 50 : 0;
      details.cls = { value: cls, score, threshold: 0.1 };
      totalScore += score;
      metricCount++;
    }

    // FCP 评分 (0-1.8s = 100, 1.8-3s = 50, >3s = 0)
    if (this.metrics.fcp !== undefined) {
      const fcp = this.metrics.fcp / 1000;
      const score = fcp <= 1.8 ? 100 : fcp <= 3 ? 50 : 0;
      details.fcp = { value: fcp, score, threshold: 1.8 };
      totalScore += score;
      metricCount++;
    }

    const averageScore = metricCount > 0 ? totalScore / metricCount : 0;
    const grade =
      averageScore >= 90
        ? 'A'
        : averageScore >= 80
          ? 'B'
          : averageScore >= 70
            ? 'C'
            : averageScore >= 60
              ? 'D'
              : 'F';

    return {
      score: Math.round(averageScore),
      grade,
      details,
    };
  }

  // 发送指标到分析服务
  public async sendMetrics(endpoint?: string) {
    const metrics = this.getMetrics();
    const score = this.getPerformanceScore();

    const data = {
      metrics,
      score,
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
      url: window.location.href,
    };

    if (endpoint) {
      try {
        await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
      } catch (error) {
        console.error('Failed to send performance metrics:', error);
      }
    }

    // 在开发环境下输出到控制台
    if (process.env.NODE_ENV === 'development') {
      console.group('🚀 Performance Metrics');
      console.table(metrics);
      console.log('📊 Performance Score:', score);
      console.groupEnd();
    }

    return data;
  }

  // 清理观察器
  public cleanup() {
    this.observers.forEach((observer) => observer.disconnect());
    this.observers = [];
  }
}

// 性能监控 Hook
export function usePerformanceMonitor() {
  const [monitor] = React.useState(() => {
    // 只在浏览器环境中创建监控实例
    return typeof window !== 'undefined' ? new PerformanceMonitor() : null;
  });
  const [metrics, setMetrics] = React.useState<PerformanceMetrics>({});

  React.useEffect(() => {
    // 检查是否在浏览器环境且有监控实例
    if (typeof window === 'undefined' || !monitor) return;

    const updateMetrics = () => {
      setMetrics(monitor.getMetrics());
    };

    // 定期更新指标
    const interval = setInterval(updateMetrics, 5000);

    // 页面卸载时发送指标
    const handleBeforeUnload = () => {
      monitor.sendMetrics();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      clearInterval(interval);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      monitor.cleanup();
    };
  }, [monitor]);

  const getScore = React.useCallback(
    () => monitor?.getPerformanceScore() || 100,
    [monitor]
  );
  const sendMetrics = React.useCallback(
    (endpoint?: string) => monitor?.sendMetrics(endpoint),
    [monitor]
  );

  return React.useMemo(
    () => ({
      metrics,
      monitor,
      getScore,
      sendMetrics,
    }),
    [metrics, monitor, getScore, sendMetrics]
  );
}

// 全局性能监控实例
let globalMonitor: PerformanceMonitor | null = null;

export function initializePerformanceMonitoring() {
  if (typeof window !== 'undefined' && !globalMonitor) {
    globalMonitor = new PerformanceMonitor();

    // 记录用户首次交互
    const recordInteraction = () => {
      globalMonitor?.recordFirstInteraction();
      ['click', 'keydown', 'touchstart'].forEach((event) => {
        document.removeEventListener(event, recordInteraction, {
          capture: true,
        });
      });
    };

    ['click', 'keydown', 'touchstart'].forEach((event) => {
      document.addEventListener(event, recordInteraction, {
        capture: true,
        once: true,
      });
    });
  }

  return globalMonitor;
}
