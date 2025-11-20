import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

/**
 * 收藏夹商品接口
 */
export interface WishlistItem {
  id: string;
  courseId: string;
  title: string;
  price: number;
  originalPrice?: number;
  thumbnail?: string;
  instructor: string;
  rating: number;
  level: string;
  addedAt: string;
}

/**
 * 收藏夹状态接口
 */
export interface WishlistState {
  // 状态
  items: WishlistItem[];
  isLoading: boolean;
  error: string | null;

  // 计算属性
  totalItems: number;

  // 操作
  addToWishlist: (courseId: string) => Promise<void>;
  removeFromWishlist: (courseId: string) => void;
  clearWishlist: () => void;
  isInWishlist: (courseId: string) => boolean;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;

  // 批量操作
  addMultipleToWishlist: (courseIds: string[]) => Promise<void>;
  removeMultipleFromWishlist: (courseIds: string[]) => void;

  // 排序和过滤
  sortWishlist: (sortBy: 'addedAt' | 'title' | 'price' | 'rating') => void;
  filterWishlist: (filter: {
    level?: string;
    priceRange?: [number, number];
  }) => WishlistItem[];
}

/**
 * 收藏夹 Store
 */
export const useWishlistStore = create<WishlistState>()(
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

        // 操作方法
        addToWishlist: async (courseId: string) => {
          const { items, isInWishlist } = get();

          // 检查是否已在收藏夹中
          if (isInWishlist(courseId)) {
            set({ error: '课程已在收藏夹中' });
            return;
          }

          set({ isLoading: true, error: null });

          try {
            // 模拟 API 调用获取课程信息
            // 在实际应用中，这里应该调用 API 获取课程详情
            const mockCourseData: WishlistItem = {
              id: `wishlist-${Date.now()}`,
              courseId,
              title: `课程 ${courseId}`,
              price: 299,
              originalPrice: 399,
              thumbnail: '',
              instructor: '讲师名称',
              rating: 4.8,
              level: 'intermediate',
              addedAt: new Date().toISOString(),
            };

            set({
              items: [...items, mockCourseData],
              isLoading: false,
            });
          } catch {
            set({
              error: '添加到收藏夹失败',
              isLoading: false,
            });
          }
        },

        removeFromWishlist: (courseId: string) => {
          const { items } = get();
          set({
            items: items.filter((item) => item.courseId !== courseId),
            error: null,
          });
        },

        clearWishlist: () => {
          set({
            items: [],
            error: null,
          });
        },

        isInWishlist: (courseId: string) => {
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
        addMultipleToWishlist: async (courseIds: string[]) => {
          set({ isLoading: true, error: null });

          try {
            const { items } = get();
            const newItems: WishlistItem[] = [];

            for (const courseId of courseIds) {
              if (!get().isInWishlist(courseId)) {
                // 模拟 API 调用
                const mockCourseData: WishlistItem = {
                  id: `wishlist-${Date.now()}-${courseId}`,
                  courseId,
                  title: `课程 ${courseId}`,
                  price: 299,
                  originalPrice: 399,
                  thumbnail: '',
                  instructor: '讲师名称',
                  rating: 4.8,
                  level: 'intermediate',
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
              error: '批量添加到收藏夹失败',
              isLoading: false,
            });
          }
        },

        removeMultipleFromWishlist: (courseIds: string[]) => {
          const { items } = get();
          set({
            items: items.filter((item) => !courseIds.includes(item.courseId)),
            error: null,
          });
        },

        // 排序
        sortWishlist: (sortBy: 'addedAt' | 'title' | 'price' | 'rating') => {
          const { items } = get();
          const sortedItems = [...items].sort((a, b) => {
            switch (sortBy) {
              case 'addedAt':
                return (
                  new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime()
                );
              case 'title':
                return a.title.localeCompare(b.title);
              case 'price':
                return a.price - b.price;
              case 'rating':
                return b.rating - a.rating;
              default:
                return 0;
            }
          });

          set({ items: sortedItems });
        },

        // 过滤
        filterWishlist: (filter: {
          level?: string;
          priceRange?: [number, number];
        }) => {
          const { items } = get();
          return items.filter((item) => {
            if (filter.level && item.level !== filter.level) {
              return false;
            }
            if (filter.priceRange) {
              const [min, max] = filter.priceRange;
              if (item.price < min || item.price > max) {
                return false;
              }
            }
            return true;
          });
        },
      }),
      {
        name: 'wishlist-storage',
        partialize: (state) => ({
          items: state.items,
        }),
      }
    ),
    {
      name: 'wishlist-store',
    }
  )
);

/**
 * 收藏夹选择器
 */
export const wishlistSelectors = {
  items: (state: WishlistState) => state.items,
  totalItems: (state: WishlistState) => state.totalItems,
  isLoading: (state: WishlistState) => state.isLoading,
  error: (state: WishlistState) => state.error,
  isInWishlist: (courseId: string) => (state: WishlistState) =>
    state.isInWishlist(courseId),
};
