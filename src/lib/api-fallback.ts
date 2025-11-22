/**
 * API 回退机制和模拟数据
 * 当真实 API 不可用时提供模拟数据
 */

import type { ListResponse } from '@/types/api';

/**
 * 检查 API 是否可用
 */
export async function checkApiHealth(): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5秒超时

    // 首先尝试直接连接后端 API
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/health`,
        {
          method: 'GET',
          signal: controller.signal,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      clearTimeout(timeoutId);
      if (response.ok) {
        return true;
      }
    } catch (directError) {
      console.warn('Direct API health check failed:', directError);
    }

    // 如果直接连接失败，尝试通过本地 API 路由检查
    try {
      const localResponse = await fetch('/api/health', {
        method: 'GET',
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
        },
      });

      clearTimeout(timeoutId);

      if (localResponse.ok) {
        const data = await localResponse.json();
        return data.services?.backend?.status === 'healthy';
      }
    } catch (localError) {
      console.warn('Local health check failed:', localError);
    }

    return false;
  } catch (error) {
    console.warn('API health check failed:', error);
    return false;
  }
}


/**
 * 创建模拟的分页响应
 */
export function createMockListResponse<T>(
  items: T[],
  page: number = 1,
  limit: number = 12
): ListResponse<T> {
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedItems = items.slice(startIndex, endIndex);
  const totalPages = Math.ceil(items.length / limit);

  return {
    success: true,
    data: {
      items: paginatedItems,
      pagination: {
        page,
        limit,
        total: items.length,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    },
  };
}

/**
 * API 回退处理器
 */
export class ApiFallbackHandler {
  private static apiHealthy: boolean | null = null;
  private static lastHealthCheck: number = 0;
  private static readonly HEALTH_CHECK_INTERVAL = 30000; // 30秒

  /**
   * 检查 API 健康状态（带缓存）
   */
  static async isApiHealthy(): Promise<boolean> {
    const now = Date.now();

    // 如果最近检查过且在缓存时间内，直接返回缓存结果
    if (
      this.apiHealthy !== null &&
      now - this.lastHealthCheck < this.HEALTH_CHECK_INTERVAL
    ) {
      return this.apiHealthy;
    }

    // 执行健康检查
    this.apiHealthy = await checkApiHealth();
    this.lastHealthCheck = now;

    console.log(
      `API Health Check: ${this.apiHealthy ? '✅ Healthy' : '❌ Unhealthy'}`
    );

    return this.apiHealthy;
  }

  /**
   * 重置健康检查缓存
   */
  static resetHealthCheck(): void {
    this.apiHealthy = null;
    this.lastHealthCheck = 0;
  }
}
