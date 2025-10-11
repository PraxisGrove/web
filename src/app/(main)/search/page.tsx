'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Search, X, TrendingUp, Clock, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CourseCard } from '@/components/courses/CourseCard';
import { CourseFilters } from '@/components/courses/CourseFilters';
import { useCourses } from '@/hooks/useCourses';
import type { CourseFilters as CourseFiltersType, CourseSortBy } from '@/types/course';

// 热门搜索关键词
const TRENDING_SEARCHES = [
  'React',
  'Python',
  'AI',
  '机器学习',
  'Next.js',
  'TypeScript',
  'UI设计',
  '数据分析',
];

function SearchPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const [query, setQuery] = useState(initialQuery);
  const [activeQuery, setActiveQuery] = useState(initialQuery);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [filters, setFilters] = useState<CourseFiltersType>({});
  const [sortBy, setSortBy] = useState<CourseSortBy>('popular');
  const [layout, setLayout] = useState<'grid' | 'list'>('grid');

  const { courses, loading, error, total, page, totalPages, updateParams } = useCourses({
    page: 1,
    limit: 12,
    search: activeQuery,
    filters,
    sortBy,
  });

  // 从localStorage加载搜索历史
  useEffect(() => {
    const saved = localStorage.getItem('search-history');
    if (saved) {
      try {
        setSearchHistory(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load search history:', e);
      }
    }
  }, []);

  // 保存搜索历史
  const saveSearchHistory = (searchQuery: string) => {
    if (!searchQuery.trim()) return;

    const updated = [
      searchQuery,
      ...searchHistory.filter(h => h !== searchQuery),
    ].slice(0, 10); // 保留最近10条

    setSearchHistory(updated);
    localStorage.setItem('search-history', JSON.stringify(updated));
  };

  // 执行搜索
  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!query.trim()) return;

    setActiveQuery(query);
    saveSearchHistory(query);
    updateParams({ search: query, page: 1 });

    // 更新URL
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  // 清除搜索
  const handleClearSearch = () => {
    setQuery('');
    setActiveQuery('');
    updateParams({ search: '', page: 1 });
    router.push('/search');
  };

  // 点击热门/历史搜索
  const handleQuickSearch = (searchQuery: string) => {
    setQuery(searchQuery);
    setActiveQuery(searchQuery);
    saveSearchHistory(searchQuery);
    updateParams({ search: searchQuery, page: 1 });
    router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
  };

  // 清除搜索历史
  const handleClearHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem('search-history');
  };

  const handleFiltersChange = (newFilters: CourseFiltersType) => {
    setFilters(newFilters);
    updateParams({ filters: newFilters, page: 1 });
  };

  const handleSortChange = (value: CourseSortBy) => {
    setSortBy(value);
    updateParams({ sortBy: value, page: 1 });
  };

  const handlePageChange = (newPage: number) => {
    updateParams({ page: newPage });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* 搜索区域 */}
      <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-background border-b">
        <div className="container mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto space-y-6"
          >
            {/* 搜索框 */}
            <form onSubmit={handleSearch} className="relative">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="搜索课程、讲师、技能..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="h-14 pl-12 pr-12 text-base"
                  autoFocus
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            </form>

            {/* 搜索建议/历史 */}
            {!activeQuery && (
              <div className="grid md:grid-cols-2 gap-6">
                {/* 热门搜索 */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <TrendingUp className="w-4 h-4" />
                    <span>热门搜索</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {TRENDING_SEARCHES.map(term => (
                      <Badge
                        key={term}
                        variant="secondary"
                        className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                        onClick={() => handleQuickSearch(term)}
                      >
                        {term}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* 搜索历史 */}
                {searchHistory.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        <span>最近搜索</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleClearHistory}
                        className="h-auto p-0 text-xs"
                      >
                        清除
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {searchHistory.slice(0, 8).map((term, index) => (
                        <Badge
                          key={`${term}-${index}`}
                          variant="outline"
                          className="cursor-pointer hover:bg-accent transition-colors"
                          onClick={() => handleQuickSearch(term)}
                        >
                          {term}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* 搜索结果 */}
      {activeQuery && (
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* 筛选侧边栏 */}
            <aside className="lg:w-64 flex-shrink-0">
              <CourseFilters
                filters={filters}
                onFiltersChange={handleFiltersChange}
                onClear={() => setFilters({})}
              />
            </aside>

            {/* 搜索结果列表 */}
            <main className="flex-1 space-y-6">
              {/* 结果头部 */}
              <div className="space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <h1 className="text-2xl font-bold">
                      搜索结果: &ldquo;{activeQuery}&rdquo;
                    </h1>
                    <p className="text-muted-foreground mt-1">
                      找到 <span className="font-semibold text-foreground">{total}</span> 个结果
                    </p>
                  </div>

                  {activeQuery && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleClearSearch}
                    >
                      <X className="w-4 h-4 mr-2" />
                      清除搜索
                    </Button>
                  )}
                </div>

                {/* 工具栏 */}
                <div className="flex items-center justify-between gap-4">
                  <Select value={sortBy} onValueChange={handleSortChange}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="排序方式" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="popular">最受欢迎</SelectItem>
                      <SelectItem value="newest">最新发布</SelectItem>
                      <SelectItem value="rating">评分最高</SelectItem>
                      <SelectItem value="price-low">价格从低到高</SelectItem>
                      <SelectItem value="price-high">价格从高到低</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* 课程列表 */}
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="space-y-4">
                      <Skeleton className="aspect-video" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : error ? (
                <div className="text-center py-12">
                  <p className="text-destructive">搜索失败：{error.message}</p>
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => window.location.reload()}
                  >
                    重试
                  </Button>
                </div>
              ) : courses.length === 0 ? (
                <div className="text-center py-12 space-y-4">
                  <Search className="w-16 h-16 mx-auto text-muted-foreground opacity-50" />
                  <div>
                    <p className="text-lg font-medium">未找到相关课程</p>
                    <p className="text-muted-foreground mt-2">
                      尝试使用不同的关键词或清除筛选条件
                    </p>
                  </div>
                  <div className="flex items-center justify-center gap-4">
                    <Button
                      variant="outline"
                      onClick={handleClearSearch}
                    >
                      清除搜索
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setFilters({})}
                    >
                      清除筛选
                    </Button>
                  </div>
                  
                  {/* 推荐其他搜索 */}
                  <div className="mt-8">
                    <p className="text-sm text-muted-foreground mb-3">试试这些热门搜索：</p>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {TRENDING_SEARCHES.map(term => (
                        <Badge
                          key={term}
                          variant="secondary"
                          className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                          onClick={() => handleQuickSearch(term)}
                        >
                          {term}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                >
                  {courses.map(course => (
                    <CourseCard
                      key={course.id}
                      course={course}
                      layout="grid"
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
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">加载搜索页面...</p>
        </div>
      </div>
    }>
      <SearchPageContent />
    </Suspense>
  );
}