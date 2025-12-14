import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

/**
 * 主题类型
 */
export type Theme = 'light' | 'dark' | 'system';

/**
 * 语言类型
 */
export type Language = 'zh-CN' | 'en-US';

/**
 * AI Chat Configuration
 */
export interface AIChatConfig {
  enabled: boolean;
  position: 'sidebar' | 'bottom' | 'float';
  visible: boolean;
}

/**
 * 通知类型
 */
export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

/**
 * 模态框状态
 */
export interface Modal {
  id: string;
  type?: 'modal' | 'drawer' | 'confirm';
  isOpen: boolean;
  title?: string;
  description?: string;
  content?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  animation?: 'fade' | 'scale' | 'slide-up' | 'slide-down' | 'bounce';
  side?: 'top' | 'right' | 'bottom' | 'left';
  variant?: 'default' | 'destructive';
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  footer?: React.ReactNode;
  className?: string;
  onClose?: () => void;
}

/**
 * UI状态接口
 */
export interface UIState {
  // 主题相关
  theme: Theme;
  isDarkMode: boolean;

  // 语言相关
  language: Language;

  // 布局相关
  sidebarCollapsed: boolean;
  sidebarOpen: boolean;

  // 通知相关
  notifications: Notification[];

  // 模态框相关
  modals: Modal[];

  // 加载状态
  globalLoading: boolean;

  // AI Chat Config
  aiChatConfig: AIChatConfig;

  // 操作
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  setLanguage: (language: Language) => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
  openModal: (modal: Omit<Modal, 'isOpen'>) => void;
  closeModal: (id: string) => void;
  closeAllModals: () => void;
  setGlobalLoading: (loading: boolean) => void;
  setAIChatConfig: (config: Partial<AIChatConfig>) => void;
  toggleAIChatVisibility: () => void;
}

/**
 * UI状态管理
 */
