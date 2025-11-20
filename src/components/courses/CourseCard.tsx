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

export function CourseCard({
  course,
  className,
  layout = 'grid',
}: CourseCardProps) {
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
          <Card
            className={cn(
              'overflow-hidden transition-shadow hover:shadow-lg',
              className
            )}
          >
            <CardContent className="p-0">
              <div className="flex flex-col gap-4 sm:flex-row">
                {/* 缩略图 */}
                <div className="relative h-48 w-full flex-shrink-0 sm:h-auto sm:w-64">
                  <Image
                    src={thumbnail}
                    alt={title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, 256px"
                  />
                  {isBestseller && (
                    <Badge className="absolute left-2 top-2 bg-amber-500 hover:bg-amber-600">
                      <TrendingUp className="mr-1 h-3 w-3" />
                      畅销
                    </Badge>
                  )}
                  {isNew && (
                    <Badge className="absolute left-2 top-2 bg-emerald-500 hover:bg-emerald-600">
                      <Sparkles className="mr-1 h-3 w-3" />
                      新课
                    </Badge>
                  )}
                </div>

                {/* 内容 */}
                <div className="flex-1 space-y-3 p-4">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="outline">{categoryNames[category]}</Badge>
                      <Badge className={levelColors[level]} variant="secondary">
                        {levelNames[level]}
                      </Badge>
                    </div>

                    <h3 className="hover:text-primary line-clamp-2 text-xl font-semibold transition-colors">
                      {title}
                    </h3>

                    <div className="text-muted-foreground flex items-center gap-2 text-sm">
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

                  <div className="text-muted-foreground flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                      <span className="text-foreground font-medium">
                        {rating.toFixed(1)}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>{studentCount.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{Math.floor(totalDuration / 60)}小时</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-baseline gap-2">
                      <span className="text-primary text-2xl font-bold">
                        ¥{price}
                      </span>
                      {originalPrice && (
                        <>
                          <span className="text-muted-foreground text-sm line-through">
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
        <Card
          className={cn(
            'group overflow-hidden transition-shadow hover:shadow-xl',
            className
          )}
        >
          <CardContent className="p-0">
            {/* 缩略图 */}
            <div className="relative aspect-video overflow-hidden">
              <Image
                src={thumbnail}
                alt={title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-110"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              {isBestseller && (
                <Badge className="absolute left-3 top-3 bg-amber-500 shadow-lg hover:bg-amber-600">
                  <TrendingUp className="mr-1 h-3 w-3" />
                  畅销
                </Badge>
              )}
              {isNew && (
                <Badge className="absolute left-3 top-3 bg-emerald-500 shadow-lg hover:bg-emerald-600">
                  <Sparkles className="mr-1 h-3 w-3" />
                  新课
                </Badge>
              )}
            </div>

            {/* 内容 */}
            <div className="space-y-3 p-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {categoryNames[category]}
                  </Badge>
                  <Badge
                    className={cn('text-xs', levelColors[level])}
                    variant="secondary"
                  >
                    {levelNames[level]}
                  </Badge>
                </div>

                <h3 className="group-hover:text-primary line-clamp-2 min-h-[3rem] font-semibold transition-colors">
                  {title}
                </h3>

                <div className="text-muted-foreground flex items-center gap-2 text-sm">
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

              <div className="text-muted-foreground flex items-center gap-3 text-sm">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  <span className="text-foreground font-medium">
                    {rating.toFixed(1)}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>{(studentCount / 1000).toFixed(1)}k</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{Math.floor(totalDuration / 60)}h</span>
                </div>
              </div>

              <div className="flex items-center justify-between border-t pt-2">
                <div className="flex items-baseline gap-2">
                  <span className="text-primary text-xl font-bold">
                    ¥{price}
                  </span>
                  {originalPrice && (
                    <>
                      <span className="text-muted-foreground text-sm line-through">
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
