import { api, publicApi } from '@/lib/api';
import type {
  User,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
} from '@/types/api';

/**
 * 认证相关API服务
 */
export const authApi = {
  /**
   * 用户登录
   */
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    return publicApi.post<LoginResponse>('/auth/login', credentials);
  },

  /**
   * 用户注册
   */
  register: async (userData: RegisterRequest): Promise<RegisterResponse> => {
    return publicApi.post<RegisterResponse>('/auth/register', userData);
  },

  /**
   * 用户登出
   */
  logout: async (): Promise<void> => {
    return api.post('/auth/logout');
  },

  /**
   * 获取当前用户信息
   */
  getCurrentUser: async (): Promise<User> => {
    return api.get<User>('/auth/profile');
  },

  /**
   * 更新用户信息
   */
  updateProfile: async (userData: Partial<User>): Promise<User> => {
    return api.put<User>('/auth/profile', userData);
  },

  /**
   * 修改密码
   */
  changePassword: async (data: {
    currentPassword: string;
    newPassword: string;
  }): Promise<void> => {
    return api.post('/auth/change-password', data);
  },

  /**
   * 忘记密码
   */
  forgotPassword: async (email: string): Promise<void> => {
    return publicApi.post('/auth/forgot-password', { email });
  },

  /**
   * 重置密码
   */
  resetPassword: async (data: {
    token: string;
    password: string;
  }): Promise<void> => {
    return publicApi.post('/auth/reset-password', data);
  },

  /**
   * 验证邮箱
   */
  verifyEmail: async (token: string): Promise<void> => {
    return publicApi.post('/auth/verify-email', { token });
  },

  /**
   * 重新发送验证邮件
   */
  resendVerificationEmail: async (): Promise<void> => {
    return api.post('/auth/resend-verification');
  },

  /**
   * 刷新访问令牌
   */
  refreshToken: async (refreshToken: string): Promise<LoginResponse> => {
    return publicApi.post<LoginResponse>('/auth/refresh', { refreshToken });
  },

  /**
   * 检查认证状态
   */
  checkAuth: async (): Promise<{ isAuthenticated: boolean; user?: User }> => {
    try {
      const user = await api.get<User>('/auth/me', {
        skipErrorNotification: true,
      });
      return { isAuthenticated: true, user };
    } catch {
      return { isAuthenticated: false };
    }
  },

  /**
   * 获取用户偏好设置
   */
  getPreferences: async (): Promise<User['preferences']> => {
    return api.get('/auth/preferences');
  },

  /**
   * 更新用户偏好设置
   */
  updatePreferences: async (
    preferences: User['preferences']
  ): Promise<User['preferences']> => {
    return api.put('/auth/preferences', preferences);
  },

  /**
   * 上传头像
   */
  uploadAvatar: async (file: File): Promise<{ avatarUrl: string }> => {
    return api.upload<{ avatarUrl: string }>('/auth/avatar', file);
  },

  /**
   * 删除账户
   */
  deleteAccount: async (password: string): Promise<void> => {
    return api.delete('/auth/account', {
      data: { password },
    });
  },

  /**
   * 获取登录历史
   */
  getLoginHistory: async (): Promise<
    Array<{
      id: string;
      ip: string;
      userAgent: string;
      location?: string;
      loginAt: string;
      isCurrentSession: boolean;
    }>
  > => {
    return api.get('/auth/login-history');
  },

  /**
   * 撤销会话
   */
  revokeSession: async (sessionId: string): Promise<void> => {
    return api.delete(`/auth/sessions/${sessionId}`);
  },

  /**
   * 撤销所有其他会话
   */
  revokeAllOtherSessions: async (): Promise<void> => {
    return api.delete('/auth/sessions/others');
  },

  /**
   * 启用两步验证
   */
  enableTwoFactor: async (): Promise<{
    qrCode: string;
    secret: string;
    backupCodes: string[];
  }> => {
    return api.post('/auth/2fa/enable');
  },

  /**
   * 确认两步验证
   */
  confirmTwoFactor: async (code: string): Promise<void> => {
    return api.post('/auth/2fa/confirm', { code });
  },

  /**
   * 禁用两步验证
   */
  disableTwoFactor: async (password: string): Promise<void> => {
    return api.post('/auth/2fa/disable', { password });
  },

  /**
   * 生成新的备份码
   */
  generateBackupCodes: async (): Promise<{ backupCodes: string[] }> => {
    return api.post('/auth/2fa/backup-codes');
  },

  /**
   * 社交登录
   */
  socialLogin: async (
    provider: 'google' | 'github' | 'wechat',
    code: string
  ): Promise<LoginResponse> => {
    return publicApi.post<LoginResponse>(`/auth/social/${provider}`, { code });
  },

  /**
   * 绑定社交账户
   */
  bindSocialAccount: async (
    provider: 'google' | 'github' | 'wechat',
    code: string
  ): Promise<void> => {
    return api.post(`/auth/social/bind/${provider}`, { code });
  },

  /**
   * 解绑社交账户
   */
  unbindSocialAccount: async (
    provider: 'google' | 'github' | 'wechat'
  ): Promise<void> => {
    return api.delete(`/auth/social/bind/${provider}`);
  },

  /**
   * 获取绑定的社交账户
   */
  getSocialAccounts: async (): Promise<
    Array<{
      provider: string;
      providerId: string;
      email?: string;
      name?: string;
      avatar?: string;
      bindAt: string;
    }>
  > => {
    return api.get('/auth/social/accounts');
  },
};
