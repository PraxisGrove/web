'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Clock, TrendingUp, X, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useCourseSearch } from '@/hooks/useCourses';
import { useDebounce } from '@/hooks/useDebounce';
import type { CourseCard } from '@/types/course';

interface SearchBarProps {
  placeholder?: string;
  className?: string;
  onSearch?: (query: string) => void;
  showSuggestions?: boolean;
}

export function SearchBar({
  placeholder = '搜索课程、讲师...',
  className = '',
  onSearch,
  showSuggestions = true,
}: SearchBarProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const { results, loading, search, clear } = useCourseSearch();
  const debouncedQuery = useDebounce(query, 300);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 加载搜索历史
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

  // 执行搜索建议
  useEffect(() => {
    if (debouncedQuery.trim() && showSuggestions) {
      search(debouncedQuery, 5);
    } else {
      clear();
    }
  }, [debouncedQuery, search, clear, showSuggestions]);

  // 点击外部关闭下拉框
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsFocused(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    performSearch(query);
  };

  const performSearch = (searchQuery: string) => {
    // 保存到搜索历史
    const updated = [
      searchQuery,
      ...searchHistory.filter((h) => h !== searchQuery),
    ].slice(0, 10);

    setSearchHistory(updated);
    localStorage.setItem('search-history', JSON.stringify(updated));

    // 执行搜索
    if (onSearch) {
      onSearch(searchQuery);
    } else {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }

    setIsFocused(false);
    inputRef.current?.blur();
  };

  const handleSuggestionClick = (course: CourseCard) => {
    router.push(`/courses/${course.id}`);
    setIsFocused(false);
    setQuery('');
  };

  const handleHistoryClick = (term: string) => {
    setQuery(term);
    performSearch(term);
  };

  const handleClearHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem('search-history');
  };

  const showDropdown =
    isFocused && showSuggestions && (query || searchHistory.length > 0);

  const TRENDING_SEARCHES = [
    'React',
    'Python',
    'AI',
    '机器学习',
    'Next.js',
    'TypeScript',
  ];

  return (
    <div className={`relative ${className}`}>
      {/* 搜索输入框 */}
      <form onSubmit={handleSubmit} className="relative">
        <Search className="text-muted-foreground pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2" />
        <Input
          ref={inputRef}
          type="search"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          className="pl-10 pr-10"
        />
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery('');
              clear();
            }}
            className="text-muted-foreground hover:text-foreground absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
        {loading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <Loader2 className="text-muted-foreground h-4 w-4 animate-spin" />
          </div>
        )}
      </form>

      {/* 搜索建议下拉框 */}
      <AnimatePresence>
        {showDropdown && (
          <motion.div
            ref={dropdownRef}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="bg-popover absolute left-0 right-0 top-full z-50 mt-2 max-h-[400px] overflow-y-auto rounded-lg border shadow-lg"
          >
            <div className="p-2">
              {/* 搜索结果 */}
              {query && results.length > 0 && (
                <div className="space-y-1">
                  <div className="text-muted-foreground px-3 py-2 text-xs font-medium">
                    课程建议
                  </div>
                  {results.map((course) => (
                    <button
                      key={course.id}
                      onClick={() => handleSuggestionClick(course)}
                      className="hover:bg-accent flex w-full items-center gap-3 rounded-md px-3 py-2 text-left transition-colors"
                    >
                      <Search className="text-muted-foreground h-4 w-4 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <div className="truncate font-medium">
                          {course.title}
                        </div>
                        <div className="text-muted-foreground text-xs">
                          {course.instructor.name}
                        </div>
                      </div>
                      <div className="text-muted-foreground flex flex-shrink-0 items-center gap-1 text-xs">
                        <span>⭐ {course.rating.toFixed(1)}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* 无结果提示 */}
              {query && !loading && results.length === 0 && (
                <div className="text-muted-foreground px-3 py-6 text-center text-sm">
                  未找到相关课程
                </div>
              )}

              {/* 搜索历史 */}
              {!query && searchHistory.length > 0 && (
                <div className="space-y-1">
                  <div className="flex items-center justify-between px-3 py-2">
                    <div className="text-muted-foreground flex items-center gap-2 text-xs font-medium">
                      <Clock className="h-4 w-4" />
                      <span>最近搜索</span>
                    </div>
                    <button
                      onClick={handleClearHistory}
                      className="text-muted-foreground hover:text-foreground text-xs transition-colors"
                    >
                      清除
                    </button>
                  </div>
                  {searchHistory.slice(0, 5).map((term, index) => (
                    <button
                      key={`${term}-${index}`}
                      onClick={() => handleHistoryClick(term)}
                      className="hover:bg-accent flex w-full items-center gap-3 rounded-md px-3 py-2 text-left transition-colors"
                    >
                      <Clock className="text-muted-foreground h-4 w-4" />
                      <span className="flex-1">{term}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* 热门搜索 */}
              {!query && (
                <div className="mt-2 space-y-2 border-t pt-2">
                  <div className="text-muted-foreground flex items-center gap-2 px-3 py-2 text-xs font-medium">
                    <TrendingUp className="h-4 w-4" />
                    <span>热门搜索</span>
                  </div>
                  <div className="flex flex-wrap gap-2 px-3">
                    {TRENDING_SEARCHES.map((term) => (
                      <Badge
                        key={term}
                        variant="secondary"
                        className="hover:bg-primary hover:text-primary-foreground cursor-pointer transition-colors"
                        onClick={() => handleHistoryClick(term)}
                      >
                        {term}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
