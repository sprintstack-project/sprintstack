import { Button } from '@sprintstack/ui';
import type { Decorator, Preview } from '@storybook/react-native';
import { ScrollView, View } from 'react-native';
import { Uniwind, useUniwind } from 'uniwind';

// Day/Night switch above every story, like the web Storybook's theme toolbar.
const withTheme: Decorator = (Story) => {
  const { theme } = useUniwind();
  return (
    <View className="flex-1 bg-canvas">
      <View className="flex-row justify-end border-b border-line px-4 py-2">
        <Button size="sm" onClick={() => Uniwind.setTheme(theme === 'dark' ? 'light' : 'dark')}>
          {theme === 'dark' ? 'Day' : 'Night'}
        </Button>
      </View>
      <ScrollView contentContainerClassName="gap-5 p-4 pb-24" keyboardShouldPersistTaps="handled">
        <Story />
      </ScrollView>
    </View>
  );
};

const preview: Preview = {
  decorators: [withTheme],
  parameters: {
    controls: {
      matchers: { color: /(background|color)$/i, date: /Date$/ },
    },
  },
};

export default preview;
