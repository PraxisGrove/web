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
        description="PraxisGrove - Providing personalized learning experiences through AI and blockchain technology. Explore infinite possibilities of knowledge and unlock a new era of intelligent learning."
        keywords={[
          'Online Education',
          'AI Learning',
          'Roadmap',
          'Personalized Learning',
          'AI Education',
          'PraxisGrove',
          'Immersive Learning',
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
