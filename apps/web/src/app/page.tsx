import { Faq } from '@/components/landing/faq';
import { Features, ValuePoints } from '@/components/landing/features';
import { Hero } from '@/components/landing/hero';
import { HowItWorks } from '@/components/landing/how-it-works';
import { Mobile } from '@/components/landing/mobile';
import { Pricing } from '@/components/landing/pricing';
import { FinalCta, SiteFooter } from '@/components/landing/site-footer';
import { SiteHeader } from '@/components/landing/site-header';

const HomePage = () => {
  return (
    <div className="flex-1 bg-canvas text-base leading-6 text-ink">
      <SiteHeader />
      <main>
        <Hero />
        <ValuePoints />
        <Features />
        <Mobile />
        <HowItWorks />
        <Pricing />
        <Faq />
        <FinalCta />
      </main>
      <SiteFooter />
    </div>
  );
};

export default HomePage;
