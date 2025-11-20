'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Settings,
  Activity,
  TestTube,
  BarChart3,
  Monitor,
  Zap,
  Bug,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePerformanceMonitor } from '@/utils/performance';
import { TestingUtils, PerformanceBenchmark } from '@/utils/testing';

interface DevToolsProps {
  enabled?: boolean;
}

export function DevTools({ enabled }: DevToolsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<
    'performance' | 'testing' | 'monitoring' | 'benchmark'
  >('performance');
  const [testResults, setTestResults] = useState<any>(null);
  const [benchmarkResults, setBenchmarkResults] = useState<any>(null);
  const [isClient, setIsClient] = useState(false);
  const [isDev, setIsDev] = useState(false);
  const { metrics, getScore } = usePerformanceMonitor();

  // 确保只在客户端渲染
  useEffect(() => {
    setIsClient(true);
    setIsDev(process.env.NODE_ENV === 'development');
  }, []);

  // 如果不在客户端、不在开发环境或未启用，则不渲染
  if (!isClient || (!isDev && enabled !== true)) {
    return null;
  }

  const runTests = async () => {
    const results = await TestingUtils.runAllTests();
    setTestResults(results);
  };

  const runBenchmarks = async () => {
    const benchmark = new PerformanceBenchmark();

    // 基准测试：DOM 查询
    await benchmark.benchmark('DOM Query', () => {
      document.querySelectorAll('div');
    });

    // 基准测试：动画性能
    await benchmark.benchmark('Animation', () => {
      const element = document.createElement('div');
      element.style.transform = 'translateX(100px)';
      document.body.appendChild(element);
      element.style.transform = 'translateX(0px)';
      document.body.removeChild(element);
    });

    // 基准测试：内存分配
    await benchmark.benchmark('Memory Allocation', () => {
      const array = new Array(10000)
        .fill(0)
        .map((_, i) => ({ id: i, value: Math.random() }));
      array.sort((a, b) => a.value - b.value);
    });

    setBenchmarkResults(benchmark.getResults());
  };

  const tabs = [
    { id: 'performance', label: '性能', icon: Activity },
    { id: 'testing', label: '测试', icon: TestTube },
    { id: 'monitoring', label: '监控', icon: Monitor },
    { id: 'benchmark', label: '基准', icon: BarChart3 },
  ];

  return (
    <>
      {/* 开发工具按钮 */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'fixed bottom-4 left-4 z-50 p-2',
          'border-orange-500 bg-orange-500 text-white hover:bg-orange-600',
          'shadow-lg'
        )}
        title="开发工具"
      >
        <Settings className="h-4 w-4" />
      </Button>

      {/* 开发工具面板 */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* 背景遮罩 */}
            <motion.div
              className="fixed inset-0 z-40 bg-black/50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />

            {/* 面板内容 */}
            <motion.div
              className={cn(
                'fixed bottom-16 left-4 z-50 max-h-[80vh] w-96 overflow-hidden',
                'rounded-lg border bg-white shadow-xl dark:bg-slate-800'
              )}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
            >
              {/* 头部 */}
              <div className="flex items-center justify-between border-b p-4">
                <h2 className="flex items-center text-lg font-semibold">
                  <Bug className="mr-2 h-5 w-5" />
                  开发工具
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* 标签页 */}
              <div className="flex border-b">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={cn(
                        'flex-1 px-3 py-2 text-sm font-medium transition-colors',
                        'flex items-center justify-center space-x-1',
                        activeTab === tab.id
                          ? 'border-b-2 border-blue-600 bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                          : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* 内容区域 */}
              <div className="max-h-96 overflow-y-auto p-4">
                {activeTab === 'performance' && (
                  <PerformanceTab metrics={metrics} getScore={getScore} />
                )}
                {activeTab === 'testing' && (
                  <TestingTab results={testResults} onRunTests={runTests} />
                )}
                {activeTab === 'monitoring' && <MonitoringTab />}
                {activeTab === 'benchmark' && (
                  <BenchmarkTab
                    results={benchmarkResults}
                    onRunBenchmarks={runBenchmarks}
                  />
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

// 性能标签页
function PerformanceTab({ metrics, getScore }: any) {
  const score = getScore();

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Core Web Vitals</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {metrics.lcp && (
            <div className="flex justify-between text-sm">
              <span>LCP:</span>
              <span
                className={
                  metrics.lcp > 2500 ? 'text-red-500' : 'text-green-500'
                }
              >
                {(metrics.lcp / 1000).toFixed(2)}s
              </span>
            </div>
          )}
          {metrics.fid && (
            <div className="flex justify-between text-sm">
              <span>FID:</span>
              <span
                className={
                  metrics.fid > 100 ? 'text-red-500' : 'text-green-500'
                }
              >
                {metrics.fid.toFixed(2)}ms
              </span>
            </div>
          )}
          {metrics.cls && (
            <div className="flex justify-between text-sm">
              <span>CLS:</span>
              <span
                className={
                  metrics.cls > 0.1 ? 'text-red-500' : 'text-green-500'
                }
              >
                {metrics.cls.toFixed(3)}
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">性能评分</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <div
              className={cn(
                'text-2xl font-bold',
                score.grade === 'A'
                  ? 'text-green-500'
                  : score.grade === 'B'
                    ? 'text-blue-500'
                    : score.grade === 'C'
                      ? 'text-yellow-500'
                      : 'text-red-500'
              )}
            >
              {score.score} / 100
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              等级: {score.grade}
            </div>
          </div>
        </CardContent>
      </Card>

      {metrics.memoryUsage && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">内存使用</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1 text-sm">
              <div>已用: {metrics.memoryUsage.used}MB</div>
              <div>总计: {metrics.memoryUsage.total}MB</div>
              <div>限制: {metrics.memoryUsage.limit}MB</div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// 测试标签页
function TestingTab({ results, onRunTests }: any) {
  return (
    <div className="space-y-4">
      <Button onClick={onRunTests} className="w-full" size="sm">
        <TestTube className="mr-2 h-4 w-4" />
        运行测试
      </Button>

      {results && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">测试结果</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>总分:</span>
                <span
                  className={cn(
                    'font-medium',
                    results.totalScore >= 80 ? 'text-green-500' : 'text-red-500'
                  )}
                >
                  {results.totalScore} ({results.grade})
                </span>
              </div>
              <div className="flex justify-between">
                <span>可访问性:</span>
                <span>{results.accessibility.score}</span>
              </div>
              <div className="flex justify-between">
                <span>性能:</span>
                <span>{results.performance.score}</span>
              </div>
              <div className="flex justify-between">
                <span>网络:</span>
                <span>{results.network.score}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// 监控标签页
function MonitoringTab() {
  const [isMonitoring, setIsMonitoring] = useState(false);

  const startMonitoring = () => {
    setIsMonitoring(true);
    // 开始监控逻辑
  };

  const stopMonitoring = () => {
    setIsMonitoring(false);
    // 停止监控逻辑
  };

  return (
    <div className="space-y-4">
      <div className="flex space-x-2">
        <Button
          onClick={startMonitoring}
          disabled={isMonitoring}
          size="sm"
          className="flex-1"
        >
          <Activity className="mr-2 h-4 w-4" />
          开始监控
        </Button>
        <Button
          onClick={stopMonitoring}
          disabled={!isMonitoring}
          variant="outline"
          size="sm"
          className="flex-1"
        >
          停止监控
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">实时状态</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span>状态:</span>
              <span
                className={isMonitoring ? 'text-green-500' : 'text-gray-500'}
              >
                {isMonitoring ? '监控中' : '已停止'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>FPS:</span>
              <span>60</span>
            </div>
            <div className="flex justify-between">
              <span>延迟:</span>
              <span>16ms</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// 基准测试标签页
function BenchmarkTab({ results, onRunBenchmarks }: any) {
  return (
    <div className="space-y-4">
      <Button onClick={onRunBenchmarks} className="w-full" size="sm">
        <Zap className="mr-2 h-4 w-4" />
        运行基准测试
      </Button>

      {results && (
        <div className="space-y-2">
          {Object.entries(results).map(([name, data]: [string, any]) => (
            <Card key={name}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">{name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span>平均:</span>
                    <span>{data.average}ms</span>
                  </div>
                  <div className="flex justify-between">
                    <span>最小:</span>
                    <span>{data.min}ms</span>
                  </div>
                  <div className="flex justify-between">
                    <span>最大:</span>
                    <span>{data.max}ms</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
