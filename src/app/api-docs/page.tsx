'use client';

import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ExternalLink, FileText, Code, Database, Home } from 'lucide-react';
import { AdaptiveParticles } from '@/components/ui/PerformanceOptimizer';

// 动态导入 SwaggerUI 以避免 SSR 问题
const SwaggerUI = dynamic(() => import('swagger-ui-react'), {
  ssr: false,
  loading: () => (
    <div className="flex h-96 items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
    </div>
  ),
});

export default function ApiDocsPage() {
  const [swaggerSpec, setSwaggerSpec] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 加载静态 swagger 规范
    const loadSwaggerSpec = async () => {
      try {
        const response = await fetch('/swagger.json');
        if (!response.ok) {
          throw new Error('Failed to fetch swagger.json');
        }
        const spec = await response.json();
        setSwaggerSpec(spec);
      } catch (error) {
        console.error('Failed to load swagger spec:', error);
        // 降级到内置规范
        try {
          const { swaggerSpec: staticSpec } = await import('@/lib/swagger');
          setSwaggerSpec(staticSpec);
        } catch (fallbackError) {
          console.error('Failed to load fallback swagger spec:', fallbackError);
        }
      } finally {
        setLoading(false);
      }
    };

    loadSwaggerSpec();
  }, []);

  if (loading) {
    return (
      <div className="bg-background min-h-screen">
        <AdaptiveParticles className="fixed inset-0 z-0">
          <div />
        </AdaptiveParticles>

        <div className="relative z-10 flex min-h-screen items-center justify-center">
          <div className="text-center">
            <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
            <p className="text-gray-600">Loading API Documentation...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen">
      <AdaptiveParticles className="fixed inset-0 z-0">
        <div />
      </AdaptiveParticles>

      <main className="relative z-10">
        {/* 简单的顶部导航 */}
        <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-sm">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              <div className="flex items-center space-x-4">
                <FileText className="h-8 w-8 text-blue-600" />
                <div>
                  <h1 className="text-xl font-bold text-gray-900">
                    PraxisGrove API
                  </h1>
                  <p className="text-sm text-gray-500">Documentation v1.0</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <a
                  href="/swagger.json"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Download JSON
                </a>
                <Link
                  href="/"
                  className="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
                >
                  <Home className="mr-2 h-4 w-4" />
                  Back to App
                </Link>
              </div>
            </div>
          </div>
        </header>

        {/* 主要内容 */}
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {/* 简介部分 */}
          <div className="mb-8">
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-6">
              <h2 className="mb-2 text-2xl font-bold text-gray-900">
                PraxisGrove API 接口规范
              </h2>
              <p className="mb-4 text-gray-700">
                这是 PraxisGrove 学习平台的完整 API 接口规范文档。
                前端开发完成，后端开发者可以参考此文档实现对应的 API 接口。
                所有接口都遵循 RESTful 设计原则和统一的响应格式。
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                  OpenAPI 3.0
                </span>
                <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                  REST API
                </span>
                <span className="inline-flex items-center rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-800">
                  JWT Authentication
                </span>
                <span className="inline-flex items-center rounded-full bg-orange-100 px-2.5 py-0.5 text-xs font-medium text-orange-800">
                  JSON Format
                </span>
              </div>
            </div>
          </div>

          {/* 快速链接 */}
          <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="rounded-lg border border-gray-200 bg-white p-6">
              <div className="mb-3 flex items-center">
                <Code className="mr-2 h-6 w-6 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Authentication
                </h3>
              </div>
              <p className="mb-3 text-sm text-gray-600">
                User login, registration, and profile management endpoints.
              </p>
              <div className="space-y-1">
                <div className="text-xs text-gray-500">
                  POST /api/auth/login
                </div>
                <div className="text-xs text-gray-500">
                  POST /api/auth/register
                </div>
                <div className="text-xs text-gray-500">
                  GET /api/auth/profile
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-6">
              <div className="mb-3 flex items-center">
                <Database className="mr-2 h-6 w-6 text-green-600" />
                <h3 className="text-lg font-semibold text-gray-900">Courses</h3>
              </div>
              <p className="mb-3 text-sm text-gray-600">
                Course management, categories, and learning progress endpoints.
              </p>
              <div className="space-y-1">
                <div className="text-xs text-gray-500">GET /api/courses</div>
                <div className="text-xs text-gray-500">
                  GET /api/courses/&#123;id&#125;
                </div>
                <div className="text-xs text-gray-500">
                  GET /api/courses/categories
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-6">
              <div className="mb-3 flex items-center">
                <FileText className="mr-2 h-6 w-6 text-purple-600" />
                <h3 className="text-lg font-semibold text-gray-900">System</h3>
              </div>
              <p className="mb-3 text-sm text-gray-600">
                Health checks and system status endpoints.
              </p>
              <div className="space-y-1">
                <div className="text-xs text-gray-500">GET /api/health</div>
                <div className="text-xs text-gray-500">
                  GET /api/swagger.json
                </div>
              </div>
            </div>
          </div>

          {/* Swagger UI */}
          <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
            <div className="border-b border-gray-200 px-6 py-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Interactive API Explorer
              </h2>
              <p className="mt-1 text-gray-600">
                Test all endpoints directly in your browser. Click &quot;Try it
                out&quot; on any endpoint to get started.
              </p>
            </div>
            <div className="swagger-ui-container">
              {swaggerSpec && (
                <SwaggerUI
                  spec={swaggerSpec}
                  docExpansion="list"
                  deepLinking={true}
                  displayRequestDuration={true}
                  tryItOutEnabled={true}
                  filter={true}
                  layout="BaseLayout"
                  plugins={[]}
                  supportedSubmitMethods={[
                    'get',
                    'post',
                    'put',
                    'delete',
                    'patch',
                  ]}
                  defaultModelsExpandDepth={2}
                  defaultModelExpandDepth={3}
                  showExtensions={true}
                  showCommonExtensions={true}
                  persistAuthorization={true}
                  presets={[]}
                  requestInterceptor={(request) => {
                    // 添加请求拦截器，可以在这里添加认证头等
                    console.log('API Request:', request);
                    return request;
                  }}
                  responseInterceptor={(response) => {
                    // 添加响应拦截器，可以在这里处理响应
                    console.log('API Response:', response);
                    return response;
                  }}
                  onComplete={() => {
                    console.log('Swagger UI loaded successfully');
                  }}
                />
              )}
            </div>
          </div>

          {/* 底部信息 */}
          <footer className="mt-12 border-t border-gray-200 pt-8">
            <div className="flex flex-col items-center justify-between md:flex-row">
              <div className="text-sm text-gray-500">
                © 2024 PraxisGrove. API Documentation powered by OpenAPI 3.0
              </div>
              <div className="mt-4 flex space-x-4 md:mt-0">
                <a
                  href="https://swagger.io/docs/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Swagger Docs
                </a>
                <a
                  href="https://github.com/PraxisGrove/frontend"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  GitHub
                </a>
              </div>
            </div>
          </footer>
        </div>
      </main>
    </div>
  );
}
