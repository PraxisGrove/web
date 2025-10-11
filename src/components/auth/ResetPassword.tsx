'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { Eye, EyeOff, Loader2, ArrowLeft, Check } from 'lucide-react';
import { motion } from 'framer-motion';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/auth-provider';

/**
 * 忘记密码表单验证模式
 */
const forgotPasswordSchema = z.object({
  email: z.string().min(1, '请输入邮箱地址').email('请输入有效的邮箱地址'),
});

/**
 * 重置密码表单验证模式
 */
const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(1, '请输入密码')
      .min(8, '密码至少需要8位字符')
      .regex(/[A-Z]/, '密码必须包含至少一个大写字母')
      .regex(/[a-z]/, '密码必须包含至少一个小写字母')
      .regex(/[0-9]/, '密码必须包含至少一个数字'),
    confirmPassword: z.string().min(1, '请确认密码'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: '两次输入的密码不一致',
    path: ['confirmPassword'],
  });

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

/**
 * 组件属性
 */
interface ResetPasswordProps {
  mode?: 'forgot' | 'reset';
  token?: string;
  onSuccess?: () => void;
  onError?: (error: string) => void;
  className?: string;
}

/**
 * 密码强度检查
 */
const getPasswordStrength = (password: string): number => {
  let strength = 0;
  if (password.length >= 8) strength += 25;
  if (/[A-Z]/.test(password)) strength += 25;
  if (/[a-z]/.test(password)) strength += 25;
  if (/[0-9]/.test(password)) strength += 25;
  return strength;
};

/**
 * 密码强度颜色
 */
const getPasswordStrengthColor = (strength: number): string => {
  if (strength < 50) return 'bg-red-500';
  if (strength < 75) return 'bg-yellow-500';
  return 'bg-green-500';
};

/**
 * 密码强度文本
 */
const getPasswordStrengthText = (strength: number): string => {
  if (strength < 50) return '弱';
  if (strength < 75) return '中等';
  return '强';
};

/**
 * 密码重置组件
 */
