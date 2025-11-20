/**
 * 课程系统类型定义
 */

// 课程难度级别
export type CourseLevel = 'beginner' | 'intermediate' | 'advanced';

// 课程分类
export type CourseCategory =
  | 'frontend'
  | 'backend'
  | 'fullstack'
  | 'mobile'
  | 'data-science'
  | 'ai-ml'
  | 'design'
  | 'business';

// 课时类型
export type LessonType = 'video' | 'article' | 'quiz' | 'exercise' | 'project';

// 课程状态
export type CourseStatus = 'draft' | 'published' | 'archived';

// 讲师信息
export interface Instructor {
  id: string;
  name: string;
  avatar: string;
  title: string;
  bio: string;
  rating: number;
  studentCount: number;
  courseCount: number;
  specialties: string[];
}

// 课时
export interface Lesson {
  id: string;
  title: string;
  type: LessonType;
  duration: number; // 分钟
  description: string;
  isPreview: boolean; // 是否可免费预览
  videoUrl?: string;
  articleContent?: string;
  resources?: Resource[];
}

// 章节
export interface Chapter {
  id: string;
  title: string;
  description: string;
  duration: number; // 总时长（分钟）
  lessonCount: number;
  lessons: Lesson[];
  order: number;
}

// 课程资源
export interface Resource {
  id: string;
  title: string;
  type: 'pdf' | 'code' | 'link' | 'other';
  url: string;
  size?: string; // 文件大小
}

// 课程评价
export interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  rating: number;
  comment: string;
  createdAt: string;
  helpful: number; // 有帮助的数量
  isVerifiedPurchase: boolean;
}

// 课程统计
export interface CourseStats {
  totalStudents: number;
  totalReviews: number;
  averageRating: number;
  completionRate: number;
  ratingDistribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
}

// 课程主体
export interface Course {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  thumbnail: string;
  previewVideo?: string;

  // 分类和难度
  category: CourseCategory;
  level: CourseLevel;
  tags: string[];

  // 讲师
  instructor: Instructor;

  // 内容
  chapters: Chapter[];
  totalDuration: number; // 总时长（分钟）
  totalLessons: number;

  // 定价
  price: number;
  originalPrice?: number; // 原价（用于显示折扣）
  currency: string;

  // 评价
  rating: number;
  reviewCount: number;
  stats: CourseStats;

  // 学习目标和要求
  learningOutcomes: string[];
  requirements: string[];
  targetAudience: string[];

  // 状态和时间
  status: CourseStatus;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;

  // 其他
  language: string;
  subtitles: string[];
  certificate: boolean; // 是否提供证书
  lifetime: boolean; // 是否终身访问
}

// 课程卡片（列表展示用的简化版本）
export interface CourseCard {
  id: string;
  title: string;
  thumbnail: string;
  category: CourseCategory;
  level: CourseLevel;
  instructor: {
    name: string;
    avatar: string;
  };
  price: number;
  originalPrice?: number;
  rating: number;
  studentCount: number;
  totalDuration: number;
  totalLessons: number;
  updatedAt: string;
  isBestseller?: boolean;
  isNew?: boolean;
}

// 课程筛选参数
export interface CourseFilters {
  category?: CourseCategory[];
  level?: CourseLevel[];
  priceRange?: {
    min: number;
    max: number;
  };
  rating?: number; // 最低评分
  duration?: {
    min: number;
    max: number;
  };
  language?: string[];
  features?: ('certificate' | 'lifetime' | 'subtitles')[];
}

// 课程排序选项
export type CourseSortBy =
  | 'newest'
  | 'popular'
  | 'rating'
  | 'price-low'
  | 'price-high';

// 课程查询参数
export interface CourseQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  filters?: CourseFilters;
  sortBy?: CourseSortBy;
}

// 课程列表响应
export interface CourseListResponse {
  courses: CourseCard[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// 用户学习进度
export interface CourseProgress {
  courseId: string;
  userId: string;
  completedLessons: string[]; // 已完成的课时ID
  currentLesson?: string; // 当前正在学习的课时ID
  progress: number; // 0-100
  lastAccessedAt: string;
  startedAt: string;
  completedAt?: string;
  certificate?: {
    id: string;
    issuedAt: string;
    url: string;
  };
}

// 学习笔记
export interface CourseNote {
  id: string;
  courseId: string;
  lessonId: string;
  userId: string;
  content: string;
  timestamp?: number; // 视频时间戳（秒）
  createdAt: string;
  updatedAt: string;
}

// 课程问答
export interface CourseQuestion {
  id: string;
  courseId: string;
  lessonId?: string;
  userId: string;
  userName: string;
  userAvatar: string;
  title: string;
  content: string;
  answers: QuestionAnswer[];
  views: number;
  upvotes: number;
  createdAt: string;
  updatedAt: string;
  isResolved: boolean;
}

export interface QuestionAnswer {
  id: string;
  questionId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  upvotes: number;
  isAccepted: boolean; // 是否被采纳为最佳答案
  createdAt: string;
  updatedAt: string;
}
