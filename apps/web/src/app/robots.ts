import type { MetadataRoute } from 'next';

// The app is private: ask every crawler to stay out. Pages also carry noindex (layout.tsx) and every
// response an X-Robots-Tag header (next.config.ts), since robots.txt alone doesn't stop indexing of
// URLs linked from elsewhere.
const robots = (): MetadataRoute.Robots => ({
  rules: { userAgent: '*', disallow: '/' },
});

export default robots;
