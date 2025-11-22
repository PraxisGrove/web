'use client';

import Head from 'next/head';
import { usePathname } from 'next/navigation';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product';
  siteName?: string;
  locale?: string;
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  section?: string;
  tags?: string[];
  noindex?: boolean;
  nofollow?: boolean;
  canonical?: string;
}

const defaultSEO = {
  title: 'PraxisGrove',
  description:
    '通过人工智能技术和3D知识宇宙，为您提供个性化学习体验。探索知识的无限可能，开启智慧学习新时代。',
  keywords: [
    '在线教育',
    'AI学习',
    '3D知识宇宙',
    '个性化学习',
    '人工智能教育',
    'PraxisGrove',
  ],
  siteName: 'PraxisGrove',
  locale: 'zh_CN',
  type: 'website' as const,
};

export function SEOHead({
  title,
  description = defaultSEO.description,
  keywords = defaultSEO.keywords,
  image = '/images/og-image.jpg',
  url,
  type = defaultSEO.type,
  siteName = defaultSEO.siteName,
  locale = defaultSEO.locale,
  author,
  publishedTime,
  modifiedTime,
  section,
  tags,
  noindex = false,
  nofollow = false,
  canonical,
}: SEOProps) {
  const pathname = usePathname();

  // 构建完整标题
  const fullTitle = title
    ? `${title} | ${defaultSEO.siteName}`
    : defaultSEO.title;

  // 构建完整URL
  const fullUrl =
    url ||
    `${process.env.NEXT_PUBLIC_SITE_URL || 'https://praxisgrove.com'}${pathname || ''}`;

  // 构建关键词字符串
  const keywordsString = keywords.join(', ');

  // 构建robots指令
  const robotsContent = [
    noindex ? 'noindex' : 'index',
    nofollow ? 'nofollow' : 'follow',
  ].join(', ');

  return (
    <Head>
      {/* 基础Meta标签 */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywordsString} />
      <meta name="author" content={author || siteName} />
      <meta name="robots" content={robotsContent} />

      {/* 语言和地区 */}
      <meta name="language" content={locale} />
      <meta httpEquiv="content-language" content={locale} />

      {/* 规范链接 */}
      <link rel="canonical" href={canonical || fullUrl} />

      {/* Open Graph标签 */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content={locale} />
      {image && <meta property="og:image" content={image} />}
      {image && <meta property="og:image:alt" content={description} />}

      {/* 文章特定的Open Graph标签 */}
      {type === 'article' && author && (
        <meta property="article:author" content={author} />
      )}
      {type === 'article' && publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      {type === 'article' && modifiedTime && (
        <meta property="article:modified_time" content={modifiedTime} />
      )}
      {type === 'article' && section && (
        <meta property="article:section" content={section} />
      )}
      {type === 'article' &&
        tags &&
        tags.map((tag, index) => (
          <meta key={index} property="article:tag" content={tag} />
        ))}

      {/* Twitter Card标签 */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      {image && <meta name="twitter:image" content={image} />}
      <meta name="twitter:site" content="@PraxisGrove" />
      <meta name="twitter:creator" content="@PraxisGrove" />

      {/* 移动端优化 */}
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1, shrink-to-fit=no"
      />
      <meta name="format-detection" content="telephone=no" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />

      {/* 主题颜色 */}
      <meta name="theme-color" content="#8b5cf6" />
      <meta name="msapplication-TileColor" content="#8b5cf6" />

      {/* 图标 */}
      <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href="/favicon-32x32.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href="/favicon-16x16.png"
      />
      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href="/apple-touch-icon.png"
      />
      <link rel="manifest" href="/site.webmanifest" />

      {/* DNS预解析 */}
      <link rel="dns-prefetch" href="//fonts.googleapis.com" />
      <link rel="dns-prefetch" href="//fonts.gstatic.com" />
      <link rel="dns-prefetch" href="//api.praxisgrove.com" />

      {/* 预连接 */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossOrigin="anonymous"
      />
    </Head>
  );
}

// 结构化数据组件
export function StructuredData({ data }: { data: object }) {
  return (
    <Head>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(data),
        }}
      />
    </Head>
  );
}

// 网站结构化数据
export function WebsiteStructuredData() {
  const websiteData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'PraxisGrove',
    description: '一所无需许可的学校',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://praxisgrove.com',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://praxisgrove.com'}/courses?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
    sameAs: [
      'https://twitter.com/PraxisGrove',
      'https://linkedin.com/company/praxisgrove',
      'https://github.com/PraxisGrove',
    ],
  };

  return <StructuredData data={websiteData} />;
}

// 组织结构化数据
export function OrganizationStructuredData() {
  const organizationData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'PraxisGrove',
    description: '一所无需许可的学校',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://praxisgrove.com',
    logo: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://praxisgrove.com'}/images/logo.png`,
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+86-400-123-4567',
      contactType: 'customer service',
      availableLanguage: ['Chinese', 'English'],
    },
    sameAs: [
      'https://twitter.com/PraxisGrove',
      'https://linkedin.com/company/praxisgrove',
      'https://github.com/PraxisGrove',
    ],
  };

  return <StructuredData data={organizationData} />;
}

// 教育组织结构化数据
export function EducationalOrganizationStructuredData() {
  const educationalData = {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    name: 'PraxisGrove',
    description: '一所无需许可的学校',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://praxisgrove.com',
    logo: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://praxisgrove.com'}/images/logo.png`,
    hasCredential: {
      '@type': 'EducationalOccupationalCredential',
      name: '在线学习认证',
      description: '完成课程后获得的学习认证',
    },
    offers: {
      '@type': 'Offer',
      category: '在线教育服务',
      description: '一所无需许可的学校',
    },
  };

  return <StructuredData data={educationalData} />;
}
