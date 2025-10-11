/**
 * 课程相关的React Hooks
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { courseService } from '@/services/course.service';
import type {
  Course,
  CourseCard,
  CourseQueryParams,
  CourseListResponse,
} from '@/types/course';

/**
 * 获取课程列表
 */
export function useCourses(initialParams: CourseQueryParams = {}) {
  const [data, setData] = useState<CourseListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [params, setParams] = useState<CourseQueryParams>(initialParams);

  const fetchCourses = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await courseService.getCourses(params);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('获取课程列表失败'));
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const updateParams = useCallback((newParams: Partial<CourseQueryParams>) => {
    setParams(prev => ({ ...prev, ...newParams }));
  }, []);

  const refresh = useCallback(() => {
    fetchCourses();
  }, [fetchCourses]);

  return {
    courses: data?.courses || [],
    total: data?.total || 0,
    page: data?.page || 1,
    limit: data?.limit || 12,
    totalPages: data?.totalPages || 0,
    loading,
    error,
    params,
    updateParams,
    refresh,
  };
}

/**
 * 获取单个课程详情
 */
export function useCourse(courseId: string | null) {
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!courseId) {
      setLoading(false);
      return;
    }

    const fetchCourse = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await courseService.getCourseById(courseId);
        setCourse(result);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('获取课程详情失败'));
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId]);

  return { course, loading, error };
}

/**
 * 课程搜索
 */
export function useCourseSearch() {
  const [results, setResults] = useState<CourseCard[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const search = useCallback(async (query: string, limit?: number) => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const searchResults = await courseService.searchCourses(query, limit);
      setResults(searchResults);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('搜索失败'));
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const clear = useCallback(() => {
    setResults([]);
    setError(null);
  }, []);

  return { results, loading, error, search, clear };
}

/**
 * 获取相关课程
 */
export function useRelatedCourses(courseId: string | null, limit: number = 4) {
  const [courses, setCourses] = useState<CourseCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!courseId) {
      setLoading(false);
      return;
    }

    const fetchRelated = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await courseService.getRelatedCourses(courseId, limit);
        setCourses(result);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('获取相关课程失败'));
      } finally {
        setLoading(false);
      }
    };

    fetchRelated();
  }, [courseId, limit]);

  return { courses, loading, error };
}

/**
 * 获取推荐课程
 */
export function useRecommendedCourses(limit: number = 8) {
  const [courses, setCourses] = useState<CourseCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchRecommended = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await courseService.getRecommendedCourses(limit);
        setCourses(result);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('获取推荐课程失败'));
      } finally {
        setLoading(false);
      }
    };

    fetchRecommended();
  }, [limit]);

  return { courses, loading, error };
}

/**
 * 获取畅销课程
 */
export function useBestsellingCourses(limit: number = 8) {
  const [courses, setCourses] = useState<CourseCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchBestselling = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await courseService.getBestsellingCourses(limit);
        setCourses(result);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('获取畅销课程失败'));
      } finally {
        setLoading(false);
      }
    };

    fetchBestselling();
  }, [limit]);

  return { courses, loading, error };
}

/**
 * 获取新课程
 */
export function useNewCourses(limit: number = 8) {
  const [courses, setCourses] = useState<CourseCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchNew = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await courseService.getNewCourses(limit);
        setCourses(result);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('获取新课程失败'));
      } finally {
        setLoading(false);
      }
    };

    fetchNew();
  }, [limit]);

  return { courses, loading, error };
}

/**
 * 获取分类列表
 */
export function useCourseCategories() {
  const [categories, setCategories] = useState<
    { id: string; name: string; count: number }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await courseService.getCategories();
        setCategories(result);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('获取分类列表失败'));
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return { categories, loading, error };
}