import type { MetadataRoute } from 'next';

// The app is private, yet crawlers are let in on purpose: noindex (layout.tsx) and the X-Robots-Tag
// header (next.config.ts) are what keep pages out of results, and a crawler blocked here never
// reads them, so a URL linked from elsewhere could still be listed.
const robots = (): MetadataRoute.Robots => ({
  rules: { userAgent: '*', allow: '/' },
});

export default robots;
