'use client';

import { ResetPassword } from '@/components/auth';

/**
 * 忘记密码页面
 */
export default function ForgotPasswordPage() {
  const handleSuccess = () => {
    // 成功发送重置邮件后的处理
  };

  const handleError = () => {
    // 错误处理已在组件内部完成
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md">
        <ResetPassword
          mode="forgot"
          onSuccess={handleSuccess}
          onError={handleError}
          className="rounded-lg bg-white p-8 shadow-xl dark:bg-gray-800"
        />
      </div>
    </div>
  );
}
