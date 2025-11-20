import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

/**
 * 用户信息接口
 */
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string | null;
  role: 'user' | 'admin';
  createdAt?: string;
  updatedAt?: string;
}

/**
 * 认证状态接口
 */
export interface AuthState {
  // 状态
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // 操作
  login: (email: string, password: string, remember?: boolean) => Promise<void>;
  logout: () => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  updateUser: (userData: Partial<User>) => void;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
  checkAuth: () => Promise<void>;

  // 密码重置
  forgotPassword: (email: string) => Promise<string>;
  resetPassword: (data: { token: string; password: string }) => Promise<void>;

  // 社交登录
  socialLogin: (
    provider: 'google' | 'github' | 'wechat',
    code: string
  ) => Promise<void>;
}

/**
 * 注册数据接口
 */
export interface RegisterData {
  email: string;
  password: string;
  name: string;
  firstName?: string;
  lastName?: string;
}

/**
 * 认证状态管理
 */
export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set, get) => ({
        // 初始状态
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,

        // 登录操作（纯前端模拟）
        login: async (email: string, password: string, remember = false) => {
          set({ isLoading: true, error: null });

          try {
            // 模拟网络延迟
            await new Promise((resolve) => setTimeout(resolve, 1000));

            // 模拟用户数据
            const mockUsers = [
              {
                id: '1',
                email: 'user@example.com',
                password: 'password123',
                name: '张三',
                avatar: null,
                role: 'user' as const,
              },
              {
                id: '2',
                email: 'admin@example.com',
                password: 'admin123',
                name: '管理员',
                avatar: null,
                role: 'admin' as const,
              },
            ];

            // 验证用户凭据
            const user = mockUsers.find(
              (u) => u.email === email && u.password === password
            );

            if (!user) {
              throw new Error('邮箱或密码错误');
            }

            // 生成模拟 token
            const token = btoa(
              JSON.stringify({
                userId: user.id,
                email: user.email,
                role: user.role,
                exp:
                  Date.now() +
                  (remember ? 7 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000), // 7天或1天
              })
            );

            // 创建用户对象（排除密码）
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { password: _, ...userWithoutPassword } = user;

            set({
              user: userWithoutPassword,
              token,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });
          } catch (error) {
            set({
              user: null,
              token: null,
              isAuthenticated: false,
              isLoading: false,
              error: error instanceof Error ? error.message : '登录失败',
            });
            throw error;
          }
        },

        // 登出操作（纯前端）
        logout: async () => {
          set({ isLoading: true });

          try {
            // 模拟网络延迟
            await new Promise((resolve) => setTimeout(resolve, 500));

            // 清除本地状态
            set({
              user: null,
              token: null,
              isAuthenticated: false,
              isLoading: false,
              error: null,
            });

            // 清除本地存储
            if (typeof window !== 'undefined') {
              localStorage.removeItem('auth-token');
              localStorage.removeItem('user-info');
            }
          } catch (error) {
            console.error('Logout failed:', error);
            // 即使出错也要清除状态
            set({
              user: null,
              token: null,
              isAuthenticated: false,
              isLoading: false,
              error: null,
            });
          }
        },

        // 注册操作（纯前端模拟）
        register: async (userData: RegisterData) => {
          set({ isLoading: true, error: null });

          try {
            // 模拟网络延迟
            await new Promise((resolve) => setTimeout(resolve, 1500));

            // 简单的验证
            if (!userData.email || !userData.password || !userData.name) {
              throw new Error('请填写所有必填字段');
            }

            if (userData.password.length < 6) {
              throw new Error('密码长度至少6位');
            }

            // 检查邮箱是否已存在（模拟）
            const existingEmails = ['user@example.com', 'admin@example.com'];
            if (existingEmails.includes(userData.email)) {
              throw new Error('该邮箱已被注册');
            }

            // 创建新用户
            const newUser = {
              id: Date.now().toString(),
              email: userData.email,
              name: userData.name,
              avatar: null,
              role: 'user' as const,
            };

            // 生成模拟 token
            const token = btoa(
              JSON.stringify({
                userId: newUser.id,
                email: newUser.email,
                role: newUser.role,
                exp: Date.now() + 24 * 60 * 60 * 1000, // 1天
              })
            );

            set({
              user: newUser,
              token,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });
          } catch (error) {
            set({
              user: null,
              token: null,
              isAuthenticated: false,
              isLoading: false,
              error: error instanceof Error ? error.message : '注册失败',
            });
            throw error;
          }
        },

        // 更新用户信息
        updateUser: (userData: Partial<User>) => {
          const currentUser = get().user;
          if (currentUser) {
            set({
              user: { ...currentUser, ...userData },
            });
          }
        },

        // 清除错误
        clearError: () => {
          set({ error: null });
        },

        // 设置加载状态
        setLoading: (loading: boolean) => {
          set({ isLoading: loading });
        },

        // 检查认证状态（纯前端验证）
        checkAuth: async () => {
          const token = get().token;

          if (!token) {
            set({
              user: null,
              token: null,
              isAuthenticated: false,
              isLoading: false,
            });
            return;
          }

          set({ isLoading: true });

          try {
            // 解析 token 检查是否过期
            const tokenData = JSON.parse(atob(token));
            const isExpired = Date.now() > tokenData.exp;

            if (isExpired) {
              // token 已过期，清除状态
              set({
                user: null,
                token: null,
                isAuthenticated: false,
                isLoading: false,
                error: null,
              });

              // 清除本地存储
              if (typeof window !== 'undefined') {
                localStorage.removeItem('auth-token');
                localStorage.removeItem('user-info');
              }
            } else {
              // token 有效，保持当前状态
              set({
                isAuthenticated: true,
                isLoading: false,
                error: null,
              });
            }
          } catch (error) {
            console.error('Auth check error:', error);
            set({
              user: null,
              token: null,
              isAuthenticated: false,
              isLoading: false,
              error: null,
            });
          }
        },

        // 忘记密码
        forgotPassword: async (email: string) => {
          set({ isLoading: true, error: null });

          try {
            // 模拟网络延迟
            await new Promise((resolve) => setTimeout(resolve, 1000));

            // 简单的邮箱格式验证
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
              throw new Error('请输入有效的邮箱地址');
            }

            // 模拟检查邮箱是否存在
            const existingEmails = ['user@example.com', 'admin@example.com'];
            if (!existingEmails.includes(email)) {
              throw new Error('该邮箱未注册');
            }

            set({
              isLoading: false,
              error: null,
            });

            return '重置密码邮件已发送到您的邮箱，请查收';
          } catch (error) {
            set({
              isLoading: false,
              error:
                error instanceof Error ? error.message : '发送重置邮件失败',
            });
            throw error;
          }
        },

        // 重置密码（纯前端模拟）
        resetPassword: async (data: { token: string; password: string }) => {
          set({ isLoading: true, error: null });

          try {
            // 模拟网络延迟
            await new Promise((resolve) => setTimeout(resolve, 1000));

            // 验证密码强度
            if (data.password.length < 6) {
              throw new Error('密码长度至少6位');
            }

            // 模拟验证重置 token
            if (!data.token || data.token.length < 10) {
              throw new Error('重置链接无效或已过期');
            }

            set({
              isLoading: false,
              error: null,
            });

            // 密码重置成功，可以跳转到登录页面
          } catch (error) {
            set({
              isLoading: false,
              error: error instanceof Error ? error.message : '重置密码失败',
            });
            throw error;
          }
        },

        // 社交登录（纯前端模拟）
        socialLogin: async (
          provider: 'google' | 'github' | 'wechat',
          code: string
        ) => {
          set({ isLoading: true, error: null });

          try {
            // 模拟网络延迟
            await new Promise((resolve) => setTimeout(resolve, 1500));

            // 模拟社交登录验证
            if (!code || code.length < 5) {
              throw new Error('授权码无效');
            }

            // 根据不同的社交平台创建模拟用户
            const socialUsers = {
              google: {
                id: 'google_' + Date.now(),
                email: 'user@gmail.com',
                name: 'Google 用户',
                avatar: 'https://lh3.googleusercontent.com/a/default-user',
                role: 'user' as const,
              },
              github: {
                id: 'github_' + Date.now(),
                email: 'user@github.com',
                name: 'GitHub 用户',
                avatar: 'https://github.com/identicons/default.png',
                role: 'user' as const,
              },
              wechat: {
                id: 'wechat_' + Date.now(),
                email: 'user@wechat.com',
                name: '微信用户',
                avatar: null,
                role: 'user' as const,
              },
            };

            const user = socialUsers[provider];

            // 生成模拟 token
            const token = btoa(
              JSON.stringify({
                userId: user.id,
                email: user.email,
                role: user.role,
                provider,
                exp: Date.now() + 24 * 60 * 60 * 1000, // 1天
              })
            );

            set({
              user,
              token,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });
          } catch (error) {
            set({
              user: null,
              token: null,
              isAuthenticated: false,
              isLoading: false,
              error: error instanceof Error ? error.message : '社交登录失败',
            });
            throw error;
          }
        },
      }),
      {
        name: 'auth-storage',
        // 只持久化必要的数据
        partialize: (state) => ({
          user: state.user,
          token: state.token,
          isAuthenticated: state.isAuthenticated,
        }),
        // 版本控制，用于数据迁移
        version: 1,
        // 数据迁移函数
        migrate: (persistedState: any, version: number) => {
          if (version === 0) {
            // 从版本0迁移到版本1的逻辑
            return persistedState;
          }
          return persistedState;
        },
      }
    ),
    {
      name: 'auth-store',
    }
  )
);

/**
 * 认证状态选择器
 */
export const authSelectors = {
  // 获取用户信息
  user: (state: AuthState) => state.user,

  // 获取认证状态
  isAuthenticated: (state: AuthState) => state.isAuthenticated,

  // 获取加载状态
  isLoading: (state: AuthState) => state.isLoading,

  // 获取错误信息
  error: (state: AuthState) => state.error,

  // 检查用户角色
  isAdmin: (state: AuthState) => state.user?.role === 'admin',

  // 获取用户显示名称
  displayName: (state: AuthState) =>
    state.user?.name || state.user?.email || '未知用户',
};
