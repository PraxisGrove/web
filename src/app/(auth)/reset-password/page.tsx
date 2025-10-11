'use client';

import { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ResetPassword } from '@/components/auth';

/**
 * 重置密码页面内容组件
 */
function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const handleSuccess = () => {
    // 重置密码成功后重定向到登录页面
    router.push('/login?reset=true');
  };

  const handleError = (error: string) => {
    // 错误处理已在组件内部完成
  };

  // 如果没有token，重定向到忘记密码页面
  if (!token) {
    router.push('/forgot-password');
    return null;
  }

  return (
    <div className="w-full max-w-md">
      <ResetPassword
        mode="reset"
        token={token}
        onSuccess={handleSuccess}
        onError={handleError}
        className="rounded-lg bg-white p-8 shadow-xl dark:bg-gray-800"
      />
    </div>
  );
}

/**
 * 重置密码页面
 */
export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
      <Suspense
        fallback={
          <div className="w-full max-w-md">
            <div className="rounded-lg bg-white p-8 shadow-xl dark:bg-gray-800">
              <div className="text-center">
                <div className="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
                <p className="mt-4 text-gray-600 dark:text-gray-300">
                  加载中...
                </p>
              </div>
            </div>
          </div>
        }
      >
        <ResetPasswordContent />
      </Suspense>
    </div>
  );
}
