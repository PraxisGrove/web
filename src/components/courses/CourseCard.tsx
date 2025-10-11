'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Clock, Users, Star, TrendingUp, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import type { CourseCard as CourseCardType } from '@/types/course';
import { cn } from '@/lib/utils';

interface CourseCardProps {
  course: CourseCardType;
  className?: string;
  layout?: 'grid' | 'list';
}

export function CourseCard({ course, className, layout = 'grid' }: CourseCardProps) {
  const {
    id,
    title,
    thumbnail,
    category,
    level,
    instructor,
    price,
    originalPrice,
    rating,
    studentCount,
    totalDuration,
    totalLessons,
    isBestseller,
    isNew,
  } = course;

  const categoryNames: Record<string, string> = {
    frontend: '前端开发',
    backend: '后端开发',
    fullstack: '全栈开发',
    mobile: '移动开发',
    'data-science': '数据科学',
    'ai-ml': 'AI & ML',
    design: '设计',
    business: '商业',
  };

  const levelNames: Record<string, string> = {
    beginner: '初级',
    intermediate: '中级',
    advanced: '高级',
  };

  const levelColors: Record<string, string> = {
    beginner: 'bg-green-500/10 text-green-700 dark:text-green-400',
    intermediate: 'bg-blue-500/10 text-blue-700 dark:text-blue-400',
    advanced: 'bg-purple-500/10 text-purple-700 dark:text-purple-400',
  };

  const discount = originalPrice
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  if (layout === 'list') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
      >
        <Link href={`/courses/${id}`}>
          <Card className={cn('overflow-hidden hover:shadow-lg transition-shadow', className)}>
            <CardContent className="p-0">
              <div className="flex flex-col sm:flex-row gap-4">
                {/* 缩略图 */}
                <div className="relative w-full sm:w-64 h-48 sm:h-auto flex-shrink-0">
                  <Image
                    src={thumbnail}
                    alt={title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, 256px"
                  />
                  {isBestseller && (
                    <Badge className="absolute top-2 left-2 bg-amber-500 hover:bg-amber-600">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      畅销
                    </Badge>
                  )}
                  {isNew && (
                    <Badge className="absolute top-2 left-2 bg-emerald-500 hover:bg-emerald-600">
                      <Sparkles className="w-3 h-3 mr-1" />
                      新课
                    </Badge>
                  )}
                </div>

                {/* 内容 */}
                <div className="flex-1 p-4 space-y-3">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="outline">{categoryNames[category]}</Badge>
                      <Badge className={levelColors[level]} variant="secondary">
                        {levelNames[level]}
                      </Badge>
                    </div>

                    <h3 className="text-xl font-semibold line-clamp-2 hover:text-primary transition-colors">
                      {title}
                    </h3>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Image
                        src={instructor.avatar}
                        alt={instructor.name}
                        width={24}
                        height={24}
                        className="rounded-full"
                      />
                      <span>{instructor.name}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      <span className="font-medium text-foreground">{rating.toFixed(1)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>{studentCount.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{Math.floor(totalDuration / 60)}小时</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-primary">¥{price}</span>
                      {originalPrice && (
                        <>
                          <span className="text-sm text-muted-foreground line-through">
                            ¥{originalPrice}
                          </span>
                          <Badge variant="destructive" className="text-xs">
                            -{discount}%
                          </Badge>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      </motion.div>
    );
  }

  // Grid layout
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.2 }}
    >
      <Link href={`/courses/${id}`}>
        <Card className={cn('overflow-hidden hover:shadow-xl transition-shadow group', className)}>
          <CardContent className="p-0">
            {/* 缩略图 */}
            <div className="relative aspect-video overflow-hidden">
              <Image
                src={thumbnail}
                alt={title}
                fill
                className="object-cover transition-transform group-hover:scale-110 duration-300"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              {isBestseller && (
                <Badge className="absolute top-3 left-3 bg-amber-500 hover:bg-amber-600 shadow-lg">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  畅销
                </Badge>
              )}
              {isNew && (
                <Badge className="absolute top-3 left-3 bg-emerald-500 hover:bg-emerald-600 shadow-lg">
                  <Sparkles className="w-3 h-3 mr-1" />
                  新课
                </Badge>
              )}
            </div>

            {/* 内容 */}
            <div className="p-4 space-y-3">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {categoryNames[category]}
                  </Badge>
                  <Badge className={cn('text-xs', levelColors[level])} variant="secondary">
                    {levelNames[level]}
                  </Badge>
                </div>

                <h3 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors min-h-[3rem]">
                  {title}
                </h3>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Image
                    src={instructor.avatar}
                    alt={instructor.name}
                    width={20}
                    height={20}
                    className="rounded-full"
                  />
                  <span className="truncate">{instructor.name}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="font-medium text-foreground">{rating.toFixed(1)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>{(studentCount / 1000).toFixed(1)}k</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{Math.floor(totalDuration / 60)}h</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t">
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-bold text-primary">¥{price}</span>
                  {originalPrice && (
                    <>
                      <span className="text-sm text-muted-foreground line-through">
                        ¥{originalPrice}
                      </span>
                    </>
                  )}
                </div>
                {discount > 0 && (
                  <Badge variant="destructive" className="text-xs">
                    -{discount}%
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}