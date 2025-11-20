import { HeroSection } from '@/components/home/HeroSection';
import { QuickActions } from '@/components/home/QuickActions';
import { FloatingNav } from '@/components/aceternity/floating-navbar';
import { globalNavItems } from '@/lib/navigation';
import {
  SEOHead,
  WebsiteStructuredData,
  OrganizationStructuredData,
  EducationalOrganizationStructuredData,
} from '@/components/seo/SEOHead';
import { DevTools } from '@/components/dev/DevTools';

export default function HomePage() {
  return (
    <>
      {/* SEO 优化 */}
      <SEOHead
        description="PraxisGrove - 通过人工智能技术和区块链技术，为您提供个性化学习体验。探索知识的无限可能，开启智慧学习新时代。"
        keywords={[
          '在线教育',
          'AI学习',
          'Roadmap',
          '个性化学习',
          '人工智能教育',
          'PraxisGrove',
          '沉浸式学习',
        ]}
        type="website"
      />

      {/* 结构化数据 */}
      <WebsiteStructuredData />
      <OrganizationStructuredData />
      <EducationalOrganizationStructuredData />

      <div className="bg-background min-h-screen">
        <FloatingNav navItems={globalNavItems} showLoginButton={true} />

        <main id="main-content" role="main" className="relative z-10">
          <section id="hero" aria-labelledby="hero-title" className="relative">
            <HeroSection />
          </section>
        </main>

        <QuickActions />
        <DevTools />
      </div>
    </>
  );
}
