'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Loader2, Mail, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

import {
  ReactBitInput,
  Button,
  AceternityMagnetic,
  HoverAnimation,
  InViewAnimation,
  GlowBorder,
} from '@/components/unified';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
// import { useAuth } from '@/contexts/auth-provider'; // 暂时注释以避免构建问题

/**
 * 登录表单验证模式
 */
const loginSchema = z.object({
  email: z.string().min(1, '请输入邮箱地址').email('请输入有效的邮箱地址'),
  password: z.string().min(1, '请输入密码').min(6, '密码至少需要6位字符'),
  remember: z.boolean().default(false),
});

type LoginFormData = z.infer<typeof loginSchema>;

/**
 * 增强登录表单组件属性
 */
interface EnhancedLoginFormProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
  className?: string;
}

/**
 * 增强的登录表单组件
 * 使用 ReactBit 和 Aceternity 组件
 */
export function EnhancedLoginForm({
  onSuccess,
  onError,
  className = '',
}: EnhancedLoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  // const { login, isLoading, error, clearError } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const clearError = () => setError(null);
  const login = async (email: string, password: string, remember?: boolean) => {
    setIsLoading(true);
    try {
      // TODO: 调用实际的登录API
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (err) {
      setError(err instanceof Error ? err.message : '登录失败');
    } finally {
      setIsLoading(false);
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      remember: false,
    },
  });

  const watchedValues = watch();

  const onSubmit = async (data: LoginFormData) => {
    try {
      clearError();
      await login(data.email, data.password, data.remember);
      onSuccess?.();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : '登录失败，请重试';
      onError?.(errorMessage);
    }
  };

  return (
    <motion.div
      className={`space-y-6 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* 错误提示 */}
        {error && (
          <InViewAnimation animation="slideInDown">
            <Alert
              variant="destructive"
              className="border-red-500/50 bg-red-500/10"
            >
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </InViewAnimation>
        )}

        {/* 邮箱输入框 */}
        <InViewAnimation animation="slideInLeft" delay={0.1}>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">
              邮箱地址
            </Label>
            <div className="relative">
              <GlowBorder>
                <ReactBitInput
                  type="email"
                  placeholder="请输入您的邮箱地址"
                  value={watchedValues.email || ''}
                  onChange={(value) => setValue('email', value)}
                  className="pl-10"
                  error={errors.email?.message}
                />
              </GlowBorder>
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            </div>
            {errors.email && (
              <motion.p
                className="text-sm text-red-500"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                {errors.email.message}
              </motion.p>
            )}
          </div>
        </InViewAnimation>

        {/* 密码输入框 */}
        <InViewAnimation animation="slideInRight" delay={0.2}>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium">
              密码
            </Label>
            <div className="relative">
              <GlowBorder>
                <ReactBitInput
                  type={showPassword ? 'text' : 'password'}
                  placeholder="请输入您的密码"
                  value={watchedValues.password || ''}
                  onChange={(value) => setValue('password', value)}
                  className="pl-10 pr-10"
                  error={errors.password?.message}
                />
              </GlowBorder>
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition-colors hover:text-gray-600 dark:hover:text-gray-300"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.password && (
              <motion.p
                className="text-sm text-red-500"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                {errors.password.message}
              </motion.p>
            )}
          </div>
        </InViewAnimation>

        {/* 记住我选项 */}
        <InViewAnimation animation="slideInUp" delay={0.3}>
          <div className="flex items-center justify-between">
            <HoverAnimation>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={watchedValues.remember}
                  onCheckedChange={(checked) => setValue('remember', !!checked)}
                />
                <Label
                  htmlFor="remember"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  记住我
                </Label>
              </div>
            </HoverAnimation>

            <button
              type="button"
              onClick={() => router.push('/forgot-password')}
              className="cursor-pointer border-none bg-transparent p-0 text-sm text-blue-600 transition-colors hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
            >
              忘记密码？
            </button>
          </div>
        </InViewAnimation>

        {/* 登录按钮 */}
        <InViewAnimation animation="slideInUp" delay={0.4}>
          <Button
            type="submit"
            disabled={isLoading || isSubmitting}
            className="w-full"
          >
            {isLoading || isSubmitting ? (
              <motion.div
                className="flex items-center justify-center space-x-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>登录中...</span>
              </motion.div>
            ) : (
              '登录'
            )}
          </Button>
        </InViewAnimation>
      </form>

      {/* 注册链接 - 移到表单外部 */}
      <motion.div
        className="mt-6 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.6 }}
      >
        <span className="text-sm text-gray-600 dark:text-gray-400">
          还没有账户？{' '}
        </span>
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            router.push('/register');
          }}
          className="cursor-pointer border-none bg-transparent p-0 text-sm font-medium text-blue-600 underline transition-colors hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
        >
          立即注册
        </button>
      </motion.div>
    </motion.div>
  );
}

export default EnhancedLoginForm;

/**
 * 增强的社交登录组件
 */
export function EnhancedSocialLogin({
  providers = ['google', 'github', 'feishu'],
  onSuccess,
  onError,
  className = '',
}: {
  providers?: string[];
  onSuccess?: () => void;
  onError?: (error: string) => void;
  className?: string;
}) {
  const handleSocialLogin = async (provider: string) => {
    try {
      // TODO: 实现社交登录逻辑
      onSuccess?.();
    } catch (error) {
      onError?.(error instanceof Error ? error.message : '社交登录失败');
    }
  };

  return (
    <motion.div
      className={`space-y-4 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.6 }}
    >
      {/* 分割线 */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300 dark:border-gray-600" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-white px-2 text-gray-500 dark:bg-gray-800 dark:text-gray-400">
            或者使用
          </span>
        </div>
      </div>

      {/* 社交登录按钮 */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {providers.includes('google') && (
          <InViewAnimation animation="slideInLeft" delay={0.7}>
            <Button
              variant="outline"
              onClick={() => handleSocialLogin('google')}
              className="w-full transition-transform hover:scale-105"
            >
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
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
              Google
            </Button>
          </InViewAnimation>
        )}

        {providers.includes('github') && (
          <InViewAnimation animation="slideInRight" delay={0.8}>
            <Button
              variant="outline"
              onClick={() => handleSocialLogin('github')}
              className="w-full transition-transform hover:scale-105"
            >
              <svg
                className="mr-2 h-4 w-4"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              GitHub
            </Button>
          </InViewAnimation>
        )}

        {providers.includes('feishu') && (
          <InViewAnimation animation="slideInUp" delay={0.9}>
            <Button
              variant="outline"
              onClick={() => handleSocialLogin('feishu')}
              className="w-full transition-transform hover:scale-105"
            >
              <svg
                className="mr-2 h-4 w-4"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M19.077 4.928c-.851-.802-1.972-1.243-3.158-1.243H8.081c-1.186 0-2.307.441-3.158 1.243C4.072 5.729 3.631 6.85 3.631 8.036v7.928c0 1.186.441 2.307 1.292 3.108.851.802 1.972 1.243 3.158 1.243h7.838c1.186 0 2.307-.441 3.158-1.243.851-.801 1.292-1.922 1.292-3.108V8.036c0-1.186-.441-2.307-1.292-3.108zM12 16.5c-2.485 0-4.5-2.015-4.5-4.5s2.015-4.5 4.5-4.5 4.5 2.015 4.5 4.5-2.015 4.5-4.5 4.5z" />
                <circle cx="12" cy="12" r="2.5" />
              </svg>
              飞书
            </Button>
          </InViewAnimation>
        )}
      </div>
    </motion.div>
  );
}
