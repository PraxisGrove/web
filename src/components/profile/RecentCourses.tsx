'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Play, Clock, BookOpen, MoreHorizontal, Star } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Progress,
  Badge,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  AnimatedContainer,
} from '@/components/unified';

interface RecentCourse {
  id: string;
  title: string;
  instructor: string;
  thumbnail?: string;
  progress: number;
  totalLessons: number;
  completedLessons: number;
  lastAccessedAt: string;
  nextLesson?: {
    id: string;
    title: string;
    duration: number;
  };
  rating?: number;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

interface RecentCoursesProps {
  courses: RecentCourse[];
  maxItems?: number;
  showViewAll?: boolean;
  onContinueLearning?: (courseId: string, lessonId?: string) => void;
  className?: string;
}

/**
 * 最近学习课程展示组件
 * 包括进度条和快速访问
 */
export function RecentCourses({
  courses,
  maxItems = 5,
  showViewAll = true,
  onContinueLearning,
  className = '',
}: RecentCoursesProps) {
  const displayCourses = courses.slice(0, maxItems);

  // 格式化时间
  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}小时${mins > 0 ? `${mins}分钟` : ''}`;
    }
    return `${mins}分钟`;
  };

  // 格式化最后访问时间
  const formatLastAccessed = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) {
      return '刚刚';
    } else if (diffInHours < 24) {
      return `${diffInHours}小时前`;
    } else if (diffInHours < 48) {
      return '昨天';
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}天前`;
    }
  };

  // 获取难度标签颜色
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'advanced':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  // 获取难度文本
  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return '初级';
      case 'intermediate':
        return '中级';
      case 'advanced':
        return '高级';
      default:
        return difficulty;
    }
  };

  // 处理继续学习
  const handleContinueLearning = (course: RecentCourse) => {
    if (onContinueLearning) {
      onContinueLearning(course.id, course.nextLesson?.id);
    } else {
      // 默认跳转到学习页面
      const url = course.nextLesson
        ? `/learn/${course.id}?lesson=${course.nextLesson.id}`
        : `/learn/${course.id}`;
      window.location.href = url;
    }
  };

  if (displayCourses.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            最近学习
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="py-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
              <BookOpen className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-white">
              还没有学习记录
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              开始学习第一门课程吧！
            </p>
            <Link href="/courses">
              <Button className="mt-4">浏览课程</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            最近学习
          </CardTitle>
          {showViewAll && (
            <Link href="/profile/courses">
              <Button variant="ghost" size="sm">
                查看全部
              </Button>
            </Link>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {displayCourses.map((course, index) => (
          <AnimatedContainer
            key={course.id}
            animation="slideUp"
            delay={0.1 * index}
          >
            <div className="group rounded-lg border border-gray-200 p-4 transition-all hover:shadow-md dark:border-gray-700">
              <div className="flex items-start gap-4">
                {/* 课程缩略图 */}
                <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg">
                  {course.thumbnail ? (
                    <Image
                      src={course.thumbnail}
                      alt={course.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-400 to-purple-500">
                      <span className="text-lg font-bold text-white">
                        {course.title.charAt(0)}
                      </span>
                    </div>
                  )}
                  {/* 播放按钮覆盖层 */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 transition-all group-hover:bg-opacity-30">
                    <Play className="h-6 w-6 text-white opacity-0 transition-all group-hover:opacity-100" />
                  </div>
                </div>

                {/* 课程信息 */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between">
                    <div className="min-w-0 flex-1">
                      <h3 className="line-clamp-1 font-medium text-gray-900 dark:text-white">
                        {course.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {course.instructor}
                      </p>
                      <div className="mt-1 flex items-center gap-2">
                        <Badge
                          className={getDifficultyColor(course.difficulty)}
                        >
                          {getDifficultyText(course.difficulty)}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {course.category}
                        </Badge>
                        {course.rating && (
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span>{course.rating}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* 操作菜单 */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/courses/${course.id}`}>查看详情</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/learn/${course.id}`}>从头开始</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>移除记录</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {/* 进度信息 */}
                  <div className="mt-3 space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-300">
                        进度: {course.completedLessons}/{course.totalLessons}{' '}
                        课时
                      </span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {course.progress}%
                      </span>
                    </div>
                    <Progress value={course.progress} className="h-2" />
                  </div>

                  {/* 下一课时和操作 */}
                  <div className="mt-3 flex items-center justify-between">
                    <div className="min-w-0 flex-1">
                      {course.nextLesson ? (
                        <div className="text-sm">
                          <span className="text-gray-600 dark:text-gray-300">
                            下一课时:{' '}
                          </span>
                          <span className="line-clamp-1 font-medium text-gray-900 dark:text-white">
                            {course.nextLesson.title}
                          </span>
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <Clock className="h-3 w-3" />
                            <span>
                              {formatTime(course.nextLesson.duration)}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="text-sm text-green-600 dark:text-green-400">
                          ✅ 课程已完成
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">
                        {formatLastAccessed(course.lastAccessedAt)}
                      </span>
                      <Button
                        size="sm"
                        onClick={() => handleContinueLearning(course)}
                        disabled={!course.nextLesson}
                      >
                        <Play className="mr-1 h-3 w-3" />
                        {course.nextLesson ? '继续学习' : '已完成'}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </AnimatedContainer>
        ))}
      </CardContent>
    </Card>
  );
}

export default RecentCourses;
