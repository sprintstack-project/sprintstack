import path from 'node:path';
import type { NextConfig } from 'next';

// Monorepo root: dependencies are hoisted to <root>/node_modules
const workspaceRoot = path.join(__dirname, '../..');

// The NestJS API, which serves Better Auth at /api/auth and GraphQL at /graphql.
const apiUrl = process.env.API_URL ?? 'http://localhost:3000';

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  reactCompiler: true,
  outputFileTracingRoot: workspaceRoot,
  // Serve the API from this origin: auth cookies are first-party (and sent with GraphQL requests),
  // and passkeys use this domain.
  // Keep every response out of search indexes, including non-HTML files the robots meta tag
  // can't cover (images, the manifest, proxied API responses).
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Robots-Tag', value: 'noindex, nofollow, noarchive, nosnippet, noimageindex' },
        ],
      },
    ];
  },
  async rewrites() {
    return [
      { source: '/api/auth/:path*', destination: `${apiUrl}/api/auth/:path*` },
      { source: '/api/graphql', destination: `${apiUrl}/graphql` },
    ];
  },
  turbopack: {
    root: workspaceRoot,
    rules: {
      '*.css': {
        loaders: ['@tailwindcss/turbopack'],
        as: '*.css',
      },
    },
  },
};

export default nextConfig;
