import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { StorybookConfig } from '@storybook/react-vite';

/**
 * This function is used to resolve the absolute path of a package.
 * It is needed in projects that use Yarn PnP or are set up within a monorepo.
 */
const getAbsolutePath = (value: string) => {
  return dirname(fileURLToPath(import.meta.resolve(`${value}/package.json`)));
};
const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    getAbsolutePath('@chromatic-com/storybook'),
    getAbsolutePath('@storybook/addon-vitest'),
    getAbsolutePath('@storybook/addon-a11y'),
    getAbsolutePath('@storybook/addon-docs'),
  ],
  framework: getAbsolutePath('@storybook/react-vite'),
  // Props tables: our props types live in other files (packages/ui/.../types.ts and the
  // design-system contract), which only react-docgen-typescript follows.
  typescript: {
    reactDocgen: 'react-docgen-typescript',
    reactDocgenTypescriptOptions: {
      tsconfigPath: './tsconfig.docgen.json',
      // Component sources live outside this app; document them as well as the stories.
      include: ['src/**/*.tsx', '../../packages/ui/src/**/*.tsx'],
      exclude: ['**/*.stories.tsx', '**/*.native.tsx'],
      shouldExtractLiteralValuesFromEnum: true,
      shouldRemoveUndefinedFromOptional: true,
      // Our props only, not every DOM/React attribute.
      propFilter: (prop) => !prop.parent?.fileName.includes('node_modules'),
    },
  },
};
export default config;
