'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Card,
  CardContent,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Badge,
  Button,
  Avatar,
  AvatarFallback,
  AvatarImage,
  Input,
  EnhancedCard,
  PageLayout,
} from '@/components/unified';
import { Aurora } from '@/components/reactbit';
import {
  Heart,
  MessageCircle,
  Share2,
  TrendingUp,
  Users,
  Plus,
  Search,
  Filter,
  Clock,
  Eye,
  Star,
  BookOpen,
  Code,
  Lightbulb,
  HelpCircle,
} from 'lucide-react';
import { WalletGuard } from '@/components/auth/WalletGuard';

// 社区帖子类型
interface CommunityPost {
  id: string;
  title: string;
  content: string;
  author: {
    id: string;
    name: string;
    avatar: string;
    role: string;
    level: number;
  };
  category: string;
  tags: string[];
  likes: number;
  comments: number;
  views: number;
  createdAt: string;
  isLiked: boolean;
  isBookmarked: boolean;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
}

// 社区分类
interface CommunityCategory {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  postCount: number;
  color: string;
}

/**
 * 社区页面
 */
export default function CommunityPage() {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('trending');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // 社区分类
  const categories: CommunityCategory[] = [
    {
      id: 'all',
      name: '全部',
      description: '所有社区内容',
      icon: <Users className="h-5 w-5" />,
      postCount: 1234,
      color: 'bg-blue-500',
    },
    {
      id: 'learning',
      name: '学习交流',
      description: '学习心得与经验分享',
      icon: <BookOpen className="h-5 w-5" />,
      postCount: 456,
      color: 'bg-green-500',
    },
    {
      id: 'coding',
      name: '编程技术',
      description: '编程技术讨论与问答',
      icon: <Code className="h-5 w-5" />,
      postCount: 789,
      color: 'bg-purple-500',
    },
    {
      id: 'ideas',
      name: '创意分享',
      description: '创新想法与项目展示',
      icon: <Lightbulb className="h-5 w-5" />,
      postCount: 234,
      color: 'bg-yellow-500',
    },
    {
      id: 'qa',
      name: '问答求助',
      description: '学习问题求助与解答',
      icon: <HelpCircle className="h-5 w-5" />,
      postCount: 567,
      color: 'bg-red-500',
    },
  ];

  // 模拟社区帖子数据
  const [posts, setPosts] = useState<CommunityPost[]>([
    {
      id: '1',
      title: 'React 18 新特性深度解析：Concurrent Features 实战指南',
      content:
        '最近深入研究了 React 18 的并发特性，包括 Suspense、useTransition 等新 API。这些特性能够显著提升用户体验，特别是在处理大量数据渲染时...',
      author: {
        id: '1',
        name: '前端小王',
        avatar: '/avatars/user1.jpg',
        role: '高级开发者',
        level: 8,
      },
      category: 'coding',
      tags: ['React', 'JavaScript', '前端开发'],
      likes: 156,
      comments: 23,
      views: 1234,
      createdAt: '2024-01-07T10:30:00Z',
      isLiked: false,
      isBookmarked: true,
      difficulty: 'intermediate',
    },
    {
      id: '2',
      title: '从零开始学习机器学习：我的100天学习计划分享',
      content:
        '作为一个前端开发者，我决定挑战自己，用100天时间学习机器学习。今天是第30天，想和大家分享一下我的学习心得和遇到的挑战...',
      author: {
        id: '2',
        name: '学习达人',
        avatar: '/avatars/user2.jpg',
        role: '学习者',
        level: 3,
      },
      category: 'learning',
      tags: ['机器学习', '学习计划', '经验分享'],
      likes: 89,
      comments: 15,
      views: 567,
      createdAt: '2024-01-06T15:20:00Z',
      isLiked: true,
      isBookmarked: false,
      difficulty: 'beginner',
    },
    {
      id: '3',
      title: '创意项目：用 Three.js 打造沉浸式 3D 学习环境',
      content:
        '最近完成了一个有趣的项目，使用 Three.js 创建了一个 3D 的虚拟学习空间。用户可以在其中漫游，与不同的学习内容进行交互...',
      author: {
        id: '3',
        name: '3D 创作者',
        avatar: '/avatars/user3.jpg',
        role: '创意开发者',
        level: 6,
      },
      category: 'ideas',
      tags: ['Three.js', '3D', '创意项目'],
      likes: 234,
      comments: 31,
      views: 890,
      createdAt: '2024-01-05T09:15:00Z',
      isLiked: false,
      isBookmarked: true,
      difficulty: 'advanced',
    },
  ]);

  useEffect(() => {
    // 模拟数据加载
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // 处理点赞
  const handleLike = (postId: string) => {
    setPosts(
      posts.map((post) =>
        post.id === postId
          ? {
              ...post,
              isLiked: !post.isLiked,
              likes: post.isLiked ? post.likes - 1 : post.likes + 1,
            }
          : post
      )
    );
  };

  // 处理收藏
  const handleBookmark = (postId: string) => {
    setPosts(
      posts.map((post) =>
        post.id === postId
          ? { ...post, isBookmarked: !post.isBookmarked }
          : post
      )
    );
  };

  // 获取难度标签颜色
  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-500/20 text-green-600 dark:text-green-400';
      case 'intermediate':
        return 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-400';
      case 'advanced':
        return 'bg-red-500/20 text-red-600 dark:text-red-400';
      default:
        return 'bg-gray-500/20 text-gray-600 dark:text-gray-400';
    }
  };

  // 获取难度标签文本
  const getDifficultyText = (difficulty?: string) => {
    switch (difficulty) {
      case 'beginner':
        return '初级';
      case 'intermediate':
        return '中级';
      case 'advanced':
        return '高级';
      default:
        return '通用';
    }
  };

  if (loading) {
    return (
      <div className="bg-background relative min-h-screen w-full overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Aurora
            colorStops={['#6366f1', '#ef4444', '#FFE600']}
            blend={0.5}
            amplitude={1.0}
            speed={0.5}
          />
        </div>

        <div className="container relative z-10 mx-auto space-y-8 px-4 py-20">
          <div className="h-8 w-48 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
            <div className="lg:col-span-1">
              <div className="h-96 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700" />
            </div>
            <div className="lg:col-span-3">
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div
                    key={index}
                    className="h-48 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background relative min-h-screen w-full overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Aurora
          colorStops={['#6366f1', '#ef4444', '#FFE600']}
          blend={0.5}
          amplitude={1.0}
          speed={0.5}
        />
      </div>

      <main className="relative z-10">
        <WalletGuard>
          <PageLayout
            title="学习社区"
            subtitle="与全球学习者一起交流、分享、成长"
            backgroundClass=""
          >
            {/* 主要内容区域 */}
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
            {/* 左侧边栏 - 分类和统计 */}
            <div className="lg:col-span-1">
              <div className="space-y-6">
                {/* 快速操作 */}
                <EnhancedCard variant="glow" className="p-6">
                  <h3 className="mb-4 text-lg font-semibold">快速操作</h3>
                  <div className="space-y-3">
                    <Button className="w-full justify-start" variant="default">
                      <Plus className="mr-2 h-4 w-4" />
                      发布帖子
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <Search className="mr-2 h-4 w-4" />
                      搜索内容
                    </Button>
                  </div>
                </EnhancedCard>

                {/* 社区分类 */}
                <EnhancedCard variant="glow" className="p-6">
                  <h3 className="mb-4 text-lg font-semibold">社区分类</h3>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        className={`flex w-full items-center justify-between rounded-lg p-3 text-left transition-colors ${
                          selectedCategory === category.id
                            ? 'bg-blue-500/20 text-blue-600 dark:text-blue-400'
                            : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div
                            className={`rounded-lg p-1.5 text-white ${category.color}`}
                          >
                            {category.icon}
                          </div>
                          <div>
                            <p className="font-medium">{category.name}</p>
                            <p className="text-xs text-gray-500">
                              {category.postCount} 帖子
                            </p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </EnhancedCard>
              </div>
            </div>

            {/* 主要内容区域 */}
            <div className="lg:col-span-3">
              <div className="space-y-6">
                {/* 搜索和筛选 */}
                <EnhancedCard variant="glow" className="p-6">
                  <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                    <div className="max-w-md flex-1">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <Input
                          placeholder="搜索帖子、用户或标签..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Filter className="mr-2 h-4 w-4" />
                        筛选
                      </Button>
                    </div>
                  </div>
                </EnhancedCard>

                {/* 内容选项卡 */}
                <EnhancedCard variant="glow" className="p-6">
                  <Tabs
                    value={activeTab}
                    onValueChange={setActiveTab}
                    className="w-full"
                  >
                    <TabsList className="grid w-full grid-cols-4 border border-white/20 bg-white/10 dark:bg-white/5">
                      <TabsTrigger
                        value="trending"
                        className="data-[state=active]:bg-white/20 data-[state=active]:text-gray-900 dark:data-[state=active]:text-white"
                      >
                        <TrendingUp className="mr-2 h-4 w-4" />
                        热门
                      </TabsTrigger>
                      <TabsTrigger
                        value="latest"
                        className="data-[state=active]:bg-white/20 data-[state=active]:text-gray-900 dark:data-[state=active]:text-white"
                      >
                        <Clock className="mr-2 h-4 w-4" />
                        最新
                      </TabsTrigger>
                      <TabsTrigger
                        value="following"
                        className="data-[state=active]:bg-white/20 data-[state=active]:text-gray-900 dark:data-[state=active]:text-white"
                      >
                        <Users className="mr-2 h-4 w-4" />
                        关注
                      </TabsTrigger>
                      <TabsTrigger
                        value="bookmarked"
                        className="data-[state=active]:bg-white/20 data-[state=active]:text-gray-900 dark:data-[state=active]:text-white"
                      >
                        <Star className="mr-2 h-4 w-4" />
                        收藏
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value={activeTab} className="mt-6">
                      <div className="space-y-6">
                        {posts.map((post, index) => (
                          <motion.div
                            key={post.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                          >
                            <Card className="overflow-hidden transition-shadow hover:shadow-lg">
                              <CardContent className="p-6">
                                {/* 帖子头部 */}
                                <div className="mb-4 flex items-start justify-between">
                                  <div className="flex items-center space-x-3">
                                    <Avatar className="h-10 w-10">
                                      <AvatarImage
                                        src={post.author.avatar}
                                        alt={post.author.name}
                                      />
                                      <AvatarFallback>
                                        {post.author.name.slice(0, 2)}
                                      </AvatarFallback>
                                    </Avatar>
                                    <div>
                                      <div className="flex items-center space-x-2">
                                        <p className="font-medium">
                                          {post.author.name}
                                        </p>
                                        <Badge
                                          variant="secondary"
                                          className="text-xs"
                                        >
                                          Lv.{post.author.level}
                                        </Badge>
                                      </div>
                                      <p className="text-sm text-gray-500">
                                        {post.author.role}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <p className="text-sm text-gray-500">
                                      {new Date(
                                        post.createdAt
                                      ).toLocaleDateString('zh-CN')}
                                    </p>
                                    <div className="mt-1 flex items-center space-x-2 text-xs text-gray-400">
                                      <Eye className="h-3 w-3" />
                                      <span>{post.views}</span>
                                    </div>
                                  </div>
                                </div>

                                {/* 帖子标题 */}
                                <h3 className="mb-3 cursor-pointer text-xl font-semibold transition-colors hover:text-blue-600">
                                  {post.title}
                                </h3>

                                {/* 帖子内容预览 */}
                                <p className="mb-4 line-clamp-3 text-gray-600 dark:text-gray-300">
                                  {post.content}
                                </p>

                                {/* 标签和难度 */}
                                <div className="mb-4 flex flex-wrap items-center gap-2">
                                  {post.tags.map((tag) => (
                                    <Badge
                                      key={tag}
                                      variant="outline"
                                      className="text-xs"
                                    >
                                      #{tag}
                                    </Badge>
                                  ))}
                                  {post.difficulty && (
                                    <Badge
                                      className={`text-xs ${getDifficultyColor(post.difficulty)}`}
                                    >
                                      {getDifficultyText(post.difficulty)}
                                    </Badge>
                                  )}
                                </div>

                                {/* 帖子操作 */}
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-4">
                                    <button
                                      onClick={() => handleLike(post.id)}
                                      className={`flex items-center space-x-1 transition-colors ${
                                        post.isLiked
                                          ? 'text-red-500'
                                          : 'text-gray-500 hover:text-red-500'
                                      }`}
                                    >
                                      <Heart
                                        className={`h-4 w-4 ${post.isLiked ? 'fill-current' : ''}`}
                                      />
                                      <span className="text-sm">
                                        {post.likes}
                                      </span>
                                    </button>
                                    <button className="flex items-center space-x-1 text-gray-500 transition-colors hover:text-blue-500">
                                      <MessageCircle className="h-4 w-4" />
                                      <span className="text-sm">
                                        {post.comments}
                                      </span>
                                    </button>
                                    <button className="flex items-center space-x-1 text-gray-500 transition-colors hover:text-green-500">
                                      <Share2 className="h-4 w-4" />
                                      <span className="text-sm">分享</span>
                                    </button>
                                  </div>
                                  <button
                                    onClick={() => handleBookmark(post.id)}
                                    className={`transition-colors ${
                                      post.isBookmarked
                                        ? 'text-yellow-500'
                                        : 'text-gray-500 hover:text-yellow-500'
                                    }`}
                                  >
                                    <Star
                                      className={`h-4 w-4 ${post.isBookmarked ? 'fill-current' : ''}`}
                                    />
                                  </button>
                                </div>
                              </CardContent>
                            </Card>
                          </motion.div>
                        ))}
                      </div>
                    </TabsContent>
                  </Tabs>
                </EnhancedCard>
              </div>
            </div>
            </div>
          </PageLayout>
        </WalletGuard>
      </main>
    </div>
  );
}
