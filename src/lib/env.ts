/**
 * 环境变量配置和验证
 */

export const env = {
  // 应用配置
  APP_NAME: process.env.NEXT_PUBLIC_APP_NAME || 'PraxisGrove',
  APP_VERSION: process.env.NEXT_PUBLIC_APP_VERSION || '0.1.0',
  APP_ENV: process.env.NEXT_PUBLIC_APP_ENV || 'development',

  // API配置
  API_BASE_URL:
    process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api',
  API_TIMEOUT: parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || '10000'),

  // 认证配置
  JWT_SECRET: process.env.NEXT_PUBLIC_JWT_SECRET || 'default-secret',
  REFRESH_TOKEN_EXPIRY: process.env.NEXT_PUBLIC_REFRESH_TOKEN_EXPIRY || '7d',

  // 3D渲染配置
  ENABLE_3D_FEATURES: process.env.NEXT_PUBLIC_ENABLE_3D_FEATURES === 'true',
  MAX_3D_NODES: parseInt(process.env.NEXT_PUBLIC_MAX_3D_NODES || '1000'),

  // 开发工具配置
  ENABLE_DEVTOOLS: process.env.NEXT_PUBLIC_ENABLE_DEVTOOLS === 'true',
  LOG_LEVEL: process.env.NEXT_PUBLIC_LOG_LEVEL || 'info',

  // 第三方服务配置
  GOOGLE_ANALYTICS_ID: process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID,
  SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
  VERCEL_ANALYTICS_ID: process.env.NEXT_PUBLIC_VERCEL_ANALYTICS_ID,
} as const;

// 开发环境检查
export const isDevelopment = env.APP_ENV === 'development';
export const isProduction = env.APP_ENV === 'production';
export const isTest = env.APP_ENV === 'test';
export const isLocal = env.APP_ENV === 'local';

/**
 * 检查是否应该绕过认证（用于开发和测试环境）
 */
export const shouldBypassAuth = isDevelopment || isTest || isLocal;

// 环境变量验证
export function validateEnv() {
  const requiredVars = ['NEXT_PUBLIC_API_BASE_URL'];

  const missingVars = requiredVars.filter((varName) => !process.env[varName]);

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(', ')}`
    );
  }
}
