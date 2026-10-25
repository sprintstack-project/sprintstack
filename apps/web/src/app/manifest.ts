import type { MetadataRoute } from 'next';

// Install metadata for "Add to Home Screen"; the icons live in public/.
const manifest = (): MetadataRoute.Manifest => ({
  name: 'SprintStack',
  short_name: 'SprintStack',
  description: 'Issue tracking for teams that ship.',
  start_url: '/',
  display: 'standalone',
  // The graphite of the app icon (canvas in the dark theme).
  background_color: '#0a0c0b',
  theme_color: '#0a0c0b',
  icons: [
    { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
    { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    { src: '/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
  ],
});

export default manifest;
