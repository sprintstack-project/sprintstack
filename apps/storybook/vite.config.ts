/// <reference types="vitest/config" />

// https://vite.dev/config/
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { playwright } from '@vitest/browser-playwright';
import { defineConfig } from 'vite';

const dirname =
  typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url));

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // packages/ui's internal aliases (see its tsconfig.web.json); Vite compiles that source directly.
  // Pre-bundle what @sprintstack/ui imports. Otherwise Vite discovers them mid-test-run and
  // reloads the browser, failing that run.
  optimizeDeps: {
    include: [
      '@base-ui/react/button',
      '@base-ui/react/combobox',
      '@base-ui/react/field',
      '@base-ui/react/input',
      '@base-ui/react/number-field',
      '@base-ui/react/popover',
      '@base-ui/react/select',
      '@base-ui/react/toggle',
      '@tanstack/react-form',
      '@tanstack/react-virtual',
      '@tiptap/extensions',
      '@tiptap/react',
      '@tiptap/starter-kit',
      'clsx',
      'lucide-react',
      'react-day-picker',
      'tailwind-merge',
      'zod',
    ],
  },
  resolve: {
    alias: {
      '@ui': path.resolve(dirname, '../../packages/ui/src/components/ui'),
      '@lib': path.resolve(dirname, '../../packages/ui/src/lib'),
    },
  },
  test: {
    projects: [
      {
        extends: true,
        plugins: [
          // The plugin will run tests for the stories defined in your Storybook config
          // See options at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon#storybooktest
          storybookTest({
            configDir: path.join(dirname, '.storybook'),
          }),
        ],
        test: {
          name: 'storybook',
          browser: {
            enabled: true,
            headless: true,
            provider: playwright({}),
            instances: [
              {
                browser: 'chromium',
              },
            ],
          },
        },
      },
    ],
  },
});
