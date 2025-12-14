'use client';

import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ProgressChart,
  LearningCalendar,
  Achievements,
  Settings,
  defaultLearningStats,
} from '@/components/profile';
import { Card, CardContent, EnhancedCard, Badge } from '@/components/unified';
import { FloatingNav } from '@/components/aceternity/floating-navbar';
import { globalNavItems } from '@/lib/navigation';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { Aurora } from '@/components/reactbit';

/**
 * 用户学习仪表板页面
 */
export default function DashboardPage() {
  const { user } = useAuth();

  // 使用统一的导航配置
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>(
    '30d'
  );

  // 模拟数据
  const [progressData] = useState([
    { date: '2024-01-01', studyTime: 45, completedLessons: 2, progress: 15 },
    { date: '2024-01-02', studyTime: 60, completedLessons: 3, progress: 25 },
    { date: '2024-01-03', studyTime: 30, completedLessons: 1, progress: 30 },
    { date: '2024-01-04', studyTime: 90, completedLessons: 4, progress: 45 },
    { date: '2024-01-05', studyTime: 75, completedLessons: 3, progress: 55 },
    { date: '2024-01-06', studyTime: 120, completedLessons: 5, progress: 70 },
    { date: '2024-01-07', studyTime: 45, completedLessons: 2, progress: 75 },
  ]);

  const [courseProgress] = useState([
    { name: 'JavaScript', progress: 75, color: '#3b82f6' },
    { name: '机器学习', progress: 45, color: '#10b981' },
    { name: 'Three.js', progress: 30, color: '#8b5cf6' },
    { name: 'React', progress: 60, color: '#f59e0b' },
  ]);

  const [learningCalendarData] = useState([
    {
      date: '2024-01-01',
      studyTime: 45,
      completedLessons: 2,
      courses: [
        { id: '1', name: 'JavaScript', progress: 15, color: '#3b82f6' },
      ],
      streak: true,
    },
    {
      date: '2024-01-02',
      studyTime: 60,
      completedLessons: 3,
      courses: [
        { id: '1', name: 'JavaScript', progress: 25, color: '#3b82f6' },
        { id: '2', name: '机器学习', progress: 10, color: '#10b981' },
      ],
      streak: true,
    },
  ]);

  const [achievements] = useState([
    {
      id: '1',
      title: '初学者',
      description: '完成第一门课程',
      icon: 'BookOpen',
      category: 'learning' as const,
      rarity: 'common' as const,
      isUnlocked: true,
      unlockedAt: '2024-01-01',
      progress: 1,
      maxProgress: 1,
      reward: { type: 'points' as const, value: 100 },
    },
    {
      id: '2',
      title: '连续学习者',
      description: '连续学习7天',
      icon: 'Target',
      category: 'streak' as const,
      rarity: 'rare' as const,
      isUnlocked: false,
      progress: 5,
      maxProgress: 7,
      reward: { type: 'badge' as const, value: '坚持徽章' },
    },
  ]);

  const [stats, setStats] = useState(defaultLearningStats);

  useEffect(() => {
    // 模拟数据加载
    const timer = setTimeout(() => {
      // 更新统计数据
      const updatedStats = [...defaultLearningStats];
      updatedStats[0].value = 48; // 总学习时间
      updatedStats[1].value = 3; // 完成课程
      updatedStats[2].value = 5; // 连续学习天数
      updatedStats[3].value = 8; // 获得成就
      updatedStats[3].progress = { current: 8, total: 50, label: '成就进度' };
      updatedStats[4].value = 15; // 学习天数
      updatedStats[5].value = 4.7; // 平均评分
      updatedStats[6].value = 2.3; // 学习效率
      updatedStats[7].value = 2; // 获得证书
      updatedStats[7].progress = { current: 2, total: 10, label: '证书进度' };

      setStats(updatedStats);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // 处理时间范围变化
  const handleTimeRangeChange = (range: '7d' | '30d' | '90d' | '1y') => {
    setTimeRange(range);
    // 这里可以根据时间范围重新获取数据
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="h-8 w-48 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="h-32 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"
            />
          ))}
        </div>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {Array.from({ length: 2 }).map((_, index) => (
            <div
              key={index}
              className="h-96 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background relative min-h-screen w-full overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Aurora
          colorStops={['#6366f1', '#ef4444', '#FFE600']}
          blend={0.5}
          amplitude={1.0}
          speed={0.5}
        />
      </div>

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
          <h1 className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-4xl font-bold text-transparent">
            学习仪表板
          </h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
            欢迎回来，{user?.name || '学习者'}！查看您的学习进度和成就
          </p>
        </motion.div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <EnhancedCard variant="glow" className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="mb-1 text-sm font-medium text-gray-600 dark:text-gray-300">
                  总学习时间
                </p>
                <div className="flex items-baseline space-x-2">
                  <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {stats[0]?.value || 48}h
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
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </EnhancedCard>

          <EnhancedCard variant="glow" className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="mb-1 text-sm font-medium text-gray-600 dark:text-gray-300">
                  完成课程
                </p>
                <div className="flex items-baseline space-x-2">
                  <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {stats[1]?.value || 3}
                  </span>
                  <Badge
                    variant="secondary"
                    className="bg-green-500/20 text-xs text-green-600 dark:text-green-400"
                  >
                    +2 本月
                  </Badge>
                </div>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  已完成
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
                  连续学习
                </p>
                <div className="flex items-baseline space-x-2">
                  <span className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                    {stats[2]?.value || 5}天
                  </span>
                  <Badge
                    variant="secondary"
                    className="bg-green-500/20 text-xs text-green-600 dark:text-green-400"
                  >
                    +25% 提升
                  </Badge>
                </div>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  当前连击
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
                  获得成就
                </p>
                <div className="flex items-baseline space-x-2">
                  <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {stats[3]?.value || 8}
                  </span>
                  <Badge
                    variant="secondary"
                    className="bg-green-500/20 text-xs text-green-600 dark:text-green-400"
                  >
                    +3 新增
                  </Badge>
                </div>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  解锁徽章
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
                    d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                  />
                </svg>
              </div>
            </div>
          </EnhancedCard>
        </div>

        {/* 主要内容选项卡 */}
        <EnhancedCard variant="glow" className="p-8">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-5 border border-white/20 bg-white/10 dark:bg-white/5">
              <TabsTrigger
                value="overview"
                className="data-[state=active]:bg-white/20 data-[state=active]:text-gray-900 dark:data-[state=active]:text-white"
              >
                概览
              </TabsTrigger>
              <TabsTrigger
                value="progress"
                className="data-[state=active]:bg-white/20 data-[state=active]:text-gray-900 dark:data-[state=active]:text-white"
              >
                学习进度
              </TabsTrigger>
              <TabsTrigger
                value="calendar"
                className="data-[state=active]:bg-white/20 data-[state=active]:text-gray-900 dark:data-[state=active]:text-white"
              >
                学习日历
              </TabsTrigger>
              <TabsTrigger
                value="achievements"
                className="data-[state=active]:bg-white/20 data-[state=active]:text-gray-900 dark:data-[state=active]:text-white"
              >
                成就
              </TabsTrigger>
              <TabsTrigger
                value="settings"
                className="data-[state=active]:bg-white/20 data-[state=active]:text-gray-900 dark:data-[state=active]:text-white"
              >
                设置
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-6">
              <div className="grid grid-cols-1 gap-8">
                <Card>
                  <CardContent className="p-6">
                    <ProgressChart
                      data={progressData}
                      courseProgress={courseProgress}
                      timeRange={timeRange}
                      onTimeRangeChange={handleTimeRangeChange}
                    />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="progress" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <ProgressChart
                    data={progressData}
                    courseProgress={courseProgress}
                    timeRange={timeRange}
                    onTimeRangeChange={handleTimeRangeChange}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="calendar" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <LearningCalendar
                    data={learningCalendarData}
                    currentDate={new Date()}
                    onDateSelect={() => {
                      /* TODO: 处理日期选择 */
                    }}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="achievements" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <Achievements
                    achievements={achievements}
                    totalPoints={1250}
                    level={5}
                    nextLevelProgress={65}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="mt-6">
              <Settings />
            </TabsContent>

          </Tabs>
        </EnhancedCard>
      </div>
    </div>
  );
}
