'use client';

import { useRouter } from 'next/navigation';
import { RegisterForm, AuthLayout } from '@/components/auth';
import { EnhancedSocialLogin } from '@/components/auth/EnhancedLoginForm';

/**
 * 用户注册页面
 */
export default function RegisterPage() {
  const router = useRouter();

  const handleRegisterSuccess = () => {
    // 注册成功后重定向到登录页面或验证邮箱页面
    router.push('/login?registered=true');
  };

  const handleRegisterError = (error: string) => {
    // 错误处理已在组件内部完成
  };

  return (
    <AuthLayout
      title="创建账户"
      subtitle="加入 PraxisGrove，开启您的智慧学习之旅"
      type="register"
    >
      <RegisterForm
        onSuccess={handleRegisterSuccess}
        onError={handleRegisterError}
        showSocialLogin={false}
      />

      <EnhancedSocialLogin
        providers={['google', 'github', 'feishu']}
        onSuccess={handleRegisterSuccess}
        onError={handleRegisterError}
        className="mt-6"
      />
    </AuthLayout>
  );
}
