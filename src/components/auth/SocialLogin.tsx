'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

/**
 * 社交登录提供商类型
 */
export type SocialProvider = 'google' | 'github' | 'wechat';

/**
 * 社交登录组件属性
 */
interface SocialLoginProps {
  providers?: SocialProvider[];
  onSuccess?: () => void;
  onError?: (error: string) => void;
  className?: string;
  showDivider?: boolean;
  dividerText?: string;
}

/**
 * 社交登录提供商配置
 */
const socialProviders = {
  google: {
    name: 'Google',
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24">
        <path
          fill="currentColor"
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        />
        <path
          fill="currentColor"
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        />
        <path
          fill="currentColor"
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        />
        <path
          fill="currentColor"
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        />
      </svg>
    ),
    color: 'hover:bg-red-50 dark:hover:bg-red-950',
    textColor: 'text-red-600 dark:text-red-400',
  },
  github: {
    name: 'GitHub',
    icon: (
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
      </svg>
    ),
    color: 'hover:bg-gray-50 dark:hover:bg-gray-800',
    textColor: 'text-gray-900 dark:text-gray-100',
  },
  wechat: {
    name: '微信',
    icon: (
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18 0 .659-.52 1.188-1.162 1.188-.642 0-1.162-.529-1.162-1.188 0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18 0 .659-.52 1.188-1.162 1.188-.642 0-1.162-.529-1.162-1.188 0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.942 2.453 3.666 4.229 6.884 4.229.826 0 1.622-.12 2.361-.336a.722.722 0 0 1 .598.082l1.584.926a.272.272 0 0 0 .14.045c.134 0 .24-.111.24-.248 0-.06-.023-.12-.038-.177l-.327-1.233a.582.582 0 0 1 .023-.156.49.49 0 0 1 .201-.398C23.024 18.48 24 16.82 24 14.98c0-3.21-2.931-5.837-6.656-6.088V8.858zm-3.288 1.995c.464 0 .840.385.840.86 0 .477-.376.862-.84.862-.464 0-.84-.385-.84-.862 0-.475.376-.86.84-.86zm4.462 0c.464 0 .84.385.84.86 0 .477-.376.862-.84.862-.464 0-.84-.385-.84-.862 0-.475.376-.86.84-.86z" />
      </svg>
    ),
    color: 'hover:bg-green-50 dark:hover:bg-green-950',
    textColor: 'text-green-600 dark:text-green-400',
  },
};

/**
 * 社交登录组件
 */
export function SocialLogin({
  providers = ['google', 'github'],
  onSuccess,
  onError,
  className = '',
  showDivider = true,
  dividerText = '或者',
}: SocialLoginProps) {
  const [loadingProvider, setLoadingProvider] = useState<SocialProvider | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);

  /**
   * 处理社交登录
   */
  const handleSocialLogin = async (provider: SocialProvider) => {
    try {
      setError(null);
      setLoadingProvider(provider);

      // 根据不同提供商处理登录逻辑
      switch (provider) {
        case 'google':
          await handleGoogleLogin();
          break;
        case 'github':
          await handleGitHubLogin();
          break;
        case 'wechat':
          await handleWeChatLogin();
          break;
        default:
          throw new Error('不支持的登录方式');
      }

      onSuccess?.();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : '社交登录失败，请重试';
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setLoadingProvider(null);
    }
  };

  /**
   * Google 登录
   */
  const handleGoogleLogin = async () => {
    // 在实际应用中，这里应该集成 Google OAuth
    // 这里使用模拟实现
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // 模拟随机成功/失败
        if (Math.random() > 0.3) {
          resolve('success');
        } else {
          reject(new Error('Google 登录失败'));
        }
      }, 2000);
    });
  };

  /**
   * GitHub 登录
   */
  const handleGitHubLogin = async () => {
    // 在实际应用中，这里应该集成 GitHub OAuth
    // 这里使用模拟实现
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // 模拟随机成功/失败
        if (Math.random() > 0.3) {
          resolve('success');
        } else {
          reject(new Error('GitHub 登录失败'));
        }
      }, 2000);
    });
  };

  /**
   * 微信登录
   */
  const handleWeChatLogin = async () => {
    // 在实际应用中，这里应该集成微信 OAuth
    // 这里使用模拟实现
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // 模拟随机成功/失败
        if (Math.random() > 0.3) {
          resolve('success');
        } else {
          reject(new Error('微信登录失败'));
        }
      }, 2000);
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      className={`w-full ${className}`}
    >
      {/* 分隔线 */}
      {showDivider && (
        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300 dark:border-gray-600" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-2 text-gray-500 dark:bg-gray-800 dark:text-gray-400">
              {dividerText}
            </span>
          </div>
        </div>
      )}

      {/* 错误提示 */}
      {error && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
          className="mb-4"
        >
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </motion.div>
      )}

      {/* 社交登录按钮 */}
      <div
        className={`grid gap-3 ${providers.length === 1 ? 'grid-cols-1' : providers.length === 2 ? 'grid-cols-2' : 'grid-cols-1'}`}
      >
        {providers.map((provider) => {
          const config = socialProviders[provider];
          const isLoading = loadingProvider === provider;

          return (
            <motion.div
              key={provider}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                variant="outline"
                className={`w-full transition-colors ${config.color} ${config.textColor}`}
                onClick={() => handleSocialLogin(provider)}
                disabled={loadingProvider !== null}
              >
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <span className="mr-2">{config.icon}</span>
                )}
                {isLoading ? '登录中...' : `使用 ${config.name} 登录`}
              </Button>
            </motion.div>
          );
        })}
      </div>

      {/* 提示信息 */}
      <div className="mt-4 text-center">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          使用社交账户登录即表示您同意我们的{' '}
          <a
            href="/terms"
            className="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
            target="_blank"
            rel="noopener noreferrer"
          >
            服务条款
          </a>{' '}
          和{' '}
          <a
            href="/privacy"
            className="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
            target="_blank"
            rel="noopener noreferrer"
          >
            隐私政策
          </a>
        </p>
      </div>
    </motion.div>
  );
}

export default SocialLogin;
