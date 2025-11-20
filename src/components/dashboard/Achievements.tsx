'use client';

import React, { useState } from 'react';
import {
  Trophy,
  Star,
  Target,
  Clock,
  BookOpen,
  Award,
  Lock,
  CheckCircle,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Badge,
  Progress,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  AnimatedContainer,
  GradientText,
} from '@/components/unified';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'learning' | 'time' | 'streak' | 'course' | 'special';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  isUnlocked: boolean;
  unlockedAt?: string;
  progress: number;
  maxProgress: number;
  reward?: {
    type: 'badge' | 'points' | 'certificate';
    value: string | number;
  };
}

interface AchievementsProps {
  achievements: Achievement[];
  totalPoints?: number;
  level?: number;
  nextLevelProgress?: number;
  className?: string;
}

/**
 * 成就展示组件
 * 包括成就徽章、解锁条件、进度显示等
 */
export function Achievements({
  achievements,
  totalPoints = 0,
  level = 1,
  nextLevelProgress = 0,
  className = '',
}: AchievementsProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // 成就分类
  const categories = [
    { id: 'all', name: '全部', icon: Trophy },
    { id: 'learning', name: '学习', icon: BookOpen },
    { id: 'time', name: '时间', icon: Clock },
    { id: 'streak', name: '连续', icon: Target },
    { id: 'course', name: '课程', icon: Star },
    { id: 'special', name: '特殊', icon: Award },
  ];

  // 稀有度配置
  const rarityConfig = {
    common: {
      name: '普通',
      color: 'text-gray-600 dark:text-gray-400',
      bgColor: 'bg-gray-100 dark:bg-gray-800',
      borderColor: 'border-gray-300 dark:border-gray-600',
    },
    rare: {
      name: '稀有',
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-100 dark:bg-blue-900',
      borderColor: 'border-blue-300 dark:border-blue-600',
    },
    epic: {
      name: '史诗',
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-100 dark:bg-purple-900',
      borderColor: 'border-purple-300 dark:border-purple-600',
    },
    legendary: {
      name: '传说',
      color: 'text-yellow-600 dark:text-yellow-400',
      bgColor: 'bg-yellow-100 dark:bg-yellow-900',
      borderColor: 'border-yellow-300 dark:border-yellow-600',
    },
  };

  // 获取图标组件
  const getIcon = (iconName: string) => {
    const iconMap: { [key: string]: React.ComponentType<any> } = {
      Trophy,
      Star,
      Target,
      Clock,
      BookOpen,
      Award,
      CheckCircle,
    };
    return iconMap[iconName] || Trophy;
  };

  // 过滤成就
  const filteredAchievements = achievements.filter(
    (achievement) =>
      selectedCategory === 'all' || achievement.category === selectedCategory
  );

  // 统计数据
  const unlockedCount = achievements.filter((a) => a.isUnlocked).length;
  const totalCount = achievements.length;
  const completionRate = Math.round((unlockedCount / totalCount) * 100);

  // 按稀有度分组
  const achievementsByRarity = filteredAchievements.reduce(
    (acc, achievement) => {
      if (!acc[achievement.rarity]) {
        acc[achievement.rarity] = [];
      }
      acc[achievement.rarity].push(achievement);
      return acc;
    },
    {} as Record<string, Achievement[]>
  );

  // 格式化日期
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* 成就概览 */}
      <AnimatedContainer animation="slideUp" delay={0.1}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              <GradientText>成就系统</GradientText>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                  {unlockedCount}/{totalCount}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  已解锁成就
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {completionRate}%
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  完成度
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {totalPoints}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  总积分
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  Lv.{level}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  当前等级
                </div>
                <Progress value={nextLevelProgress} className="mt-2 h-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      </AnimatedContainer>

      {/* 成就分类 */}
      <AnimatedContainer animation="slideUp" delay={0.2}>
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
          <TabsList className="grid w-full grid-cols-6">
            {categories.map((category) => {
              const IconComponent = category.icon;
              return (
                <TabsTrigger
                  key={category.id}
                  value={category.id}
                  className="flex items-center gap-1"
                >
                  <IconComponent className="h-4 w-4" />
                  <span className="hidden sm:inline">{category.name}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>

          <TabsContent value={selectedCategory} className="mt-6">
            <div className="space-y-6">
              {Object.entries(achievementsByRarity).map(
                ([rarity, achievements]) => {
                  const config =
                    rarityConfig[rarity as keyof typeof rarityConfig];
                  return (
                    <div key={rarity}>
                      <div className="mb-4 flex items-center gap-2">
                        <Badge className={`${config.color} ${config.bgColor}`}>
                          {config.name}
                        </Badge>
                        <span className="text-sm text-gray-500">
                          {achievements.length} 个成就
                        </span>
                      </div>
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {achievements.map((achievement, index) => {
                          const IconComponent = getIcon(achievement.icon);
                          return (
                            <AnimatedContainer
                              key={achievement.id}
                              animation="slideUp"
                              delay={0.1 * index}
                            >
                              <Card
                                className={`
                              relative transition-all duration-300 hover:shadow-lg
                              ${
                                achievement.isUnlocked
                                  ? `${config.borderColor} border-2`
                                  : 'border-gray-200 opacity-75 dark:border-gray-700'
                              }
                            `}
                              >
                                <CardContent className="p-6">
                                  <div className="flex items-start gap-4">
                                    <div
                                      className={`
                                    flex h-12 w-12 items-center justify-center rounded-full
                                    ${
                                      achievement.isUnlocked
                                        ? config.bgColor
                                        : 'bg-gray-100 dark:bg-gray-800'
                                    }
                                  `}
                                    >
                                      {achievement.isUnlocked ? (
                                        <IconComponent
                                          className={`h-6 w-6 ${config.color}`}
                                        />
                                      ) : (
                                        <Lock className="h-6 w-6 text-gray-400" />
                                      )}
                                    </div>
                                    <div className="flex-1">
                                      <h3
                                        className={`font-semibold ${
                                          achievement.isUnlocked
                                            ? 'text-gray-900 dark:text-white'
                                            : 'text-gray-500 dark:text-gray-400'
                                        }`}
                                      >
                                        {achievement.title}
                                      </h3>
                                      <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                                        {achievement.description}
                                      </p>

                                      {/* 进度条 */}
                                      {!achievement.isUnlocked && (
                                        <div className="mt-3">
                                          <div className="mb-1 flex justify-between text-xs">
                                            <span>进度</span>
                                            <span>
                                              {achievement.progress}/
                                              {achievement.maxProgress}
                                            </span>
                                          </div>
                                          <Progress
                                            value={
                                              (achievement.progress /
                                                achievement.maxProgress) *
                                              100
                                            }
                                            className="h-2"
                                          />
                                        </div>
                                      )}

                                      {/* 解锁时间 */}
                                      {achievement.isUnlocked &&
                                        achievement.unlockedAt && (
                                          <div className="mt-2 text-xs text-gray-500">
                                            解锁于{' '}
                                            {formatDate(achievement.unlockedAt)}
                                          </div>
                                        )}

                                      {/* 奖励 */}
                                      {achievement.reward && (
                                        <div className="mt-2">
                                          <Badge
                                            variant="outline"
                                            className="text-xs"
                                          >
                                            {achievement.reward.type ===
                                              'points' &&
                                              `+${achievement.reward.value} 积分`}
                                            {achievement.reward.type ===
                                              'badge' &&
                                              `徽章: ${achievement.reward.value}`}
                                            {achievement.reward.type ===
                                              'certificate' &&
                                              `证书: ${achievement.reward.value}`}
                                          </Badge>
                                        </div>
                                      )}
                                    </div>
                                  </div>

                                  {/* 已解锁标识 */}
                                  {achievement.isUnlocked && (
                                    <div className="absolute -right-2 -top-2">
                                      <div
                                        className={`
                                      flex h-8 w-8 items-center justify-center rounded-full
                                      ${config.bgColor} ${config.borderColor} border-2
                                    `}
                                      >
                                        <CheckCircle
                                          className={`h-4 w-4 ${config.color}`}
                                        />
                                      </div>
                                    </div>
                                  )}
                                </CardContent>
                              </Card>
                            </AnimatedContainer>
                          );
                        })}
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          </TabsContent>
        </Tabs>
      </AnimatedContainer>
    </div>
  );
}

export default Achievements;
