'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Grid, List, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { CourseCard } from '@/components/courses/CourseCard';
import { CourseFilters } from '@/components/courses/CourseFilters';
import { useCourses } from '@/hooks/useCourses';
import type { CourseFilters as CourseFiltersType, CourseSortBy } from '@/types/course';

export default function CoursesPage() {
  const [layout, setLayout] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<CourseFiltersType>({});
  const [sortBy, setSortBy] = useState<CourseSortBy>('newest');

  const { courses, loading, error, page, totalPages, updateParams } = useCourses({
    page: 1,
    limit: 12,
    search: searchQuery,
    filters,
    sortBy,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateParams({ search: searchQuery, page: 1 });
  };

  const handleFiltersChange = (newFilters: CourseFiltersType) => {
    setFilters(newFilters);
    updateParams({ filters: newFilters, page: 1 });
  };

  const handleSortChange = (value: CourseSortBy) => {
    setSortBy(value);
    updateParams({ sortBy: value, page: 1 });
  };

  const handleClearFilters = () => {
    setFilters({});
    updateParams({ filters: {}, page: 1 });
  };

  const handlePageChange = (newPage: number) => {
    updateParams({ page: newPage });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-background border-b">
        <div className="container mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto text-center space-y-4"
          >
            <h1 className="text-4xl md:text-5xl font-bold">探索课程</h1>
            <p className="text-lg text-muted-foreground">
              发现优质课程，开启学习之旅。我们提供50+门精选课程，覆盖前端、后端、AI、设计等多个领域。
            </p>

            {/* 搜索栏 */}
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto pt-4">
              <div className="flex gap-2">
                <Input
                  type="search"
                  placeholder="搜索课程名称、讲师..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-12 text-base"
                />
                <Button type="submit" size="lg" className="px-8">
                  搜索
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>

      {/* 主体内容 */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* 左侧筛选栏 */}
          <aside className="lg:w-64 flex-shrink-0">
            <CourseFilters
              filters={filters}
              onFiltersChange={handleFiltersChange}
              onClear={handleClearFilters}
            />
          </aside>

          {/* 右侧课程列表 */}
          <main className="flex-1 space-y-6">
            {/* 工具栏 */}
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  找到 <span className="font-semibold text-foreground">{courses.length}</span> 门课程
                </span>
              </div>

              <div className="flex items-center gap-4">
                {/* 排序 */}
                <Select value={sortBy} onValueChange={handleSortChange}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="排序方式" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">最新发布</SelectItem>
                    <SelectItem value="popular">最受欢迎</SelectItem>
                    <SelectItem value="rating">评分最高</SelectItem>
                    <SelectItem value="price-low">价格从低到高</SelectItem>
                    <SelectItem value="price-high">价格从高到低</SelectItem>
                  </SelectContent>
                </Select>

                {/* 布局切换 */}
                <div className="hidden md:flex items-center gap-1 border rounded-md p-1">
                  <Button
                    variant={layout === 'grid' ? 'secondary' : 'ghost'}
                    size="sm"
                    onClick={() => setLayout('grid')}
                  >
                    <Grid className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={layout === 'list' ? 'secondary' : 'ghost'}
                    size="sm"
                    onClick={() => setLayout('list')}
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* 课程网格/列表 */}
            {loading ? (
              <div className={layout === 'grid' 
                ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'
                : 'space-y-4'
              }>
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="space-y-4">
                    <Skeleton className={layout === 'grid' ? 'aspect-video' : 'h-48'} />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-destructive">加载失败：{error.message}</p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => window.location.reload()}
                >
                  重试
                </Button>
              </div>
            ) : courses.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">没有找到符合条件的课程</p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={handleClearFilters}
                >
                  清除筛选条件
                </Button>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={layout === 'grid' 
                  ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'
                  : 'space-y-4'
                }
              >
                {courses.map(course => (
                  <CourseCard
                    key={course.id}
                    course={course}
                    layout={layout}
                  />
                ))}
              </motion.div>
            )}

            {/* 分页 */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-8">
                <Button
                  variant="outline"
                  disabled={page === 1}
                  onClick={() => handlePageChange(page - 1)}
                >
                  上一页
                </Button>
                
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    let pageNum: number;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (page <= 3) {
                      pageNum = i + 1;
                    } else if (page >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = page - 2 + i;
                    }

                    return (
                      <Button
                        key={pageNum}
                        variant={page === pageNum ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => handlePageChange(pageNum)}
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </div>

                <Button
                  variant="outline"
                  disabled={page === totalPages}
                  onClick={() => handlePageChange(page + 1)}
                >
                  下一页
                </Button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}