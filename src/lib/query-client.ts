import { QueryClient, DefaultOptions } from '@tanstack/react-query';

/**
 * 默认查询选项
 */
const defaultOptions: DefaultOptions = {
  queries: {
    // 数据保持新鲜的时间（5分钟）
    staleTime: 5 * 60 * 1000,

    // 缓存时间（10分钟）
    gcTime: 10 * 60 * 1000,

    // 重试配置
    retry: (failureCount, error: any) => {
      // 对于4xx错误不重试
      if (error?.status >= 400 && error?.status < 500) {
        return false;
      }
      // 最多重试3次
      return failureCount < 3;
    },

    // 重试延迟（指数退避）
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),

    // 窗口重新获得焦点时重新获取数据
    refetchOnWindowFocus: false,

    // 网络重连时重新获取数据
    refetchOnReconnect: true,

    // 组件挂载时重新获取数据
    refetchOnMount: true,
  },
  mutations: {
    // 变更重试配置
    retry: (failureCount, error: any) => {
      // 对于4xx错误不重试
      if (error?.status >= 400 && error?.status < 500) {
        return false;
      }
      // 最多重试1次
      return failureCount < 1;
    },

    // 变更重试延迟
    retryDelay: 1000,
  },
};

/**
 * 创建查询客户端
 */
export const createQueryClient = () => {
  return new QueryClient({
    defaultOptions,
  });
};

/**
 * 查询键工厂
 * 用于生成一致的查询键
 */
export const queryKeys = {
  // 认证相关
  auth: {
    user: () => ['auth', 'user'] as const,
    profile: () => ['auth', 'profile'] as const,
  },

  // 课程相关
  courses: {
    all: () => ['courses'] as const,
    lists: () => ['courses', 'list'] as const,
    list: (filters: Record<string, any>) =>
      ['courses', 'list', filters] as const,
    details: () => ['courses', 'detail'] as const,
    detail: (id: string) => ['courses', 'detail', id] as const,
    progress: (id: string) => ['courses', 'progress', id] as const,
    enrollment: (id: string) => ['courses', 'enrollment', id] as const,
  },

  // 知识图谱相关
  knowledgeGraph: {
    all: () => ['knowledge-graph'] as const,
    nodes: () => ['knowledge-graph', 'nodes'] as const,
    node: (id: string) => ['knowledge-graph', 'nodes', id] as const,
    connections: (nodeId: string) =>
      ['knowledge-graph', 'connections', nodeId] as const,
  },

  // AI助手相关
  ai: {
    conversations: () => ['ai', 'conversations'] as const,
    conversation: (id: string) => ['ai', 'conversations', id] as const,
    recommendations: () => ['ai', 'recommendations'] as const,
  },

  // 社区相关
  community: {
    posts: () => ['community', 'posts'] as const,
    post: (id: string) => ['community', 'posts', id] as const,
    comments: (postId: string) => ['community', 'comments', postId] as const,
    users: () => ['community', 'users'] as const,
    user: (id: string) => ['community', 'users', id] as const,
  },

  // 用户相关
  user: {
    profile: () => ['user', 'profile'] as const,
    settings: () => ['user', 'settings'] as const,
    achievements: () => ['user', 'achievements'] as const,
    progress: () => ['user', 'progress'] as const,
  },
};

/**
 * 查询选项预设
 */
export const queryOptions = {
  // 实时数据（短缓存）
  realtime: {
    staleTime: 0,
    gcTime: 1 * 60 * 1000, // 1分钟
    refetchInterval: 30 * 1000, // 30秒轮询
  },

  // 静态数据（长缓存）
  static: {
    staleTime: 60 * 60 * 1000, // 1小时
    gcTime: 24 * 60 * 60 * 1000, // 24小时
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  },

  // 用户特定数据
  userSpecific: {
    staleTime: 2 * 60 * 1000, // 2分钟
    gcTime: 10 * 60 * 1000, // 10分钟
  },

  // 无限查询
  infinite: {
    staleTime: 5 * 60 * 1000, // 5分钟
    gcTime: 10 * 60 * 1000, // 10分钟
    getNextPageParam: (lastPage: any) => {
      if (lastPage?.pagination?.hasNext) {
        return lastPage.pagination.page + 1;
      }
      return undefined;
    },
  },
};

/**
 * 变更选项预设
 */
export const mutationOptions = {
  // 乐观更新
  optimistic: {
    onMutate: async () => {
      // 取消相关查询以避免冲突
      // 返回上下文用于回滚
      return { previousData: null };
    },
    onError: (error: any, variables: any, context: any) => {
      // 回滚乐观更新
      if (context?.previousData) {
        // 恢复之前的数据
      }
    },
    onSettled: () => {
      // 无论成功还是失败都重新获取数据
    },
  },

  // 成功后失效相关查询
  invalidateOnSuccess: {
    onSuccess: () => {
      // 失效相关查询
    },
  },
};
