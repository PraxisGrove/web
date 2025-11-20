// TODO: 临时 mock，等待 zustand store 正确加载
// import { useCartStore, cartSelectors, type CartItem } from '@/store/cart';

// 临时类型定义
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
 * 购物车Hook接口
 */
export interface UseCartReturn {
  // 状态
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  totalSavings: number;
  isLoading: boolean;
  error: string | null;

  // 操作方法
  addToCart: (courseId: string) => Promise<void>;
  removeFromCart: (courseId: string) => void;
  clearCart: () => void;
  updateQuantity: (courseId: string, quantity: number) => void;
  isInCart: (courseId: string) => boolean;
  clearError: () => void;

  // 批量操作
  addMultipleToCart: (courseIds: string[]) => Promise<void>;
  removeMultipleFromCart: (courseIds: string[]) => void;

  // 便利方法
  getCartItem: (courseId: string) => CartItem | undefined;
  isEmpty: boolean;
  formatPrice: (price: number) => string;
}

/**
 * 购物车Hook
 * 提供简化的购物车状态访问接口
 * TODO: 临时 mock 实现，等待 zustand store 正确加载
 */
export function useCart(): UseCartReturn {
  // TODO: 临时 mock 状态
  const items: CartItem[] = [];
  const totalItems = 0;
  const totalPrice = 0;
  const totalSavings = 0;
  const isLoading = false;
  const error: string | null = null;

  // TODO: 临时 mock 操作方法
  const addToCart = async () => {
    // Mock implementation
  };
  const removeFromCart = () => {
    // Mock implementation
  };
  const clearCart = () => {
    // Mock implementation
  };
  const updateQuantity = () => {
    // Mock implementation
  };
  const isInCart = () => {
    return false;
  };
  const clearError = () => {
    // Mock implementation
  };
  const addMultipleToCart = async () => {
    // Mock implementation
  };
  const removeMultipleFromCart = () => {
    // Mock implementation
  };

  /**
   * 获取购物车中的特定商品
   */
  const getCartItem = (courseId: string): CartItem | undefined => {
    return items.find((item) => item.courseId === courseId);
  };

  /**
   * 检查购物车是否为空
   */
  const isEmpty = items.length === 0;

  /**
   * 格式化价格显示
   */
  const formatPrice = (price: number): string => {
    return `¥${price.toFixed(2)}`;
  };

  return {
    // 状态
    items,
    totalItems,
    totalPrice,
    totalSavings,
    isLoading,
    error,

    // 操作方法
    addToCart,
    removeFromCart,
    clearCart,
    updateQuantity,
    isInCart,
    clearError,

    // 批量操作
    addMultipleToCart,
    removeMultipleFromCart,

    // 便利方法
    getCartItem,
    isEmpty,
    formatPrice,
  };
}

export default useCart;
