'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Shield, Lock, AlertTriangle, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/hooks/useAuth';

/**
 * 私有路由组件属性
 */
interface PrivateRouteProps {
  children: React.ReactNode;
  requiredRole?: 'user' | 'admin';
  fallback?: React.ReactNode;
  redirectTo?: string;
  showFallback?: boolean;
  className?: string;
}

/**
 * 加载组件
 */
const LoadingComponent = () => (
  <div className="flex min-h-screen items-center justify-center">
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="text-center"
    >
      <Loader2 className="mx-auto h-12 w-12 animate-spin text-blue-600" />
      <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
        正在验证身份...
      </p>
    </motion.div>
  </div>
);

/**
 * 未认证组件
 */
const UnauthenticatedComponent = ({ redirectTo }: { redirectTo?: string }) => {
  const router = useRouter();

  const handleLogin = () => {
    const loginUrl = redirectTo || '/login';
    router.push(loginUrl);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md rounded-lg bg-white p-8 shadow-xl dark:bg-gray-800"
      >
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
            <Lock className="h-8 w-8 text-blue-600 dark:text-blue-300" />
          </div>
          <h2 className="mt-6 text-2xl font-bold text-gray-900 dark:text-white">
            需要登录
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            请登录后访问此页面
          </p>
          <div className="mt-6">
            <Button onClick={handleLogin} className="w-full">
              前往登录
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

/**
 * 权限不足组件
 */
const UnauthorizedComponent = ({
  requiredRole,
  userRole,
}: {
  requiredRole: string;
  userRole: string;
}) => {
  const router = useRouter();

  const handleGoBack = () => {
    router.back();
  };

  const handleGoHome = () => {
    router.push('/');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md rounded-lg bg-white p-8 shadow-xl dark:bg-gray-800"
      >
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900">
            <Shield className="h-8 w-8 text-red-600 dark:text-red-300" />
          </div>
          <h2 className="mt-6 text-2xl font-bold text-gray-900 dark:text-white">
            权限不足
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            您的当前角色（{userRole}）无法访问此页面
          </p>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            需要 {requiredRole} 权限
          </p>

          <Alert className="mt-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              如果您认为这是错误，请联系管理员
            </AlertDescription>
          </Alert>

          <div className="mt-6 space-y-3">
            <Button onClick={handleGoBack} variant="outline" className="w-full">
              返回上一页
            </Button>
            <Button onClick={handleGoHome} className="w-full">
              返回首页
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

/**
 * 私有路由组件
 * 用于保护需要认证或特定权限的页面
 */
export function PrivateRoute({
  children,
  requiredRole,
  fallback,
  redirectTo,
  showFallback = true,
  className = '',
}: PrivateRouteProps) {
  const { isAuthenticated, isLoading, user, canAccess, checkAuth } = useAuth();
  const [isInitialized, setIsInitialized] = useState(false);

  // 初始化认证检查
  useEffect(() => {
    const initAuth = async () => {
      try {
        await checkAuth();
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setIsInitialized(true);
      }
    };

    if (!isInitialized) {
      initAuth();
    }
  }, [checkAuth, isInitialized]);

  // 如果正在加载或未初始化，显示加载状态
  if (isLoading || !isInitialized) {
    return fallback || <LoadingComponent />;
  }

  // 如果用户未认证
  if (!isAuthenticated) {
    if (!showFallback) {
      return null;
    }
    return fallback || <UnauthenticatedComponent redirectTo={redirectTo} />;
  }

  // 如果需要特定角色权限但用户权限不足
  if (requiredRole && !canAccess(requiredRole)) {
    if (!showFallback) {
      return null;
    }
    return (
      fallback || (
        <UnauthorizedComponent
          requiredRole={requiredRole}
          userRole={user?.role || 'unknown'}
        />
      )
    );
  }

  // 权限检查通过，渲染子组件
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * 高阶组件：为页面组件添加私有路由保护
 */
export function withPrivateRoute<P extends object>(
  Component: React.ComponentType<P>,
  options?: Omit<PrivateRouteProps, 'children'>
) {
  const WrappedComponent = (props: P) => {
    return (
      <PrivateRoute {...options}>
        <Component {...props} />
      </PrivateRoute>
    );
  };

  WrappedComponent.displayName = `withPrivateRoute(${Component.displayName || Component.name})`;

  return WrappedComponent;
}

/**
 * 角色守卫组件
 * 用于在组件内部进行角色权限检查
 */
export function RoleGuard({
  children,
  allowedRoles,
  fallback,
  showFallback = true,
}: {
  children: React.ReactNode;
  allowedRoles: ('user' | 'admin')[];
  fallback?: React.ReactNode;
  showFallback?: boolean;
}) {
  const { user, hasAnyRole } = useAuth();

  if (!user || !hasAnyRole(allowedRoles)) {
    if (!showFallback) {
      return null;
    }
    return (
      fallback || (
        <Alert variant="destructive">
          <Shield className="h-4 w-4" />
          <AlertDescription>您没有权限查看此内容</AlertDescription>
        </Alert>
      )
    );
  }

  return <>{children}</>;
}

export default PrivateRoute;
