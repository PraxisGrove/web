'use client';

import React, { useState } from 'react';
import { FloatingNav } from '@/components/aceternity/floating-navbar';
import { globalNavItems } from '@/lib/navigation';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  EnhancedCard,
  Badge,
  Button,
} from '@/components/unified';
import { motion } from 'framer-motion';
import { KnowledgeGraph } from '@/components/knowledge-graph/KnowledgeGraph';
import {
  mockKnowledgeNodes,
  mockKnowledgeConnections,
} from '@/lib/mock-data/knowledge-graph';
import { AdaptiveParticles } from '@/components/ui/PerformanceOptimizer';

/**
 * 知识宇宙页面
 */
export default function KnowledgeUniversePage() {
  const [showDemo, setShowDemo] = useState(false);

  return (
    <div className="bg-background min-h-screen">
      <AdaptiveParticles className="fixed inset-0 z-0">
        <div />
      </AdaptiveParticles>

      <main className="relative z-10">
        {/* 浮动导航栏 */}
        <FloatingNav navItems={globalNavItems} />

        {/* 主题切换按钮 */}
        <div className="fixed right-4 top-4 z-40">
          <ThemeToggle />
        </div>

        <div className="container mx-auto space-y-8 px-4 py-20">
          {/* 页面标题 */}
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-4xl font-bold text-transparent">
              知识宇宙
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-300">
              探索知识的无限可能，发现概念之间的深层联系
            </p>
          </motion.div>

          {/* 控制面板 */}
          <EnhancedCard variant="glow" className="mb-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    知识领域
                  </label>
                  <select className="rounded-md border border-white/20 bg-white/10 px-3 py-2 text-gray-900 backdrop-blur-sm focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/30 dark:text-white">
                    <option>全部领域</option>
                    <option>前端开发</option>
                    <option>人工智能</option>
                    <option>数据科学</option>
                    <option>3D图形</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    难度级别
                  </label>
                  <select className="rounded-md border border-white/20 bg-white/10 px-3 py-2 text-gray-900 backdrop-blur-sm focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/30 dark:text-white">
                    <option>所有级别</option>
                    <option>初级</option>
                    <option>中级</option>
                    <option>高级</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <motion.button
                  className="rounded-md bg-blue-600/80 px-4 py-2 text-white backdrop-blur-sm transition-all hover:scale-105 hover:bg-blue-600"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  重置视角
                </motion.button>
                <motion.button
                  className="rounded-md border border-white/20 bg-white/10 px-4 py-2 text-gray-700 backdrop-blur-sm transition-all hover:scale-105 hover:bg-white/20 dark:text-gray-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  全屏模式
                </motion.button>
              </div>
            </div>
          </EnhancedCard>

          {/* 知识图谱渲染区域 */}
          <EnhancedCard variant="glow" className="mb-8">
            <div className="flex items-center justify-between border-b border-white/10 p-4">
              <h2 className="text-xl font-semibold text-white">知识图谱</h2>
            </div>

            <div
              className="relative overflow-hidden bg-slate-50 dark:bg-slate-900"
              style={{ height: '600px' }}
            >
              <KnowledgeGraph
                initialNodes={mockKnowledgeNodes}
                initialConnections={mockKnowledgeConnections}
              />
            </div>
          </EnhancedCard>

          {/* 统计卡片 */}
          <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-4">
            <EnhancedCard variant="glow" className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="mb-1 text-sm font-medium text-gray-600 dark:text-gray-300">
                    已掌握概念
                  </p>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      24
                    </span>
                    <Badge
                      variant="secondary"
                      className="bg-green-500/20 text-xs text-green-600 dark:text-green-400"
                    >
                      +12% 本周
                    </Badge>
                  </div>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    共50个概念
                  </p>
                </div>
                <div className="rounded-lg bg-blue-500/20 p-2 text-blue-600 dark:text-blue-400">
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                </div>
              </div>
            </EnhancedCard>

            <EnhancedCard variant="glow" className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="mb-1 text-sm font-medium text-gray-600 dark:text-gray-300">
                    学习进度
                  </p>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                      68%
                    </span>
                    <Badge
                      variant="secondary"
                      className="bg-green-500/20 text-xs text-green-600 dark:text-green-400"
                    >
                      +8% 本月
                    </Badge>
                  </div>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    总体完成度
                  </p>
                </div>
                <div className="rounded-lg bg-green-500/20 p-2 text-green-600 dark:text-green-400">
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>
            </EnhancedCard>

            <EnhancedCard variant="glow" className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="mb-1 text-sm font-medium text-gray-600 dark:text-gray-300">
                    连接强度
                  </p>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                      85%
                    </span>
                    <Badge
                      variant="secondary"
                      className="bg-green-500/20 text-xs text-green-600 dark:text-green-400"
                    >
                      +5% 提升
                    </Badge>
                  </div>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    知识关联度
                  </p>
                </div>
                <div className="rounded-lg bg-purple-500/20 p-2 text-purple-600 dark:text-purple-400">
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
              </div>
            </EnhancedCard>

            <EnhancedCard variant="glow" className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="mb-1 text-sm font-medium text-gray-600 dark:text-gray-300">
                    学习时长
                  </p>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                      48h
                    </span>
                    <Badge
                      variant="secondary"
                      className="bg-green-500/20 text-xs text-green-600 dark:text-green-400"
                    >
                      +15% 增长
                    </Badge>
                  </div>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    本月累计
                  </p>
                </div>
                <div className="rounded-lg bg-orange-500/20 p-2 text-orange-600 dark:text-orange-400">
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>
            </EnhancedCard>
          </div>

          {/* 导航和统计 */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {/* 学习路径 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="rounded-lg bg-blue-500/20 p-2 text-blue-600 dark:text-blue-400">
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                      />
                    </svg>
                  </div>
                  推荐学习路径
                </CardTitle>
                <p className="text-muted-foreground text-sm">
                  基于您的学习进度智能推荐
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <motion.div
                    className="flex items-center space-x-3 rounded-lg border border-blue-500/20 bg-blue-500/10 p-3"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">
                      1
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        JavaScript 基础
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        变量、函数、对象
                      </p>
                    </div>
                  </motion.div>

                  <motion.div
                    className="flex items-center space-x-3 rounded-lg border border-white/10 bg-white/5 p-3"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-400 text-sm font-semibold text-white">
                      2
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        DOM 操作
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        元素选择、事件处理
                      </p>
                    </div>
                  </motion.div>

                  <motion.div
                    className="flex items-center space-x-3 rounded-lg border border-white/10 bg-white/5 p-3"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-400 text-sm font-semibold text-white">
                      3
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        异步编程
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Promise、async/await
                      </p>
                    </div>
                  </motion.div>
                </div>
              </CardContent>
            </Card>

            {/* 知识统计 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="rounded-lg bg-green-500/20 p-2 text-green-600 dark:text-green-400">
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                  </div>
                  知识统计
                </CardTitle>
                <p className="text-muted-foreground text-sm">
                  详细的学习数据分析
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="mb-1 flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-300">
                        已掌握概念
                      </span>
                      <span className="text-gray-900 dark:text-white">
                        24/50
                      </span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
                      <motion.div
                        className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-blue-600"
                        initial={{ width: 0 }}
                        animate={{ width: '48%' }}
                        transition={{ delay: 0.5, duration: 1 }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="mb-1 flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-300">
                        学习进度
                      </span>
                      <span className="text-gray-900 dark:text-white">68%</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
                      <motion.div
                        className="h-2 rounded-full bg-gradient-to-r from-green-500 to-green-600"
                        initial={{ width: 0 }}
                        animate={{ width: '68%' }}
                        transition={{ delay: 0.7, duration: 1 }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="mb-1 flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-300">
                        连接强度
                      </span>
                      <span className="text-gray-900 dark:text-white">85%</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
                      <motion.div
                        className="h-2 rounded-full bg-gradient-to-r from-purple-500 to-purple-600"
                        initial={{ width: 0 }}
                        animate={{ width: '85%' }}
                        transition={{ delay: 0.9, duration: 1 }}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 最近探索 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="rounded-lg bg-purple-500/20 p-2 text-purple-600 dark:text-purple-400">
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                      />
                    </svg>
                  </div>
                  最近探索
                </CardTitle>
                <p className="text-muted-foreground text-sm">您的学习足迹</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <motion.div
                    className="flex items-center space-x-3 rounded-lg border border-white/10 bg-white/5 p-2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-full border border-blue-500/30 bg-blue-500/20">
                      <span className="text-xs font-semibold text-blue-400">
                        JS
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        闭包概念
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        2分钟前
                      </p>
                    </div>
                  </motion.div>

                  <motion.div
                    className="flex items-center space-x-3 rounded-lg border border-white/10 bg-white/5 p-2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-full border border-green-500/30 bg-green-500/20">
                      <span className="text-xs font-semibold text-green-400">
                        AI
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        神经网络
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        15分钟前
                      </p>
                    </div>
                  </motion.div>

                  <motion.div
                    className="flex items-center space-x-3 rounded-lg border border-white/10 bg-white/5 p-2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-full border border-purple-500/30 bg-purple-500/20">
                      <span className="text-xs font-semibold text-purple-400">
                        3D
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        材质系统
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        1小时前
                      </p>
                    </div>
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 使用说明 */}
          <EnhancedCard
            variant="glass"
            className="bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-cyan-500/10"
          >
            <h3 className="mb-4 text-lg font-semibold text-blue-900 dark:text-blue-100">
              如何使用知识宇宙
            </h3>
            <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-3">
              <motion.div
                className="flex items-start space-x-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-semibold text-white">
                  1
                </div>
                <div>
                  <p className="font-medium text-blue-900 dark:text-blue-100">
                    探索节点
                  </p>
                  <p className="text-blue-700 dark:text-blue-200">
                    点击知识节点查看详细信息和相关内容
                  </p>
                </div>
              </motion.div>

              <motion.div
                className="flex items-start space-x-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-semibold text-white">
                  2
                </div>
                <div>
                  <p className="font-medium text-blue-900 dark:text-blue-100">
                    导航图谱
                  </p>
                  <p className="text-blue-700 dark:text-blue-200">
                    使用鼠标拖拽平移，滚轮缩放视角
                  </p>
                </div>
              </motion.div>

              <motion.div
                className="flex items-start space-x-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-semibold text-white">
                  3
                </div>
                <div>
                  <p className="font-medium text-blue-900 dark:text-blue-100">
                    跟踪进度
                  </p>
                  <p className="text-blue-700 dark:text-blue-200">
                    查看学习路径和知识连接强度
                  </p>
                </div>
              </motion.div>
            </div>
          </EnhancedCard>
        </div>

      </main>
    </div>
  );
}
