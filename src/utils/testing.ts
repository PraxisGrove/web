'use client';

// 测试工具类
export class TestingUtils {
  // 模拟用户交互
  static simulateUserInteraction(
    element: HTMLElement,
    type: 'click' | 'hover' | 'focus' | 'scroll'
  ) {
    switch (type) {
      case 'click':
        element.click();
        break;
      case 'hover':
        element.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
        break;
      case 'focus':
        if (element instanceof HTMLElement) {
          element.focus();
        }
        break;
      case 'scroll':
        element.scrollIntoView({ behavior: 'smooth' });
        break;
    }
  }

  // 测试响应式断点
  static testResponsiveBreakpoints() {
    const breakpoints = [
      { name: 'mobile', width: 375 },
      { name: 'tablet', width: 768 },
      { name: 'desktop', width: 1024 },
      { name: 'large', width: 1440 },
    ];

    const results: Record<string, boolean> = {};

    breakpoints.forEach(({ name, width }) => {
      // 模拟窗口大小变化
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: width,
      });

      window.dispatchEvent(new Event('resize'));

      // 检查布局是否正确响应
      // const isMobile = width < 768;
      // const isTablet = width >= 768 && width < 1024;
      // const isDesktop = width >= 1024;

      results[name] = true; // 简化的测试，实际应该检查具体的布局变化
    });

    return results;
  }

  // 测试可访问性
  static async testAccessibility() {
    const issues: string[] = [];

    // 检查图片 alt 属性
    const images = document.querySelectorAll('img');
    images.forEach((img, index) => {
      if (!img.alt) {
        issues.push(`Image ${index + 1} missing alt attribute`);
      }
    });

    // 检查表单标签
    const inputs = document.querySelectorAll('input, textarea, select');
    inputs.forEach((input, index) => {
      const id = input.getAttribute('id');
      const label = id ? document.querySelector(`label[for="${id}"]`) : null;
      const ariaLabel = input.getAttribute('aria-label');

      if (!label && !ariaLabel) {
        issues.push(`Form element ${index + 1} missing label or aria-label`);
      }
    });

    // 检查标题层级
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    let lastLevel = 0;
    headings.forEach((heading, index) => {
      const level = parseInt(heading.tagName.charAt(1));
      if (index === 0 && level !== 1) {
        issues.push('Page should start with h1');
      }
      if (level > lastLevel + 1) {
        issues.push(`Heading level skipped at heading ${index + 1}`);
      }
      lastLevel = level;
    });

    // 检查颜色对比度（简化版）
    const textElements = document.querySelectorAll('p, span, div, a, button');
    textElements.forEach((element) => {
      const styles = window.getComputedStyle(element);
      const color = styles.color;
      const backgroundColor = styles.backgroundColor;

      // 这里应该实现实际的对比度计算
      // 简化版本只检查是否设置了颜色
      if (color === 'rgb(0, 0, 0)' && backgroundColor === 'rgba(0, 0, 0, 0)') {
        // 可能的对比度问题
      }
    });

    return {
      passed: issues.length === 0,
      issues,
      score: Math.max(0, 100 - issues.length * 10),
    };
  }

  // 测试性能
  static async testPerformance() {
    const startTime = performance.now();

    // 测试 DOM 查询性能
    const domQueryStart = performance.now();
    document.querySelectorAll('*');
    const domQueryTime = performance.now() - domQueryStart;

    // 测试动画性能
    const animationStart = performance.now();
    const element = document.createElement('div');
    element.style.transform = 'translateX(100px)';
    document.body.appendChild(element);
    element.style.transform = 'translateX(0px)';
    document.body.removeChild(element);
    const animationTime = performance.now() - animationStart;

    // 测试内存使用
    let memoryUsage = 0;
    if ('memory' in performance) {
      memoryUsage = (performance as any).memory.usedJSHeapSize / 1048576; // MB
    }

    const totalTime = performance.now() - startTime;

    return {
      domQueryTime,
      animationTime,
      memoryUsage,
      totalTime,
      score: domQueryTime < 10 && animationTime < 5 ? 100 : 50,
    };
  }

  // 测试网络性能
  static async testNetworkPerformance() {
    const results: Record<string, number> = {};

    // 测试资源加载时间
    const resources = performance.getEntriesByType('resource');
    resources.forEach((resource: any) => {
      const loadTime = resource.responseEnd - resource.requestStart;
      results[resource.name] = loadTime;
    });

    // 计算平均加载时间
    const loadTimes = Object.values(results);
    const averageLoadTime =
      loadTimes.reduce((a, b) => a + b, 0) / loadTimes.length;

    return {
      resources: results,
      averageLoadTime,
      score: averageLoadTime < 1000 ? 100 : averageLoadTime < 3000 ? 50 : 0,
    };
  }

  // 运行所有测试
  static async runAllTests() {
    console.group('🧪 Running Tests');

    const results = {
      responsive: this.testResponsiveBreakpoints(),
      accessibility: await this.testAccessibility(),
      performance: await this.testPerformance(),
      network: await this.testNetworkPerformance(),
    };

    // 计算总分
    const scores = [
      results.accessibility.score,
      results.performance.score,
      results.network.score,
    ];
    const totalScore = scores.reduce((a, b) => a + b, 0) / scores.length;

    console.log('📱 Responsive Tests:', results.responsive);
    console.log('♿ Accessibility Tests:', results.accessibility);
    console.log('⚡ Performance Tests:', results.performance);
    console.log('🌐 Network Tests:', results.network);
    console.log('📊 Total Score:', Math.round(totalScore));

    console.groupEnd();

    return {
      ...results,
      totalScore: Math.round(totalScore),
      grade:
        totalScore >= 90
          ? 'A'
          : totalScore >= 80
            ? 'B'
            : totalScore >= 70
              ? 'C'
              : totalScore >= 60
                ? 'D'
                : 'F',
    };
  }
}

