'use client';

import React from 'react';
import {
  TrendingUp,
  TrendingDown,
  Clock,
  BookOpen,
  Target,
  Award,
  Calendar,
  Users,
  Star,
  Zap,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  Progress,
  AnimatedContainer,
  GradientText,
} from '@/components/unified';

interface StatItem {
  id: string;
  title: string;
  value: string | number;
  unit?: string;
  change?: {
    value: number;
    type: 'increase' | 'decrease' | 'neutral';
    period: string;
  };
  progress?: {
    current: number;
    total: number;
    label?: string;
  };
  icon: string;
  color: string;
  bgColor: string;
}

interface LearningStatsProps {
  stats: StatItem[];
  className?: string;
}

/**
 * 学习统计卡片组件
 * 展示关键指标和数据
 */
export function LearningStats({ stats, className = '' }: LearningStatsProps) {
  // 获取图标组件
  const getIcon = (iconName: string) => {
    const iconMap: { [key: string]: React.ComponentType<any> } = {
      TrendingUp,
      TrendingDown,
      Clock,
      BookOpen,
      Target,
      Award,
      Calendar,
      Users,
      Star,
      Zap,
    };
    return iconMap[iconName] || BookOpen;
  };

  // 格式化数值
  const formatValue = (value: string | number) => {
    if (typeof value === 'number') {
      // 如果是大数字，使用简化格式
      if (value >= 1000000) {
        return `${(value / 1000000).toFixed(1)}M`;
      } else if (value >= 1000) {
        return `${(value / 1000).toFixed(1)}K`;
      }
      return value.toString();
    }
    return value;
  };

  // 获取变化趋势图标和颜色
  const getTrendIcon = (type: 'increase' | 'decrease' | 'neutral') => {
    switch (type) {
      case 'increase':
        return { icon: TrendingUp, color: 'text-green-500' };
      case 'decrease':
        return { icon: TrendingDown, color: 'text-red-500' };
      default:
        return { icon: TrendingUp, color: 'text-gray-500' };
    }
  };

  return (
    <div
      className={`grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ${className}`}
    >
      {stats.map((stat, index) => {
        const IconComponent = getIcon(stat.icon);
        const trendInfo = stat.change ? getTrendIcon(stat.change.type) : null;
        const TrendIcon = trendInfo?.icon;

        return (
          <AnimatedContainer
            key={stat.id}
            animation="slideUp"
            delay={0.1 * index}
          >
            <Card className="relative overflow-hidden transition-all duration-300 hover:shadow-lg">
              {/* 背景装饰 */}
              <div
                className={`absolute -right-4 -top-4 h-24 w-24 rounded-full opacity-10 ${stat.bgColor}`}
              />

              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-lg ${stat.bgColor}`}
                  >
                    <IconComponent className={`h-5 w-5 ${stat.color}`} />
                  </div>
                  {stat.change && TrendIcon && (
                    <div
                      className={`flex items-center gap-1 ${trendInfo?.color}`}
                    >
                      <TrendIcon className="h-4 w-4" />
                      <span className="text-sm font-medium">
                        {stat.change.value > 0 ? '+' : ''}
                        {stat.change.value}%
                      </span>
                    </div>
                  )}
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <div className="space-y-3">
                  {/* 主要数值 */}
                  <div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-bold text-gray-900 dark:text-white">
                        <GradientText>{formatValue(stat.value)}</GradientText>
                      </span>
                      {stat.unit && (
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {stat.unit}
                        </span>
                      )}
                    </div>
                    <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300">
                      {stat.title}
                    </h3>
                  </div>

                  {/* 变化信息 */}
                  {stat.change && (
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      相比{stat.change.period}
                    </div>
                  )}

                  {/* 进度条 */}
                  {stat.progress && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-600 dark:text-gray-300">
                          {stat.progress.label || '进度'}
                        </span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {stat.progress.current}/{stat.progress.total}
                        </span>
                      </div>
                      <Progress
                        value={
                          (stat.progress.current / stat.progress.total) * 100
                        }
                        className="h-2"
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </AnimatedContainer>
        );
      })}
    </div>
  );
}

// 预定义的统计项配置
export const defaultLearningStats: StatItem[] = [
  {
    id: 'total-time',
    title: '总学习时间',
    value: 0,
    unit: '小时',
    change: {
      value: 12,
      type: 'increase',
      period: '上周',
    },
    icon: 'Clock',
    color: 'text-blue-600',
    bgColor: 'bg-blue-100 dark:bg-blue-900',
  },
  {
    id: 'completed-courses',
    title: '完成课程',
    value: 0,
    unit: '门',
    change: {
      value: 2,
      type: 'increase',
      period: '上月',
    },
    icon: 'BookOpen',
    color: 'text-green-600',
    bgColor: 'bg-green-100 dark:bg-green-900',
  },
  {
    id: 'current-streak',
    title: '连续学习',
    value: 0,
    unit: '天',
    change: {
      value: 5,
      type: 'increase',
      period: '本周',
    },
    icon: 'Target',
    color: 'text-purple-600',
    bgColor: 'bg-purple-100 dark:bg-purple-900',
  },
  {
    id: 'achievements',
    title: '获得成就',
    value: 0,
    unit: '个',
    progress: {
      current: 0,
      total: 50,
      label: '成就进度',
    },
    icon: 'Award',
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100 dark:bg-yellow-900',
  },
  {
    id: 'study-days',
    title: '学习天数',
    value: 0,
    unit: '天',
    change: {
      value: 8,
      type: 'increase',
      period: '上月',
    },
    icon: 'Calendar',
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-100 dark:bg-indigo-900',
  },
  {
    id: 'average-rating',
    title: '平均评分',
    value: 0,
    unit: '分',
    change: {
      value: 0.2,
      type: 'increase',
      period: '上月',
    },
    icon: 'Star',
    color: 'text-orange-600',
    bgColor: 'bg-orange-100 dark:bg-orange-900',
  },
  {
    id: 'learning-speed',
    title: '学习效率',
    value: 0,
    unit: '课时/天',
    change: {
      value: 15,
      type: 'increase',
      period: '上周',
    },
    icon: 'Zap',
    color: 'text-pink-600',
    bgColor: 'bg-pink-100 dark:bg-pink-900',
  },
  {
    id: 'certificates',
    title: '获得证书',
    value: 0,
    unit: '张',
    progress: {
      current: 0,
      total: 10,
      label: '证书进度',
    },
    icon: 'Award',
    color: 'text-teal-600',
    bgColor: 'bg-teal-100 dark:bg-teal-900',
  },
];

export default LearningStats;
