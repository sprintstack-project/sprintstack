import { PortalContainerProvider } from '@sprintstack/ui';
import type { Decorator, Preview } from '@storybook/react-vite';
import { type ReactNode, useState } from 'react';
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
        <ThemePanel key={t} theme={t}>
          <Story />
        </ThemePanel>
      ))}
    </div>
  );
};

// Popups portal into their own panel so they take that panel's theme.
function ThemePanel({ theme, children }: { theme: string; children: ReactNode }) {
  const [panel, setPanel] = useState<HTMLDivElement | null>(null);
  return (
    <div
      ref={setPanel}
      data-theme={theme}
      className="relative min-h-40 bg-canvas p-8 font-sans text-ink"
    >
      <PortalContainerProvider value={panel}>{children}</PortalContainerProvider>
    </div>
  );
}

const preview: Preview = {
  // A docs page per component: usage snippet, props table and every story with its code.
  tags: ['autodocs'],
  decorators: [withThemes],
  globalTypes: {
    theme: {
      description: 'SprintStack Bold theme',
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
    docs: {
      // The Code panel beside each story shows the code for what you're looking at.
      codePanel: true,
    },
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