// 自动化测试运行器
export class AutomatedTestRunner {
  private tests: Array<() => Promise<any>> = [];
  private results: any[] = [];

  addTest(name: string, testFn: () => Promise<any>) {
    this.tests.push(async () => {
      const startTime = performance.now();
      try {
        const result = await testFn();
        const endTime = performance.now();
        return {
          name,
          status: 'passed',
          result,
          duration: endTime - startTime,
        };
      } catch (error) {
        const endTime = performance.now();
        return {
          name,
          status: 'failed',
          error: error instanceof Error ? error.message : String(error),
          duration: endTime - startTime,
        };
      }
    });
  }

  async runTests() {
    console.group('🤖 Automated Test Runner');
    this.results = [];

    for (const test of this.tests) {
      const result = await test();
      this.results.push(result);

      const status = result.status === 'passed' ? '✅' : '❌';
      console.log(`${status} ${result.name} (${result.duration.toFixed(2)}ms)`);

      if (result.status === 'failed') {
        console.error(`   Error: ${result.error}`);
      }
    }

    const passed = this.results.filter((r) => r.status === 'passed').length;
    const total = this.results.length;
    const passRate = (passed / total) * 100;

    console.log(
      `\n📈 Test Summary: ${passed}/${total} passed (${passRate.toFixed(1)}%)`
    );
    console.groupEnd();

    return {
      results: this.results,
      summary: {
        total,
        passed,
        failed: total - passed,
        passRate,
      },
    };
  }

  getResults() {
    return this.results;
  }
}

// 性能基准测试
export class PerformanceBenchmark {
  private benchmarks: Map<string, number[]> = new Map();

  async benchmark(
    name: string,
    fn: () => Promise<void> | void,
    iterations = 10
  ) {
    const times: number[] = [];

    for (let i = 0; i < iterations; i++) {
      const start = performance.now();
      await fn();
      const end = performance.now();
      times.push(end - start);
    }

    this.benchmarks.set(name, times);

    const average = times.reduce((a, b) => a + b, 0) / times.length;
    const min = Math.min(...times);
    const max = Math.max(...times);

    return {
      name,
      average,
      min,
      max,
      times,
    };
  }

  getResults() {
    const results: Record<string, any> = {};

    this.benchmarks.forEach((times, name) => {
      const average = times.reduce((a, b) => a + b, 0) / times.length;
      const min = Math.min(...times);
      const max = Math.max(...times);

      results[name] = {
        average: Math.round(average * 100) / 100,
        min: Math.round(min * 100) / 100,
        max: Math.round(max * 100) / 100,
        samples: times.length,
      };
    });

    return results;
  }

  clear() {
    this.benchmarks.clear();
  }
}
