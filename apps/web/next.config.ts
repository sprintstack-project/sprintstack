import path from 'node:path';
import type { NextConfig } from 'next';

// Monorepo root: dependencies are hoisted to <root>/node_modules
const workspaceRoot = path.join(__dirname, '../..');

// The NestJS API, which serves Better Auth at /api/auth.
const apiUrl = process.env.API_URL ?? 'http://localhost:3000';

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  reactCompiler: true,
  outputFileTracingRoot: workspaceRoot,
  // Serve auth from this origin so its cookies are first-party and passkeys use this domain.
  async rewrites() {
    return [{ source: '/api/auth/:path*', destination: `${apiUrl}/api/auth/:path*` }];
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
