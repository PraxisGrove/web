'use client';

import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Clock,
  BookOpen,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  AnimatedContainer,
} from '@/components/unified';

interface LearningDay {
  date: string;
  studyTime: number; // 分钟
  completedLessons: number;
  courses: Array<{
    id: string;
    name: string;
    progress: number;
    color: string;
  }>;
  streak?: boolean; // 是否为连续学习日
}

interface LearningCalendarProps {
  data: LearningDay[];
  currentDate?: Date;
  onDateSelect?: (date: Date) => void;
  className?: string;
}

/**
 * 学习日历组件
 * 展示每日学习时长和进度
 */
export function LearningCalendar({
  data,
  currentDate = new Date(),
  onDateSelect,
  className = '',
}: LearningCalendarProps) {
  const [viewDate, setViewDate] = useState(currentDate);

  // 获取当前月份的第一天和最后一天
  const firstDayOfMonth = new Date(
    viewDate.getFullYear(),
    viewDate.getMonth(),
    1
  );
  const lastDayOfMonth = new Date(
    viewDate.getFullYear(),
    viewDate.getMonth() + 1,
    0
  );

  // 获取日历开始日期（包含上个月的日期）
  const startDate = new Date(firstDayOfMonth);
  startDate.setDate(startDate.getDate() - firstDayOfMonth.getDay());

  // 获取日历结束日期（包含下个月的日期）
  const endDate = new Date(lastDayOfMonth);
  endDate.setDate(endDate.getDate() + (6 - lastDayOfMonth.getDay()));

  // 生成日历日期数组
  const calendarDays = [];
  const current = new Date(startDate);
  while (current <= endDate) {
    calendarDays.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }

  // 获取指定日期的学习数据
  const getLearningData = (date: Date): LearningDay | null => {
    const dateString = date.toISOString().split('T')[0];
    return data.find((item) => item.date === dateString) || null;
  };

  // 获取学习强度颜色
  const getIntensityColor = (studyTime: number) => {
    if (studyTime === 0) return 'bg-gray-100 dark:bg-gray-800';
    if (studyTime < 30) return 'bg-green-100 dark:bg-green-900';
    if (studyTime < 60) return 'bg-green-300 dark:bg-green-700';
    if (studyTime < 120) return 'bg-green-500 dark:bg-green-600';
    return 'bg-green-700 dark:bg-green-500';
  };

  // 格式化时间
  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}小时${mins > 0 ? `${mins}分钟` : ''}`;
    }
    return `${mins}分钟`;
  };

  // 格式化月份
  const formatMonth = (date: Date) => {
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
    });
  };

  // 上一个月
  const previousMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  };

  // 下一个月
  const nextMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
  };

  // 是否为今天
  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  // 是否为当前月份
  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === viewDate.getMonth();
  };

  // 计算学习统计
  const currentMonthData = data.filter((item) => {
    const itemDate = new Date(item.date);
    return (
      itemDate.getMonth() === viewDate.getMonth() &&
      itemDate.getFullYear() === viewDate.getFullYear()
    );
  });

  const totalStudyTime = currentMonthData.reduce(
    (sum, item) => sum + item.studyTime,
    0
  );
  const totalLessons = currentMonthData.reduce(
    (sum, item) => sum + item.completedLessons,
    0
  );
  const studyDays = currentMonthData.filter(
    (item) => item.studyTime > 0
  ).length;
  const longestStreak = calculateLongestStreak(currentMonthData);

  // 计算最长连续学习天数
  function calculateLongestStreak(data: LearningDay[]): number {
    let maxStreak = 0;
    let currentStreak = 0;

    const sortedData = data.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    for (let i = 0; i < sortedData.length; i++) {
      if (sortedData[i].studyTime > 0) {
        currentStreak++;
        maxStreak = Math.max(maxStreak, currentStreak);
      } else {
        currentStreak = 0;
      }
    }

    return maxStreak;
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* 月度统计 */}
      <AnimatedContainer animation="slideUp" delay={0.1}>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                  {formatTime(totalStudyTime)}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-300">
                  本月学习时间
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-lg font-bold text-green-600 dark:text-green-400">
                  {totalLessons}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-300">
                  完成课时
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-lg font-bold text-purple-600 dark:text-purple-400">
                  {studyDays}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-300">
                  学习天数
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-lg font-bold text-orange-600 dark:text-orange-400">
                  {longestStreak}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-300">
                  最长连续
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </AnimatedContainer>

      {/* 日历 */}
      <AnimatedContainer animation="slideUp" delay={0.2}>
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5" />
                学习日历
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={previousMonth}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="min-w-[120px] text-center font-medium">
                  {formatMonth(viewDate)}
                </span>
                <Button variant="outline" size="sm" onClick={nextMonth}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* 星期标题 */}
              <div className="grid grid-cols-7 gap-1">
                {['日', '一', '二', '三', '四', '五', '六'].map((day) => (
                  <div
                    key={day}
                    className="p-2 text-center text-sm font-medium text-gray-600 dark:text-gray-300"
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* 日历网格 */}
              <div className="grid grid-cols-7 gap-1">
                {calendarDays.map((date, index) => {
                  const learningData = getLearningData(date);
                  const hasData = learningData && learningData.studyTime > 0;
                  const intensityColor = getIntensityColor(
                    learningData?.studyTime || 0
                  );

                  return (
                    <TooltipProvider key={index}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            onClick={() => onDateSelect?.(date)}
                            className={`
                              relative h-12 w-full rounded-lg border transition-all hover:scale-105
                              ${
                                isCurrentMonth(date)
                                  ? 'border-gray-200 dark:border-gray-700'
                                  : 'border-gray-100 opacity-50 dark:border-gray-800'
                              }
                              ${
                                isToday(date)
                                  ? 'ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-gray-900'
                                  : ''
                              }
                              ${intensityColor}
                            `}
                          >
                            <div className="flex h-full flex-col items-center justify-center">
                              <span
                                className={`text-sm font-medium ${
                                  isCurrentMonth(date)
                                    ? 'text-gray-900 dark:text-white'
                                    : 'text-gray-400 dark:text-gray-600'
                                }`}
                              >
                                {date.getDate()}
                              </span>
                              {hasData && (
                                <div className="mt-1 flex gap-1">
                                  {learningData.completedLessons > 0 && (
                                    <div className="h-1 w-1 rounded-full bg-white" />
                                  )}
                                  {learningData.streak && (
                                    <div className="h-1 w-1 rounded-full bg-yellow-400" />
                                  )}
                                </div>
                              )}
                            </div>
                          </button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <div className="space-y-1">
                            <div className="font-medium">
                              {date.toLocaleDateString('zh-CN')}
                            </div>
                            {learningData ? (
                              <>
                                <div className="flex items-center gap-1 text-sm">
                                  <Clock className="h-3 w-3" />
                                  {formatTime(learningData.studyTime)}
                                </div>
                                <div className="flex items-center gap-1 text-sm">
                                  <BookOpen className="h-3 w-3" />
                                  {learningData.completedLessons} 课时
                                </div>
                                {learningData.courses.length > 0 && (
                                  <div className="space-y-1">
                                    {learningData.courses.map((course, idx) => (
                                      <div
                                        key={idx}
                                        className="flex items-center gap-1 text-xs"
                                      >
                                        <div
                                          className="h-2 w-2 rounded-full"
                                          style={{
                                            backgroundColor: course.color,
                                          }}
                                        />
                                        {course.name}
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </>
                            ) : (
                              <div className="text-sm text-gray-500">
                                未学习
                              </div>
                            )}
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  );
                })}
              </div>

              {/* 图例 */}
              <div className="flex items-center justify-center gap-4 text-xs text-gray-600 dark:text-gray-300">
                <div className="flex items-center gap-1">
                  <div className="h-3 w-3 rounded bg-gray-100 dark:bg-gray-800" />
                  <span>无学习</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="h-3 w-3 rounded bg-green-100 dark:bg-green-900" />
                  <span>少量</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="h-3 w-3 rounded bg-green-300 dark:bg-green-700" />
                  <span>适中</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="h-3 w-3 rounded bg-green-500 dark:bg-green-600" />
                  <span>较多</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="h-3 w-3 rounded bg-green-700 dark:bg-green-500" />
                  <span>很多</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </AnimatedContainer>
    </div>
  );
}

export default LearningCalendar;
