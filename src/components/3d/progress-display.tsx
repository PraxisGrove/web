'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, Badge } from '@/components/unified';
import { KnowledgeNode } from '@/types/api';

interface ProgressDisplayProps {
  nodes: KnowledgeNode[];
  className?: string;
}

interface ProgressStats {
  total: number;
  completed: number;
  inProgress: number;
  notStarted: number;
  completionRate: number;
  totalLearningTime: number;
  completedLearningTime: number;
  categoryStats: Record<string, {
    total: number;
    completed: number;
    completionRate: number;
  }>;
  levelStats: Record<string, {
    total: number;
    completed: number;
    completionRate: number;
  }>;
}

export function ProgressDisplay({ nodes, className = '' }: ProgressDisplayProps) {
  const stats = useMemo((): ProgressStats => {
    const total = nodes.length;
    let completed = 0;
    let inProgress = 0;
    let notStarted = 0;
    let totalLearningTime = 0;
    let completedLearningTime = 0;

    const categoryStats: Record<string, { total: number; completed: number; completionRate: number }> = {};
    const levelStats: Record<string, { total: number; completed: number; completionRate: number }> = {};

    nodes.forEach(node => {
      totalLearningTime += node.metadata.learningTime;

      // 统计完成状态
      if (node.userProgress?.isLearned) {
        completed++;
        completedLearningTime += node.metadata.learningTime;
      } else if (node.userProgress?.masteryLevel && node.userProgress.masteryLevel > 0) {
        inProgress++;
        completedLearningTime += node.metadata.learningTime * (node.userProgress.masteryLevel / 100);
      } else {
        notStarted++;
      }

      // 分类统计
      if (!categoryStats[node.category]) {
        categoryStats[node.category] = { total: 0, completed: 0, completionRate: 0 };
      }
      categoryStats[node.category].total++;
      if (node.userProgress?.isLearned) {
        categoryStats[node.category].completed++;
      }

      // 级别统计
      if (!levelStats[node.level]) {
        levelStats[node.level] = { total: 0, completed: 0, completionRate: 0 };
      }
      levelStats[node.level].total++;
      if (node.userProgress?.isLearned) {
        levelStats[node.level].completed++;
      }
    });

    // 计算完成率
    Object.keys(categoryStats).forEach(category => {
      categoryStats[category].completionRate = 
        categoryStats[category].total > 0 
          ? (categoryStats[category].completed / categoryStats[category].total) * 100 
          : 0;
    });

    Object.keys(levelStats).forEach(level => {
      levelStats[level].completionRate = 
        levelStats[level].total > 0 
          ? (levelStats[level].completed / levelStats[level].total) * 100 
          : 0;
    });

    return {
      total,
      completed,
      inProgress,
      notStarted,
      completionRate: total > 0 ? (completed / total) * 100 : 0,
      totalLearningTime,
      completedLearningTime,
      categoryStats,
      levelStats,
    };
  }, [nodes]);

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'intermediate': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'advanced': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getCategoryColor = (index: number) => {
    const colors = [
      'bg-blue-500/20 text-blue-400 border-blue-500/30',
      'bg-purple-500/20 text-purple-400 border-purple-500/30',
      'bg-pink-500/20 text-pink-400 border-pink-500/30',
      'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
      'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
    ];
    return colors[index % colors.length];
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* 总体进度 */}
      <Card className="border-white/10 bg-black/30 text-white backdrop-blur-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="rounded-lg bg-blue-500/20 p-2 text-blue-400">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            学习进度总览
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* 进度条 */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>总体完成度</span>
              <span>{Math.round(stats.completionRate)}%</span>
            </div>
            <div className="h-3 w-full overflow-hidden rounded-full bg-white/10">
              <motion.div
                className="h-3 rounded-full bg-gradient-to-r from-blue-500 to-green-500"
                initial={{ width: 0 }}
                animate={{ width: `${stats.completionRate}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
              />
            </div>
          </div>

          {/* 统计数字 */}
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="text-2xl font-bold text-green-400">{stats.completed}</div>
              <div className="text-xs text-gray-400">已完成</div>
            </motion.div>

            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="text-2xl font-bold text-amber-400">{stats.inProgress}</div>
              <div className="text-xs text-gray-400">进行中</div>
            </motion.div>

            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="text-2xl font-bold text-gray-400">{stats.notStarted}</div>
              <div className="text-xs text-gray-400">未开始</div>
            </motion.div>

            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="text-2xl font-bold text-blue-400">{stats.total}</div>
              <div className="text-xs text-gray-400">总计</div>
            </motion.div>
          </div>

          {/* 学习时长 */}
          <div className="flex justify-between items-center p-3 rounded-lg bg-white/5">
            <div>
              <div className="text-sm text-gray-400">学习时长</div>
              <div className="font-semibold">
                {formatTime(stats.completedLearningTime)} / {formatTime(stats.totalLearningTime)}
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-400">完成率</div>
              <div className="font-semibold text-blue-400">
                {Math.round((stats.completedLearningTime / stats.totalLearningTime) * 100)}%
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 分类进度 */}
      <Card className="border-white/10 bg-black/30 text-white backdrop-blur-md">
        <CardHeader>
          <CardTitle className="text-lg">分类进度</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Object.entries(stats.categoryStats).map(([category, data], index) => (
              <motion.div
                key={category}
                className="space-y-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge className={getCategoryColor(index)}>
                      {category}
                    </Badge>
                    <span className="text-sm text-gray-400">
                      {data.completed}/{data.total}
                    </span>
                  </div>
                  <span className="text-sm font-semibold">
                    {Math.round(data.completionRate)}%
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
                  <motion.div
                    className="h-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-400"
                    initial={{ width: 0 }}
                    animate={{ width: `${data.completionRate}%` }}
                    transition={{ duration: 0.8, delay: index * 0.1 }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 级别进度 */}
      <Card className="border-white/10 bg-black/30 text-white backdrop-blur-md">
        <CardHeader>
          <CardTitle className="text-lg">难度级别进度</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Object.entries(stats.levelStats).map(([level, data], index) => (
              <motion.div
                key={level}
                className="space-y-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge className={getLevelColor(level)}>
                      {level === 'beginner' ? '初级' : level === 'intermediate' ? '中级' : '高级'}
                    </Badge>
                    <span className="text-sm text-gray-400">
                      {data.completed}/{data.total}
                    </span>
                  </div>
                  <span className="text-sm font-semibold">
                    {Math.round(data.completionRate)}%
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
                  <motion.div
                    className={`h-2 rounded-full ${
                      level === 'beginner' 
                        ? 'bg-gradient-to-r from-green-400 to-green-600'
                        : level === 'intermediate'
                        ? 'bg-gradient-to-r from-amber-400 to-amber-600'
                        : 'bg-gradient-to-r from-red-400 to-red-600'
                    }`}
                    initial={{ width: 0 }}
                    animate={{ width: `${data.completionRate}%` }}
                    transition={{ duration: 0.8, delay: index * 0.1 }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