export function ResetPassword({
  mode = 'forgot',
  token,
  onSuccess,
  onError,
  className = '',
}: ResetPasswordProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const { forgotPassword, resetPassword, isLoading, error, clearError } =
    useAuth();

  // 忘记密码表单
  const forgotPasswordForm = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  // 重置密码表单
  const resetPasswordForm = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const passwordValue = resetPasswordForm.watch('password');
  const passwordStrength = getPasswordStrength(passwordValue || '');

  /**
   * 处理忘记密码表单提交
   */
  const onForgotPasswordSubmit = async (data: ForgotPasswordFormData) => {
    try {
      clearError();
      await forgotPassword(data.email);
      setEmailSent(true);
      onSuccess?.();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : '发送重置邮件失败，请重试';
      onError?.(errorMessage);
    }
  };

  /**
   * 处理重置密码表单提交
   */
  const onResetPasswordSubmit = async (data: ResetPasswordFormData) => {
    if (!token) {
      onError?.('无效的重置令牌');
      return;
    }

    try {
      clearError();
      await resetPassword({ token, password: data.password });
      setResetSuccess(true);
      onSuccess?.();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : '重置密码失败，请重试';
      onError?.(errorMessage);
    }
  };

  /**
   * 密码要求检查项
   */
  const passwordRequirements = [
    { text: '至少8个字符', met: (passwordValue?.length || 0) >= 8 },
    { text: '包含大写字母', met: /[A-Z]/.test(passwordValue || '') },
    { text: '包含小写字母', met: /[a-z]/.test(passwordValue || '') },
    { text: '包含数字', met: /[0-9]/.test(passwordValue || '') },
  ];

  // 忘记密码成功视图
  if (mode === 'forgot' && emailSent) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={`w-full max-w-md space-y-6 text-center ${className}`}
      >
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
          <Check className="h-6 w-6 text-green-600 dark:text-green-300" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          重置链接已发送
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          我们已向您的邮箱发送了密码重置链接，请查收邮件并点击链接重置密码。
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          如果您没有收到邮件，请检查垃圾邮件文件夹或尝试重新发送。
        </p>
        <div className="pt-4">
          <Button
            variant="outline"
            onClick={() => setEmailSent(false)}
            className="mr-2"
          >
            重新发送
          </Button>
          <Button asChild>
            <Link href="/login">返回登录</Link>
          </Button>
        </div>
      </motion.div>
    );
  }

  // 重置密码成功视图
  if (mode === 'reset' && resetSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={`w-full max-w-md space-y-6 text-center ${className}`}
      >
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
          <Check className="h-6 w-6 text-green-600 dark:text-green-300" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          密码重置成功
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          您的密码已成功重置，现在可以使用新密码登录您的账户。
        </p>
        <div className="pt-4">
          <Button asChild>
            <Link href="/login">前往登录</Link>
          </Button>
        </div>
      </motion.div>
    );
  }

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

      {/* 标题 */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          {mode === 'forgot' ? '忘记密码' : '重置密码'}
        </h2>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          {mode === 'forgot'
            ? '请输入您的邮箱地址，我们将发送重置链接'
            : '请设置您的新密码'}
        </p>
      </div>

      {/* 忘记密码表单 */}
      {mode === 'forgot' && (
        <form
          onSubmit={forgotPasswordForm.handleSubmit(onForgotPasswordSubmit)}
          className="space-y-4"
        >
          <div className="space-y-2">
            <Label htmlFor="email">邮箱地址</Label>
            <Input
              id="email"
              type="email"
              placeholder="请输入您的邮箱"
              {...forgotPasswordForm.register('email')}
              className={
                forgotPasswordForm.formState.errors.email
                  ? 'border-red-500 focus:border-red-500'
                  : ''
              }
              disabled={isLoading || forgotPasswordForm.formState.isSubmitting}
            />
            {forgotPasswordForm.formState.errors.email && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-red-500"
              >
                {forgotPasswordForm.formState.errors.email.message}
              </motion.p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading || forgotPasswordForm.formState.isSubmitting}
          >
            {isLoading || forgotPasswordForm.formState.isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                发送中...
              </>
            ) : (
              '发送重置链接'
            )}
          </Button>

          <div className="text-center">
            <Link
              href="/login"
              className="inline-flex items-center text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
            >
              <ArrowLeft className="mr-1 h-4 w-4" />
              返回登录
            </Link>
          </div>
        </form>
      )}

      {/* 重置密码表单 */}
      {mode === 'reset' && (
        <form
          onSubmit={resetPasswordForm.handleSubmit(onResetPasswordSubmit)}
          className="space-y-4"
        >
          {/* 密码输入 */}
          <div className="space-y-2">
            <Label htmlFor="password">新密码</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="请输入新密码"
                {...resetPasswordForm.register('password')}
                className={`pr-10 ${
                  resetPasswordForm.formState.errors.password
                    ? 'border-red-500 focus:border-red-500'
                    : ''
                }`}
                disabled={isLoading || resetPasswordForm.formState.isSubmitting}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                disabled={isLoading || resetPasswordForm.formState.isSubmitting}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>

            {/* 密码强度指示器 */}
            {passwordValue && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-300">
                    密码强度:
                  </span>
                  <span
                    className={`font-medium ${
                      passwordStrength >= 75
                        ? 'text-green-600'
                        : passwordStrength >= 50
                          ? 'text-yellow-600'
                          : 'text-red-600'
                    }`}
                  >
                    {getPasswordStrengthText(passwordStrength)}
                  </span>
                </div>
                <Progress
                  value={passwordStrength}
                  className={`h-2 ${getPasswordStrengthColor(passwordStrength)}`}
                />
              </div>
            )}

            {/* 密码要求 */}
            {passwordValue && (
              <div className="space-y-1">
                {passwordRequirements.map((req, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-2 text-sm"
                  >
                    {req.met ? (
                      <Check className="h-3 w-3 text-green-500" />
                    ) : (
                      <Check className="h-3 w-3 text-gray-300" />
                    )}
                    <span
                      className={
                        req.met
                          ? 'text-green-600'
                          : 'text-gray-500 dark:text-gray-400'
                      }
                    >
                      {req.text}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {resetPasswordForm.formState.errors.password && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-red-500"
              >
                {resetPasswordForm.formState.errors.password.message}
              </motion.p>
            )}
          </div>

          {/* 确认密码输入 */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">确认新密码</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="请再次输入新密码"
                {...resetPasswordForm.register('confirmPassword')}
                className={`pr-10 ${
                  resetPasswordForm.formState.errors.confirmPassword
                    ? 'border-red-500 focus:border-red-500'
                    : ''
                }`}
                disabled={isLoading || resetPasswordForm.formState.isSubmitting}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                disabled={isLoading || resetPasswordForm.formState.isSubmitting}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {resetPasswordForm.formState.errors.confirmPassword && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-red-500"
              >
                {resetPasswordForm.formState.errors.confirmPassword.message}
              </motion.p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading || resetPasswordForm.formState.isSubmitting}
          >
            {isLoading || resetPasswordForm.formState.isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                重置中...
              </>
            ) : (
              '重置密码'
            )}
          </Button>

          <div className="text-center">
            <Link
              href="/login"
              className="inline-flex items-center text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
            >
              <ArrowLeft className="mr-1 h-4 w-4" />
              返回登录
            </Link>
          </div>
        </form>
      )}
    </motion.div>
  );
}

export default ResetPassword;
