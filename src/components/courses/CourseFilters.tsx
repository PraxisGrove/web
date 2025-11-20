'use client';

import React, { useState } from 'react';
import { Filter, X, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import type {
  CourseFilters as CourseFiltersType,
  CourseCategory,
  CourseLevel,
} from '@/types/course';

interface CourseFiltersProps {
  filters: CourseFiltersType;
  onFiltersChange: (filters: CourseFiltersType) => void;
  onClear: () => void;
}

export function CourseFilters({
  filters,
  onFiltersChange,
  onClear,
}: CourseFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);

  const categories: { id: CourseCategory; name: string }[] = [
    { id: 'frontend', name: '前端开发' },
    { id: 'backend', name: '后端开发' },
    { id: 'fullstack', name: '全栈开发' },
    { id: 'mobile', name: '移动开发' },
    { id: 'data-science', name: '数据科学' },
    { id: 'ai-ml', name: 'AI & 机器学习' },
    { id: 'design', name: '设计' },
    { id: 'business', name: '商业技能' },
  ];

  const levels: { id: CourseLevel; name: string }[] = [
    { id: 'beginner', name: '初级' },
    { id: 'intermediate', name: '中级' },
    { id: 'advanced', name: '高级' },
  ];

  const handleCategoryChange = (
    categoryId: CourseCategory,
    checked: boolean
  ) => {
    const newCategories = checked
      ? [...(filters.category || []), categoryId]
      : (filters.category || []).filter((c) => c !== categoryId);

    onFiltersChange({
      ...filters,
      category: newCategories.length > 0 ? newCategories : undefined,
    });
  };

  const handleLevelChange = (levelId: CourseLevel, checked: boolean) => {
    const newLevels = checked
      ? [...(filters.level || []), levelId]
      : (filters.level || []).filter((l) => l !== levelId);

    onFiltersChange({
      ...filters,
      level: newLevels.length > 0 ? newLevels : undefined,
    });
  };

  const handlePriceChange = (values: number[]) => {
    onFiltersChange({
      ...filters,
      priceRange: { min: values[0], max: values[1] },
    });
  };

  const handleRatingChange = (value: number[]) => {
    onFiltersChange({
      ...filters,
      rating: value[0],
    });
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.category && filters.category.length > 0) count++;
    if (filters.level && filters.level.length > 0) count++;
    if (filters.priceRange) count++;
    if (filters.rating) count++;
    if (filters.duration) count++;
    if (filters.features && filters.features.length > 0) count++;
    return count;
  };

  const activeCount = getActiveFiltersCount();

  const FiltersContent = () => (
    <div className="space-y-6">
      {/* 分类筛选 */}
      <Collapsible defaultOpen>
        <CollapsibleTrigger className="hover:text-primary flex w-full items-center justify-between py-2 font-semibold transition-colors">
          <span>课程分类</span>
          <ChevronDown className="h-4 w-4" />
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="space-y-3 pt-3">
            {categories.map((category) => (
              <div key={category.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`category-${category.id}`}
                  checked={filters.category?.includes(category.id) || false}
                  onCheckedChange={(checked) =>
                    handleCategoryChange(category.id, checked as boolean)
                  }
                />
                <Label
                  htmlFor={`category-${category.id}`}
                  className="cursor-pointer text-sm font-normal"
                >
                  {category.name}
                </Label>
              </div>
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* 难度筛选 */}
      <Collapsible defaultOpen>
        <CollapsibleTrigger className="hover:text-primary flex w-full items-center justify-between py-2 font-semibold transition-colors">
          <span>课程难度</span>
          <ChevronDown className="h-4 w-4" />
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="space-y-3 pt-3">
            {levels.map((level) => (
              <div key={level.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`level-${level.id}`}
                  checked={filters.level?.includes(level.id) || false}
                  onCheckedChange={(checked) =>
                    handleLevelChange(level.id, checked as boolean)
                  }
                />
                <Label
                  htmlFor={`level-${level.id}`}
                  className="cursor-pointer text-sm font-normal"
                >
                  {level.name}
                </Label>
              </div>
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* 价格筛选 */}
      <Collapsible defaultOpen>
        <CollapsibleTrigger className="hover:text-primary flex w-full items-center justify-between py-2 font-semibold transition-colors">
          <span>价格范围</span>
          <ChevronDown className="h-4 w-4" />
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="space-y-4 pt-3">
            <Slider
              min={0}
              max={1000}
              step={50}
              value={[
                filters.priceRange?.min || 0,
                filters.priceRange?.max || 1000,
              ]}
              onValueChange={handlePriceChange}
            />
            <div className="text-muted-foreground flex items-center justify-between text-sm">
              <span>¥{filters.priceRange?.min || 0}</span>
              <span>¥{filters.priceRange?.max || 1000}</span>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* 评分筛选 */}
      <Collapsible defaultOpen>
        <CollapsibleTrigger className="hover:text-primary flex w-full items-center justify-between py-2 font-semibold transition-colors">
          <span>最低评分</span>
          <ChevronDown className="h-4 w-4" />
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="space-y-4 pt-3">
            <Slider
              min={0}
              max={5}
              step={0.5}
              value={[filters.rating || 0]}
              onValueChange={handleRatingChange}
            />
            <div className="text-muted-foreground flex items-center justify-between text-sm">
              <span>任意评分</span>
              <span>{filters.rating?.toFixed(1) || '0.0'}+ ⭐</span>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* 清除筛选 */}
      {activeCount > 0 && (
        <Button variant="outline" className="w-full" onClick={onClear}>
          <X className="mr-2 h-4 w-4" />
          清除所有筛选 ({activeCount})
        </Button>
      )}
    </div>
  );

  return (
    <>
      {/* 桌面端 - 侧边栏 */}
      <div className="hidden lg:block">
        <div className="sticky top-24 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">筛选条件</h3>
            {activeCount > 0 && (
              <Badge variant="secondary">{activeCount}</Badge>
            )}
          </div>
          <FiltersContent />
        </div>
      </div>

      {/* 移动端 - Sheet */}
      <div className="lg:hidden">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="w-full sm:w-auto">
              <Filter className="mr-2 h-4 w-4" />
              筛选
              {activeCount > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {activeCount}
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent
            side="left"
            className="w-[300px] overflow-y-auto sm:w-[400px]"
          >
            <SheetHeader>
              <SheetTitle className="flex items-center justify-between">
                <span>筛选条件</span>
                {activeCount > 0 && (
                  <Badge variant="secondary">{activeCount}</Badge>
                )}
              </SheetTitle>
            </SheetHeader>
            <div className="mt-6">
              <FiltersContent />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
