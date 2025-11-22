'use client';

import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  LineChart,
  Line,
} from 'recharts';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  AnimatedContainer,
} from '@/components/unified';

interface ProgressData {
  date: string;
  studyTime: number;
  completedLessons: number;
  progress: number;
}

interface CourseProgress {
  name: string;
  progress: number;
  color: string;
}

interface ProgressChartProps {
  data: ProgressData[];
  courseProgress: CourseProgress[];
  timeRange?: '7d' | '30d' | '90d' | '1y';
  onTimeRangeChange?: (range: '7d' | '30d' | '90d' | '1y') => void;
  className?: string;
}

/**
 * 学习进度统计图表组件
 * 使用 recharts 展示学习数据
 */
export function ProgressChart({
  data,
  courseProgress,
  timeRange = '30d',
  onTimeRangeChange,
  className = '',
}: ProgressChartProps) {
  // 时间范围选项
  const timeRangeOptions = [
    { value: '7d', label: '最近7天' },
    { value: '30d', label: '最近30天' },
    { value: '90d', label: '最近90天' },
    { value: '1y', label: '最近1年' },
  ];

  // 自定义 Tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border bg-white p-3 shadow-lg dark:border-gray-700 dark:bg-gray-800">
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {label}
          </p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value}
              {entry.dataKey === 'studyTime' && ' 分钟'}
              {entry.dataKey === 'completedLessons' && ' 课时'}
              {entry.dataKey === 'progress' && '%'}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // 计算总学习时间
  const totalStudyTime = data.reduce((sum, item) => sum + item.studyTime, 0);
  const totalLessons = data.reduce(
    (sum, item) => sum + item.completedLessons,
    0
  );
  const averageProgress =
    data.length > 0
      ? Math.round(
          data.reduce((sum, item) => sum + item.progress, 0) / data.length
        )
      : 0;

  // 格式化时间
  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}小时${mins > 0 ? `${mins}分钟` : ''}`;
    }
    return `${mins}分钟`;
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* 统计概览 */}
      <AnimatedContainer animation="slideUp" delay={0.1}>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {formatTime(totalStudyTime)}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  总学习时间
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {totalLessons}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  完成课时
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {averageProgress}%
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  平均进度
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </AnimatedContainer>

      {/* 学习时间趋势图 */}
      <AnimatedContainer animation="slideUp" delay={0.2}>
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>学习时间趋势</CardTitle>
              <Select value={timeRange} onValueChange={onTimeRangeChange}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {timeRangeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis
                    dataKey="date"
                    className="text-xs"
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis className="text-xs" tick={{ fontSize: 12 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="studyTime"
                    stroke="#3b82f6"
                    fill="#3b82f6"
                    fillOpacity={0.2}
                    strokeWidth={2}
                    name="学习时间"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </AnimatedContainer>

      {/* 课程进度分布 */}
      <AnimatedContainer animation="slideUp" delay={0.3}>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* 饼图 */}
          <Card>
            <CardHeader>
              <CardTitle>课程进度分布</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={courseProgress}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="progress"
                      label={({ name, progress }) => `${name}: ${progress}%`}
                      labelLine={false}
                    >
                      {courseProgress.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* 柱状图 */}
          <Card>
            <CardHeader>
              <CardTitle>每日完成课时</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      className="opacity-30"
                    />
                    <XAxis
                      dataKey="date"
                      className="text-xs"
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis className="text-xs" tick={{ fontSize: 12 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar
                      dataKey="completedLessons"
                      fill="#10b981"
                      radius={[4, 4, 0, 0]}
                      name="完成课时"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </AnimatedContainer>

      {/* 学习进度趋势 */}
      <AnimatedContainer animation="slideUp" delay={0.4}>
        <Card>
          <CardHeader>
            <CardTitle>学习进度趋势</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis
                    dataKey="date"
                    className="text-xs"
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis
                    domain={[0, 100]}
                    className="text-xs"
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="progress"
                    stroke="#8b5cf6"
                    strokeWidth={3}
                    dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: '#8b5cf6', strokeWidth: 2 }}
                    name="学习进度"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </AnimatedContainer>
    </div>
  );
}

export default ProgressChart;
