import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

/**
 * 购物车商品接口
 */
export interface CartItem {
  id: string;
  courseId: string;
  title: string;
  price: number;
  originalPrice?: number;
  thumbnail?: string;
  instructor: string;
  addedAt: string;
}

/**
 * 购物车状态接口
 */
export interface CartState {
  // 状态
  items: CartItem[];
  isLoading: boolean;
  error: string | null;

  // 计算属性
  totalItems: number;
  totalPrice: number;
  totalSavings: number;

  // 操作
  addToCart: (courseId: string) => Promise<void>;
  removeFromCart: (courseId: string) => void;
  clearCart: () => void;
  updateQuantity: (courseId: string, quantity: number) => void;
  isInCart: (courseId: string) => boolean;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;

  // 批量操作
  addMultipleToCart: (courseIds: string[]) => Promise<void>;
  removeMultipleFromCart: (courseIds: string[]) => void;
}

/**
 * 购物车 Store
 */
export const useCartStore = create<CartState>()(
  devtools(
    persist(
      (set, get) => ({
        // 初始状态
        items: [],
        isLoading: false,
        error: null,

        // 计算属性
        get totalItems() {
          return get().items.length;
        },

        get totalPrice() {
          return get().items.reduce((total, item) => total + item.price, 0);
        },

        get totalSavings() {
          return get().items.reduce((total, item) => {
            const savings = item.originalPrice
              ? item.originalPrice - item.price
              : 0;
            return total + savings;
          }, 0);
        },

        // 操作方法
        addToCart: async (courseId: string) => {
          const { items, isInCart } = get();

          // 检查是否已在购物车中
          if (isInCart(courseId)) {
            set({ error: '课程已在购物车中' });
            return;
          }

          set({ isLoading: true, error: null });

          try {
            // 模拟 API 调用获取课程信息
            // 在实际应用中，这里应该调用 API 获取课程详情
            const mockCourseData: CartItem = {
              id: `cart-${Date.now()}`,
              courseId,
              title: `课程 ${courseId}`,
              price: 299,
              originalPrice: 399,
              thumbnail: '',
              instructor: '讲师名称',
              addedAt: new Date().toISOString(),
            };

            set({
              items: [...items, mockCourseData],
              isLoading: false,
            });
          } catch {
            set({
              error: '添加到购物车失败',
              isLoading: false,
            });
          }
        },

        removeFromCart: (courseId: string) => {
          const { items } = get();
          set({
            items: items.filter((item) => item.courseId !== courseId),
            error: null,
          });
        },

        clearCart: () => {
          set({
            items: [],
            error: null,
          });
        },

        updateQuantity: (courseId: string, quantity: number) => {
          // 对于课程，通常不需要数量概念，但保留接口以备扩展
          if (quantity <= 0) {
            get().removeFromCart(courseId);
          }
        },

        isInCart: (courseId: string) => {
          const { items } = get();
          return items.some((item) => item.courseId === courseId);
        },

        setLoading: (loading: boolean) => {
          set({ isLoading: loading });
        },

        setError: (error: string | null) => {
          set({ error });
        },

        clearError: () => {
          set({ error: null });
        },

        // 批量操作
        addMultipleToCart: async (courseIds: string[]) => {
          set({ isLoading: true, error: null });

          try {
            const { items } = get();
            const newItems: CartItem[] = [];

            for (const courseId of courseIds) {
              if (!get().isInCart(courseId)) {
                // 模拟 API 调用
                const mockCourseData: CartItem = {
                  id: `cart-${Date.now()}-${courseId}`,
                  courseId,
                  title: `课程 ${courseId}`,
                  price: 299,
                  originalPrice: 399,
                  thumbnail: '',
                  instructor: '讲师名称',
                  addedAt: new Date().toISOString(),
                };
                newItems.push(mockCourseData);
              }
            }

            set({
              items: [...items, ...newItems],
              isLoading: false,
            });
          } catch {
            set({
              error: '批量添加到购物车失败',
              isLoading: false,
            });
          }
        },

        removeMultipleFromCart: (courseIds: string[]) => {
          const { items } = get();
          set({
            items: items.filter((item) => !courseIds.includes(item.courseId)),
            error: null,
          });
        },
      }),
      {
        name: 'cart-storage',
        partialize: (state) => ({
          items: state.items,
        }),
      }
    ),
    {
      name: 'cart-store',
    }
  )
);

/**
 * 购物车选择器
 */
export const cartSelectors = {
  items: (state: CartState) => state.items,
  totalItems: (state: CartState) => state.totalItems,
  totalPrice: (state: CartState) => state.totalPrice,
  totalSavings: (state: CartState) => state.totalSavings,
  isLoading: (state: CartState) => state.isLoading,
  error: (state: CartState) => state.error,
  isInCart: (courseId: string) => (state: CartState) =>
    state.isInCart(courseId),
};
