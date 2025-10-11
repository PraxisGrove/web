/**
 * 课程服务 - Mock API实现
 */

import type {
  Course,
  CourseCard,
  CourseQueryParams,
  CourseListResponse,
  CourseFilters,
  CourseSortBy,
} from '@/types/course';
import { allMockCourses, mockCourseCards } from '@/lib/mock-data/courses';

// 模拟网络延迟
const delay = (ms: number = 300) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * 课程服务类
 */
class CourseService {
  /**
   * 获取课程列表
   */
  async getCourses(params: CourseQueryParams = {}): Promise<CourseListResponse> {
    await delay(400);

    const {
      page = 1,
      limit = 12,
      search = '',
      filters,
      sortBy = 'newest',
    } = params;

    // 过滤课程
    let filteredCourses = this.filterCourses(mockCourseCards, search, filters);

    // 排序
    filteredCourses = this.sortCourses(filteredCourses, sortBy);

    // 分页
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedCourses = filteredCourses.slice(startIndex, endIndex);

    return {
      courses: paginatedCourses,
      total: filteredCourses.length,
      page,
      limit,
      totalPages: Math.ceil(filteredCourses.length / limit),
    };
  }

  /**
   * 根据ID获取课程详情
   */
  async getCourseById(id: string): Promise<Course | null> {
    await delay(300);

    const course = allMockCourses.find(c => c.id === id);
    return course || null;
  }

  /**
   * 搜索课程
   */
  async searchCourses(query: string, limit: number = 10): Promise<CourseCard[]> {
    await delay(200);

    if (!query.trim()) return [];

    const lowerQuery = query.toLowerCase();
    const results = mockCourseCards.filter(course =>
      course.title.toLowerCase().includes(lowerQuery) ||
      course.instructor.name.toLowerCase().includes(lowerQuery)
    );

    return results.slice(0, limit);
  }

  /**
   * 获取相关课程
   */
  async getRelatedCourses(courseId: string, limit: number = 4): Promise<CourseCard[]> {
    await delay(250);

    const course = allMockCourses.find(c => c.id === courseId);
    if (!course) return [];

    // 查找同分类或同讲师的课程
    const related = mockCourseCards.filter(c =>
      c.id !== courseId &&
      (c.category === course.category || c.instructor.name === course.instructor.name)
    );

    return related.slice(0, limit);
  }

  /**
   * 获取推荐课程
   */
  async getRecommendedCourses(limit: number = 8): Promise<CourseCard[]> {
    await delay(300);

    // 返回评分最高的课程
    const sorted = [...mockCourseCards].sort((a, b) => b.rating - a.rating);
    return sorted.slice(0, limit);
  }

  /**
   * 获取畅销课程
   */
  async getBestsellingCourses(limit: number = 8): Promise<CourseCard[]> {
    await delay(300);

    // 返回学生数最多的课程
    const sorted = [...mockCourseCards].sort((a, b) => b.studentCount - a.studentCount);
    return sorted.slice(0, limit);
  }

  /**
   * 获取新课程
   */
  async getNewCourses(limit: number = 8): Promise<CourseCard[]> {
    await delay(300);

    // 返回最新发布的课程
    const sorted = [...mockCourseCards].sort((a, b) =>
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
    return sorted.slice(0, limit);
  }

  /**
   * 获取分类列表
   */
  async getCategories(): Promise<{ id: string; name: string; count: number }[]> {
    await delay(150);

    const categoryMap = new Map<string, number>();

    mockCourseCards.forEach(course => {
      const current = categoryMap.get(course.category) || 0;
      categoryMap.set(course.category, current + 1);
    });

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

    return Array.from(categoryMap.entries()).map(([id, count]) => ({
      id,
      name: categoryNames[id] || id,
      count,
    }));
  }

  // ===== 私有辅助方法 =====

  /**
   * 过滤课程
   */
  private filterCourses(
    courses: CourseCard[],
    search: string,
    filters?: CourseFilters
  ): CourseCard[] {
    let result = [...courses];

    // 搜索过滤
    if (search) {
      const lowerSearch = search.toLowerCase();
      result = result.filter(course =>
        course.title.toLowerCase().includes(lowerSearch) ||
        course.instructor.name.toLowerCase().includes(lowerSearch)
      );
    }

    if (!filters) return result;

    // 分类过滤
    if (filters.category && filters.category.length > 0) {
      result = result.filter(course => filters.category!.includes(course.category));
    }

    // 难度过滤
    if (filters.level && filters.level.length > 0) {
      result = result.filter(course => filters.level!.includes(course.level));
    }

    // 价格过滤
    if (filters.priceRange) {
      result = result.filter(
        course =>
          course.price >= filters.priceRange!.min &&
          course.price <= filters.priceRange!.max
      );
    }

    // 评分过滤
    if (filters.rating) {
      result = result.filter(course => course.rating >= filters.rating!);
    }

    // 时长过滤
    if (filters.duration) {
      result = result.filter(
        course =>
          course.totalDuration >= filters.duration!.min &&
          course.totalDuration <= filters.duration!.max
      );
    }

    return result;
  }

  /**
   * 排序课程
   */
  private sortCourses(courses: CourseCard[], sortBy: CourseSortBy): CourseCard[] {
    const sorted = [...courses];

    switch (sortBy) {
      case 'newest':
        return sorted.sort(
          (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );

      case 'popular':
        return sorted.sort((a, b) => b.studentCount - a.studentCount);

      case 'rating':
        return sorted.sort((a, b) => b.rating - a.rating);

      case 'price-low':
        return sorted.sort((a, b) => a.price - b.price);

      case 'price-high':
        return sorted.sort((a, b) => b.price - a.price);

      default:
        return sorted;
    }
  }
}

// 导出单例
export const courseService = new CourseService();

// 导出类型
export type { CourseService };