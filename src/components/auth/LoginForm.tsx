'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/auth-provider';

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
 * 登录表单组件属性
 */
interface LoginFormProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
  className?: string;
  showSocialLogin?: boolean;
}

/**
 * 登录表单组件
 */
export function LoginForm({
  onSuccess,
  onError,
  className = '',
}: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading, error, clearError } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      remember: false,
    },
  });

  const rememberValue = watch('remember');

  /**
   * 处理表单提交
   */
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

  /**
   * 切换密码显示状态
   */
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`w-full max-w-md space-y-6 ${className}`}
    >
      {/* 错误提示 */}
      {error && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
        >
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </motion.div>
      )}

      {/* 登录表单 */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* 邮箱输入 */}
        <div className="space-y-2">
          <Label htmlFor="email">邮箱地址</Label>
          <Input
            id="email"
            type="email"
            placeholder="请输入您的邮箱"
            {...register('email')}
            className={
              errors.email ? 'border-red-500 focus:border-red-500' : ''
            }
            disabled={isLoading || isSubmitting}
          />
          {errors.email && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm text-red-500"
            >
              {errors.email.message}
            </motion.p>
          )}
        </div>

        {/* 密码输入 */}
        <div className="space-y-2">
          <Label htmlFor="password">密码</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="请输入您的密码"
              {...register('password')}
              className={`pr-10 ${errors.password ? 'border-red-500 focus:border-red-500' : ''}`}
              disabled={isLoading || isSubmitting}
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              disabled={isLoading || isSubmitting}
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
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm text-red-500"
            >
              {errors.password.message}
            </motion.p>
          )}
        </div>

        {/* 记住我和忘记密码 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="remember"
              checked={rememberValue}
              onCheckedChange={(checked) => setValue('remember', !!checked)}
              disabled={isLoading || isSubmitting}
            />
            <Label
              htmlFor="remember"
              className="cursor-pointer text-sm font-normal"
            >
              记住我
            </Label>
          </div>
          <Link
            href="/forgot-password"
            className="text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
          >
            忘记密码？
          </Link>
        </div>

        {/* 登录按钮 */}
        <Button
          type="submit"
          className="w-full"
          disabled={isLoading || isSubmitting}
        >
          {isLoading || isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              登录中...
            </>
          ) : (
            '登录'
          )}
        </Button>
      </form>

      {/* 注册链接 */}
      <div className="text-center">
        <p className="text-sm text-gray-600 dark:text-gray-300">
          还没有账户？{' '}
          <Link
            href="/register"
            className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
          >
            立即注册
          </Link>
        </p>
      </div>
    </motion.div>
  );
}

export default LoginForm;
