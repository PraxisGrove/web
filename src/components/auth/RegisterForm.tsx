'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Loader2, Check, X } from 'lucide-react';
import { motion } from 'framer-motion';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
// import { useAuth } from '@/contexts/auth-provider'; // 暂时注释以避免构建问题

/**
 * 注册表单验证模式
 */
const registerSchema = z
  .object({
    nickname: z
      .string()
      .min(1, '请输入昵称')
      .min(2, '昵称至少需要2个字符')
      .max(20, '昵称不能超过20个字符'),
    email: z.string().min(1, '请输入邮箱地址').email('请输入有效的邮箱地址'),
    password: z
      .string()
      .min(1, '请输入密码')
      .min(8, '密码至少需要8位字符')
      .regex(/[A-Z]/, '密码必须包含至少一个大写字母')
      .regex(/[a-z]/, '密码必须包含至少一个小写字母')
      .regex(/[0-9]/, '密码必须包含至少一个数字'),
    confirmPassword: z.string().min(1, '请确认密码'),
    agreeTerms: z.boolean().refine((val) => val === true, {
      message: '请同意服务条款和隐私政策',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: '两次输入的密码不一致',
    path: ['confirmPassword'],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

/**
 * 注册表单组件属性
 */
interface RegisterFormProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
  className?: string;
  showSocialLogin?: boolean;
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
 * 注册表单组件
 */
export function RegisterForm({
  onSuccess,
  onError,
  className = '',
  showSocialLogin = true,
}: RegisterFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  // const { register: registerUser, isLoading, error, clearError } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const clearError = () => setError(null);
  const registerUser = async (userData: any) => {
    setIsLoading(true);
    try {
      // TODO: 调用实际的注册API
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (err) {
      setError(err instanceof Error ? err.message : '注册失败');
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
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      nickname: '',
      email: '',
      password: '',
      confirmPassword: '',
      agreeTerms: false,
    },
  });

  const passwordValue = watch('password');
  const agreeTermsValue = watch('agreeTerms');
  const passwordStrength = getPasswordStrength(passwordValue || '');

  /**
   * 处理表单提交
   */
  const onSubmit = async (data: RegisterFormData) => {
    try {
      clearError();
      await registerUser({
        email: data.email,
        password: data.password,
        nickname: data.nickname,
      });
      onSuccess?.();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : '注册失败，请重试';
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

      {/* 注册表单 */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* 昵称输入 */}
        <div className="space-y-2">
          <Label htmlFor="nickname">昵称</Label>
          <Input
            id="nickname"
            type="text"
            placeholder="请输入您的昵称"
            {...register('nickname')}
            className={
              errors.nickname ? 'border-red-500 focus:border-red-500' : ''
            }
            disabled={isLoading || isSubmitting}
          />
          {errors.nickname && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm text-red-500"
            >
              {errors.nickname.message}
            </motion.p>
          )}
        </div>

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
              placeholder="请输入密码"
              {...register('password')}
              className={`pr-10 ${errors.password ? 'border-red-500 focus:border-red-500' : ''}`}
              disabled={isLoading || isSubmitting}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
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

          {/* 密码强度指示器 */}
          {passwordValue && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-300">
                  密码强度:
                </span>
                <span
                  className={`font-medium ${passwordStrength >= 75 ? 'text-green-600' : passwordStrength >= 50 ? 'text-yellow-600' : 'text-red-600'}`}
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
                    <X className="h-3 w-3 text-red-500" />
                  )}
                  <span className={req.met ? 'text-green-600' : 'text-red-600'}>
                    {req.text}
                  </span>
                </div>
              ))}
            </div>
          )}

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

        {/* 确认密码输入 */}
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">确认密码</Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="请再次输入密码"
              {...register('confirmPassword')}
              className={`pr-10 ${errors.confirmPassword ? 'border-red-500 focus:border-red-500' : ''}`}
              disabled={isLoading || isSubmitting}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              disabled={isLoading || isSubmitting}
            >
              {showConfirmPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          {errors.confirmPassword && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm text-red-500"
            >
              {errors.confirmPassword.message}
            </motion.p>
          )}
        </div>

        {/* 同意条款 */}
        <div className="space-y-2">
          <div className="flex items-start space-x-2">
            <Checkbox
              id="agreeTerms"
              checked={agreeTermsValue}
              onCheckedChange={(checked) => setValue('agreeTerms', !!checked)}
              disabled={isLoading || isSubmitting}
              className="mt-1"
            />
            <Label
              htmlFor="agreeTerms"
              className="cursor-pointer text-sm font-normal leading-relaxed"
            >
              我同意{' '}
              <Link
                href="/terms"
                className="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
                target="_blank"
              >
                服务条款
              </Link>{' '}
              和{' '}
              <Link
                href="/privacy"
                className="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
                target="_blank"
              >
                隐私政策
              </Link>
            </Label>
          </div>
          {errors.agreeTerms && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm text-red-500"
            >
              {errors.agreeTerms.message}
            </motion.p>
          )}
        </div>

        {/* 注册按钮 */}
        <Button
          type="submit"
          className="w-full"
          disabled={isLoading || isSubmitting}
        >
          {isLoading || isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              注册中...
            </>
          ) : (
            '创建账户'
          )}
        </Button>
      </form>

      {/* 登录链接 */}
      <div className="text-center">
        <p className="text-sm text-gray-600 dark:text-gray-300">
          已有账户？{' '}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              router.push('/login');
            }}
            className="cursor-pointer border-none bg-transparent p-0 font-medium text-blue-600 underline transition-colors hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
          >
            立即登录
          </button>
        </p>
      </div>
    </motion.div>
  );
}

export default RegisterForm;
