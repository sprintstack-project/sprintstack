import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { StorybookConfig } from '@storybook/react-native';

const getAbsolutePath = (value: string): string => {
  return dirname(fileURLToPath(import.meta.resolve(`${value}/package.json`)));
};

// Native stories render the .native.tsx components on a device. Web stories (src/stories) render
// the DOM components and run in Vitest; the two sets differ because layout and queries do.
const main: StorybookConfig = {
  stories: ['../native-stories/**/*.stories.?(ts|tsx)'],
  deviceAddons: [
    getAbsolutePath('@storybook/addon-ondevice-controls'),
    getAbsolutePath('@storybook/addon-ondevice-actions'),
  ],
};

export default main;
