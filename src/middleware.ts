import { NextRequest, NextResponse } from 'next/server';
import { match as matchLocale } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';

/**
 * 支持的语言列表
 */
const locales = ['zh-CN', 'en-US'];

/**
 * 默认语言
 */
const defaultLocale = 'zh-CN';

/**
 * 是否启用国际化重定向
 * 设置为 false 可以禁用自动语言前缀重定向
 */
const enableI18nRedirect = false;

/**
 * 获取请求的首选语言
 */
function getLocale(request: NextRequest): string {
  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

  // @ts-ignore locales are readonly
  const languages = new Negotiator({ headers: negotiatorHeaders }).languages();
  const locale = matchLocale(languages, locales, defaultLocale);

  return locale;
}

/**
 * 需要认证的路由
 */
const authRequiredPaths = [
  '/profile',
  '/settings',
];

/**
 * 需要管理员权限的路由
 */
const adminRequiredPaths = ['/admin'];

/**
 * 公开路由（无需认证）
 */
const publicPaths = [
  '/',
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
  '/verify-email',
  '/about',
  '/contact',
  '/terms',
  '/privacy',
  '/api',
  '/roadmap',
  '/community',
];

/**
 * 静态资源路径
 */
const staticPaths = [
  '/_next',
  '/favicon.ico',
  '/robots.txt',
  '/sitemap.xml',
  '/logo',
  '/images',
  '/fonts',
];

/**
 * 检查路径是否匹配前缀
 */
function pathStartsWith(path: string, prefixes: string[]): boolean {
  return prefixes.some((prefix) => path.startsWith(prefix));
}

/**
 * 中间件
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 处理静态资源和API请求
  if (pathStartsWith(pathname, staticPaths) || pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  // 处理国际化路由（可通过 enableI18nRedirect 配置开关控制）
  if (enableI18nRedirect) {
    const pathnameIsMissingLocale = locales.every(
      (locale) =>
        !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
    );

    // 如果路径中没有语言前缀，重定向到带有默认语言的路径
    if (pathnameIsMissingLocale) {
      const locale = getLocale(request);

      // 构建新的URL，添加语言前缀
      const newUrl = new URL(
        `/${locale}${pathname.startsWith('/') ? '' : '/'}${pathname}`,
        request.url
      );

      // 保留查询参数
      request.nextUrl.searchParams.forEach((value, key) => {
        newUrl.searchParams.set(key, value);
      });

      return NextResponse.redirect(newUrl);
    }
  }

  // 获取认证令牌
  const authToken = request.cookies.get('auth-token')?.value;

  // 检查是否需要认证
  const requiresAuth = pathStartsWith(pathname, authRequiredPaths);
  const requiresAdmin = pathStartsWith(pathname, adminRequiredPaths);
  const isPublicPath = pathStartsWith(pathname, publicPaths);

  // 如果是公开路径，直接通过
  if (isPublicPath) {
    return NextResponse.next();
  }

  // 如果需要认证但没有令牌，重定向到登录页面
  if ((requiresAuth || requiresAdmin) && !authToken) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }

  // 如果有令牌，验证令牌并检查权限
  if (authToken) {
    try {
      // 解析令牌（简化版本）
      const tokenData = JSON.parse(Buffer.from(authToken, 'base64').toString());

      // 检查令牌是否过期
      if (tokenData.exp < Date.now()) {
        // 令牌过期，清除令牌并重定向到登录页面
        const response = NextResponse.redirect(new URL('/login', request.url));
        response.cookies.delete('auth-token');
        return response;
      }

      // 检查管理员权限
      if (requiresAdmin && tokenData.role !== 'admin') {
        return NextResponse.redirect(new URL('/unauthorized', request.url));
      }
    } catch {
      // 令牌无效，清除令牌并重定向到登录页面
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete('auth-token');
      return response;
    }
  }

  // 通过所有检查，继续处理请求
  return NextResponse.next();
}

/**
 * 配置中间件匹配的路径
 */
export const config = {
  matcher: [
    /*
     * 匹配所有路径，除了:
     * 1. 以 /api/ 开头的路径（API路由）
     * 2. 以 /_next/ 开头的路径（Next.js静态文件）
     * 3. 以 /static/ 开头的路径（静态文件）
     */
    '/((?!api/|_next/|static/).*)',
  ],
};
