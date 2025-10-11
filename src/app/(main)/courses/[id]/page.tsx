'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Image from 'next/image';
import {
  Clock,
  Users,
  Star,
  Award,
  Globe,
  Infinity,
  PlayCircle,
  BookOpen,
  MessageSquare,
  Share2,
  Heart,
  ShoppingCart,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { useCourse, useRelatedCourses } from '@/hooks/useCourses';
import { CourseCard } from '@/components/courses/CourseCard';
import type { Chapter } from '@/types/course';

export default function CourseDetailPage() {
  const params = useParams();
  const courseId = params.id as string;
  const { course, loading, error } = useCourse(courseId);
  const { courses: relatedCourses } = useRelatedCourses(courseId, 4);
  const [expandedChapters, setExpandedChapters] = useState<Set<string>>(new Set());

  const toggleChapter = (chapterId: string) => {
    setExpandedChapters(prev => {
      const next = new Set(prev);
      if (next.has(chapterId)) {
        next.delete(chapterId);
      } else {
        next.add(chapterId);
      }
      return next;
    });
  };

  if (loading) {
    return <CourseDetailSkeleton />;
  }

  if (error || !course) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p className="text-destructive">课程加载失败</p>
        <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
          重试
        </Button>
      </div>
    );
  }

  const categoryNames: Record<string, string> = {
    frontend: '前端开发',
    backend: '后端开发',
    fullstack: '全栈开发',
    mobile: '移动开发',
    'data-science': '数据科学',
    'ai-ml': 'AI & 机器学习',
    design: '设计',
    business: '商业技能',
  };

  const levelNames: Record<string, string> = {
    beginner: '初级',
    intermediate: '中级',
    advanced: '高级',
  };

  const discount = course.originalPrice
    ? Math.round(((course.originalPrice - course.price) / course.originalPrice) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-background">
      {/* 课程头部 */}
      <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-background border-b">
        <div className="container mx-auto px-4 py-12">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* 左侧信息 */}
            <div className="lg:col-span-2 space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="outline">{categoryNames[course.category]}</Badge>
                  <Badge variant="secondary">{levelNames[course.level]}</Badge>
                  {course.stats.totalStudents > 10000 && (
                    <Badge className="bg-amber-500">畅销课程</Badge>
                  )}
                </div>

                <h1 className="text-3xl md:text-4xl font-bold">{course.title}</h1>
                <p className="text-lg text-muted-foreground">{course.subtitle}</p>

                {/* 评分和统计 */}
                <div className="flex items-center gap-6 flex-wrap">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${
                            i < Math.floor(course.rating)
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="font-semibold">{course.rating.toFixed(1)}</span>
                    <span className="text-muted-foreground">
                      ({course.reviewCount.toLocaleString()} 评价)
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Users className="w-5 h-5" />
                    <span>{course.stats.totalStudents.toLocaleString()} 学生</span>
                  </div>

                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="w-5 h-5" />
                    <span>{Math.floor(course.totalDuration / 60)} 小时课程</span>
                  </div>
                </div>

                {/* 讲师信息 */}
                <div className="flex items-center gap-3">
                  <Image
                    src={course.instructor.avatar}
                    alt={course.instructor.name}
                    width={48}
                    height={48}
                    className="rounded-full"
                  />
                  <div>
                    <p className="text-sm text-muted-foreground">授课讲师</p>
                    <p className="font-semibold">{course.instructor.name}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 右侧购买卡片 */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardContent className="p-6 space-y-6">
                  {/* 预览图 */}
                  <div className="relative aspect-video rounded-lg overflow-hidden">
                    <Image
                      src={course.thumbnail}
                      alt={course.title}
                      fill
                      className="object-cover"
                    />
                    {course.previewVideo && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center cursor-pointer hover:bg-black/40 transition-colors">
                        <PlayCircle className="w-16 h-16 text-white" />
                      </div>
                    )}
                  </div>

                  {/* 价格 */}
                  <div className="space-y-2">
                    <div className="flex items-baseline gap-3">
                      <span className="text-3xl font-bold">¥{course.price}</span>
                      {course.originalPrice && (
                        <>
                          <span className="text-lg text-muted-foreground line-through">
                            ¥{course.originalPrice}
                          </span>
                          <Badge variant="destructive">-{discount}%</Badge>
                        </>
                      )}
                    </div>
                    {discount > 0 && (
                      <p className="text-sm text-destructive">限时优惠，即将恢复原价</p>
                    )}
                  </div>

                  {/* 操作按钮 */}
                  <div className="space-y-3">
                    <Button className="w-full h-12 text-lg" size="lg">
                      <ShoppingCart className="w-5 h-5 mr-2" />
                      加入购物车
                    </Button>
                    <Button variant="outline" className="w-full" size="lg">
                      <Heart className="w-5 h-5 mr-2" />
                      收藏课程
                    </Button>
                  </div>

                  {/* 课程包含 */}
                  <div className="space-y-3 text-sm">
                    <p className="font-semibold">本课程包含：</p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span>{Math.floor(course.totalDuration / 60)} 小时点播视频</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-muted-foreground" />
                        <span>{course.totalLessons} 个课时</span>
                      </div>
                      {course.certificate && (
                        <div className="flex items-center gap-2">
                          <Award className="w-4 h-4 text-muted-foreground" />
                          <span>完成证书</span>
                        </div>
                      )}
                      {course.lifetime && (
                        <div className="flex items-center gap-2">
                          <Infinity className="w-4 h-4 text-muted-foreground" />
                          <span>终身访问权限</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-muted-foreground" />
                        <span>{course.subtitles.join(', ')} 字幕</span>
                      </div>
                    </div>
                  </div>

                  {/* 分享 */}
                  <Button variant="ghost" className="w-full">
                    <Share2 className="w-4 h-4 mr-2" />
                    分享课程
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* 课程内容 */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* 主要内容 */}
          <div className="lg:col-span-2 space-y-8">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">概述</TabsTrigger>
                <TabsTrigger value="curriculum">课程大纲</TabsTrigger>
                <TabsTrigger value="instructor">讲师</TabsTrigger>
                <TabsTrigger value="reviews">评价</TabsTrigger>
              </TabsList>

              {/* 概述 */}
              <TabsContent value="overview" className="space-y-6 mt-6">
                <div>
                  <h2 className="text-2xl font-bold mb-4">课程描述</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    {course.description}
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold mb-4">学习成果</h2>
                  <ul className="space-y-2">
                    {course.learningOutcomes.map((outcome, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-primary mt-1">✓</span>
                        <span>{outcome}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h2 className="text-2xl font-bold mb-4">课程要求</h2>
                  <ul className="space-y-2">
                    {course.requirements.map((req, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-muted-foreground mt-1">•</span>
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h2 className="text-2xl font-bold mb-4">适合人群</h2>
                  <ul className="space-y-2">
                    {course.targetAudience.map((audience, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-primary mt-1">→</span>
                        <span>{audience}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </TabsContent>

              {/* 课程大纲 */}
              <TabsContent value="curriculum" className="mt-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold">课程大纲</h2>
                    <p className="text-muted-foreground">
                      {course.chapters.length} 章节 · {course.totalLessons} 课时
                    </p>
                  </div>

                  {course.chapters.map((chapter, index) => (
                    <ChapterItem
                      key={chapter.id}
                      chapter={chapter}
                      chapterNumber={index + 1}
                      isExpanded={expandedChapters.has(chapter.id)}
                      onToggle={() => toggleChapter(chapter.id)}
                    />
                  ))}
                </div>
              </TabsContent>

              {/* 讲师信息 */}
              <TabsContent value="instructor" className="mt-6">
                <InstructorSection instructor={course.instructor} />
              </TabsContent>

              {/* 评价 */}
              <TabsContent value="reviews" className="mt-6">
                <ReviewsSection stats={course.stats} />
              </TabsContent>
            </Tabs>
          </div>

          {/* 侧边栏 - 标签和相关课程 */}
          <div className="space-y-8">
            {/* 标签 */}
            <div>
              <h3 className="font-semibold mb-3">课程标签</h3>
              <div className="flex flex-wrap gap-2">
                {course.tags.map(tag => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            {/* 相关课程 */}
            {relatedCourses.length > 0 && (
              <div>
                <h3 className="font-semibold mb-4">相关推荐</h3>
                <div className="space-y-4">
                  {relatedCourses.map(course => (
                    <CourseCard key={course.id} course={course} layout="list" />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// 章节组件
function ChapterItem({
  chapter,
  chapterNumber,
  isExpanded,
  onToggle,
}: {
  chapter: Chapter;
  chapterNumber: number;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  return (
    <Card>
      <CardContent className="p-0">
        <button
          onClick={onToggle}
          className="w-full p-4 flex items-center justify-between hover:bg-accent/50 transition-colors"
        >
          <div className="flex items-center gap-3 text-left">
            <span className="font-semibold">第{chapterNumber}章</span>
            <span className="font-medium">{chapter.title}</span>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>{chapter.lessonCount} 课时</span>
            <span>{Math.floor(chapter.duration / 60)} 分钟</span>
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              ▼
            </motion.div>
          </div>
        </button>

        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t"
          >
            <div className="p-4 space-y-2">
              {chapter.lessons.map((lesson, index) => (
                <div
                  key={lesson.id}
                  className="flex items-center justify-between py-2 hover:bg-accent/30 rounded px-2 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <PlayCircle className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{lesson.title}</span>
                    {lesson.isPreview && (
                      <Badge variant="outline" className="text-xs">
                        预览
                      </Badge>
                    )}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {lesson.duration} 分钟
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}

// 讲师信息组件
function InstructorSection({ instructor }: { instructor: any }) {
  return (
    <div className="space-y-6">
      <div className="flex items-start gap-4">
        <Image
          src={instructor.avatar}
          alt={instructor.name}
          width={80}
          height={80}
          className="rounded-full"
        />
        <div className="space-y-2">
          <h3 className="text-xl font-bold">{instructor.name}</h3>
          <p className="text-muted-foreground">{instructor.title}</p>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span>{instructor.rating.toFixed(1)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>{instructor.studentCount.toLocaleString()} 学生</span>
            </div>
            <div className="flex items-center gap-1">
              <BookOpen className="w-4 h-4" />
              <span>{instructor.courseCount} 课程</span>
            </div>
          </div>
        </div>
      </div>

      <p className="text-muted-foreground leading-relaxed">{instructor.bio}</p>

      <div>
        <h4 className="font-semibold mb-2">擅长领域</h4>
        <div className="flex flex-wrap gap-2">
          {instructor.specialties.map((specialty: string) => (
            <Badge key={specialty} variant="secondary">
              {specialty}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}

// 评价组件
function ReviewsSection({ stats }: { stats: any }) {
  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        {/* 评分概览 */}
        <div className="space-y-4">
          <div className="text-center">
            <div className="text-5xl font-bold">{stats.averageRating.toFixed(1)}</div>
            <div className="flex items-center justify-center gap-1 my-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${
                    i < Math.floor(stats.averageRating)
                      ? 'fill-amber-400 text-amber-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <p className="text-muted-foreground">{stats.totalReviews} 条评价</p>
          </div>
        </div>

        {/* 评分分布 */}
        <div className="space-y-2">
          {[5, 4, 3, 2, 1].map(rating => {
            const count = stats.ratingDistribution[rating];
            const percentage = (count / stats.totalReviews) * 100;
            return (
              <div key={rating} className="flex items-center gap-2">
                <span className="text-sm w-8">{rating}星</span>
                <Progress value={percentage} className="flex-1" />
                <span className="text-sm text-muted-foreground w-12 text-right">
                  {percentage.toFixed(0)}%
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <Separator />

      <div className="text-center text-muted-foreground py-8">
        <MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-50" />
        <p>暂无学生评价</p>
        <p className="text-sm">购买课程后可以留下您的评价</p>
      </div>
    </div>
  );
}

// 骨架屏
function CourseDetailSkeleton() {
  return (
    <div className="min-h-screen">
      <div className="bg-muted border-b">
        <div className="container mx-auto px-4 py-12">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-24 w-full" />
            </div>
            <Skeleton className="h-96" />
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 py-12">
        <Skeleton className="h-96 w-full" />
      </div>
    </div>
  );
}