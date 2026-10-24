import type { Decorator, Preview } from '@storybook/react-vite';
import './preview.css';

type Theme = 'both' | 'light' | 'dark';

// Tokens are scoped to [data-theme], so Day and Night can render next to each other.
const withThemes: Decorator = (Story, { globals, parameters }) => {
  const theme = (globals.theme ?? 'both') as Theme;
  const themes =
    theme === 'both' && !parameters.singleTheme
      ? ['light', 'dark']
      : [theme === 'dark' ? 'dark' : 'light'];
  return (
    <div className="grid gap-px bg-line md:grid-flow-col md:auto-cols-fr">
      {themes.map((t) => (
        <div key={t} data-theme={t} className="min-h-40 bg-canvas p-8 font-sans text-ink">
          <Story />
        </div>
      ))}
    </div>
  );
};

const preview: Preview = {
  decorators: [withThemes],
  globalTypes: {
    theme: {
      description: 'Strata Bold theme',
      toolbar: {
        title: 'Theme',
        icon: 'mirror',
        items: [
          { value: 'both', title: 'Day + Night' },
          { value: 'light', title: 'Day' },
          { value: 'dark', title: 'Night' },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: { theme: 'both' },
  parameters: {
    layout: 'fullscreen',
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo',
    },
  },
};

export default preview;