export const useUIStore = create<UIState>()(
  devtools(
    persist(
      (set, get) => ({
        // 初始状态
        theme: 'system',
        isDarkMode: false,
        language: 'zh-CN',
        sidebarCollapsed: false,
        sidebarOpen: false,
        notifications: [],
        modals: [],
        globalLoading: false,
        aiChatConfig: {
          enabled: true,
          position: 'sidebar',
          visible: true,
        },

        // 设置主题
        setTheme: (theme: Theme) => {
          set({ theme });

          // 更新实际的暗色模式状态
          if (theme === 'system') {
            const isDark = window.matchMedia(
              '(prefers-color-scheme: dark)'
            ).matches;
            set({ isDarkMode: isDark });
          } else {
            set({ isDarkMode: theme === 'dark' });
          }

          // 更新DOM类名
          const root = document.documentElement;
          if (get().isDarkMode) {
            root.classList.add('dark');
          } else {
            root.classList.remove('dark');
          }
        },

        // 切换主题
        toggleTheme: () => {
          const currentTheme = get().theme;
          const newTheme = currentTheme === 'light' ? 'dark' : 'light';
          get().setTheme(newTheme);
        },

        // 设置语言
        setLanguage: (language: Language) => {
          set({ language });

          // 更新HTML lang属性
          document.documentElement.lang = language;
        },

        // 设置侧边栏折叠状态
        setSidebarCollapsed: (collapsed: boolean) => {
          set({ sidebarCollapsed: collapsed });
        },

        // 设置侧边栏开启状态（移动端）
        setSidebarOpen: (open: boolean) => {
          set({ sidebarOpen: open });
        },

        // 切换侧边栏
        toggleSidebar: () => {
          const { sidebarCollapsed, sidebarOpen } = get();

          // 桌面端切换折叠状态
          if (window.innerWidth >= 1024) {
            set({ sidebarCollapsed: !sidebarCollapsed });
          } else {
            // 移动端切换开启状态
            set({ sidebarOpen: !sidebarOpen });
          }
        },

        // 添加通知
        addNotification: (notification: Omit<Notification, 'id'>) => {
          const id =
            Date.now().toString() + Math.random().toString(36).substr(2, 9);
          const newNotification: Notification = {
            id,
            duration: 5000, // 默认5秒
            ...notification,
          };

          set((state) => ({
            notifications: [...state.notifications, newNotification],
          }));

          // 自动移除通知
          if (newNotification.duration && newNotification.duration > 0) {
            setTimeout(() => {
              get().removeNotification(id);
            }, newNotification.duration);
          }
        },

        // 移除通知
        removeNotification: (id: string) => {
          set((state) => ({
            notifications: state.notifications.filter((n) => n.id !== id),
          }));
        },

        // 清除所有通知
        clearNotifications: () => {
          set({ notifications: [] });
        },

        // 打开模态框
        openModal: (modal: Omit<Modal, 'isOpen'>) => {
          const newModal: Modal = {
            ...modal,
            isOpen: true,
          };

          set((state) => ({
            modals: [
              ...state.modals.filter((m) => m.id !== modal.id),
              newModal,
            ],
          }));
        },

        // 关闭模态框
        closeModal: (id: string) => {
          set((state) => ({
            modals: state.modals.map((modal) =>
              modal.id === id ? { ...modal, isOpen: false } : modal
            ),
          }));

          // 延迟移除模态框，给关闭动画时间
          setTimeout(() => {
            set((state) => ({
              modals: state.modals.filter((m) => m.id !== id),
            }));
          }, 300);
        },

        // 关闭所有模态框
        closeAllModals: () => {
          set((state) => ({
            modals: state.modals.map((modal) => ({ ...modal, isOpen: false })),
          }));

          setTimeout(() => {
            set({ modals: [] });
          }, 300);
        },

        // 设置全局加载状态
        setGlobalLoading: (loading: boolean) => {
          set({ globalLoading: loading });
        },

        // Set AI Chat Config
        setAIChatConfig: (config: Partial<AIChatConfig>) => {
          set((state) => ({
            aiChatConfig: { ...state.aiChatConfig, ...config },
          }));
        },

        // Toggle AI Chat Visibility
        toggleAIChatVisibility: () => {
          set((state) => ({
            aiChatConfig: {
              ...state.aiChatConfig,
              visible: !state.aiChatConfig.visible,
            },
          }));
        },
      }),
      {
        name: 'ui-storage',
        // 只持久化用户偏好设置
        partialize: (state) => ({
          theme: state.theme,
          language: state.language,
          sidebarCollapsed: state.sidebarCollapsed,
          aiChatConfig: state.aiChatConfig,
        }),
        version: 1,
      }
    ),
    {
      name: 'ui-store',
    }
  )
);

/**
 * UI状态选择器
 */
export const uiSelectors = {
  // 主题相关
  theme: (state: UIState) => state.theme,
  isDarkMode: (state: UIState) => state.isDarkMode,

  // 语言相关
  language: (state: UIState) => state.language,

  // 布局相关
  sidebarCollapsed: (state: UIState) => state.sidebarCollapsed,
  sidebarOpen: (state: UIState) => state.sidebarOpen,

  // 通知相关
  notifications: (state: UIState) => state.notifications,
  hasNotifications: (state: UIState) => state.notifications.length > 0,

  // 模态框相关
  modals: (state: UIState) => state.modals,
  openModals: (state: UIState) => state.modals.filter((m) => m.isOpen),
  hasOpenModals: (state: UIState) => state.modals.some((m) => m.isOpen),

  // 加载状态
  globalLoading: (state: UIState) => state.globalLoading,

  // AI Chat
  aiChatConfig: (state: UIState) => state.aiChatConfig,
};

/**
 * 通知工具函数
 */
export const notificationHelpers = {
  success: (title: string, message?: string) => {
    useUIStore.getState().addNotification({
      type: 'success',
      title,
      message,
    });
  },

  error: (title: string, message?: string) => {
    useUIStore.getState().addNotification({
      type: 'error',
      title,
      message,
      duration: 8000, // 错误通知显示更长时间
    });
  },

  warning: (title: string, message?: string) => {
    useUIStore.getState().addNotification({
      type: 'warning',
      title,
      message,
    });
  },

  info: (title: string, message?: string) => {
    useUIStore.getState().addNotification({
      type: 'info',
      title,
      message,
    });
  },
};
