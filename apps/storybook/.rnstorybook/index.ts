import AsyncStorage from '@react-native-async-storage/async-storage';
import { LiteUI } from '@storybook/react-native-ui-lite';
import { view } from './storybook.requires';

const StorybookUIRoot = view.getStorybookUI({
  // Remembers the last open story between reloads.
  storage: { getItem: AsyncStorage.getItem, setItem: AsyncStorage.setItem },
  // LiteUI skips @gorhom/bottom-sheet; needs liteMode in metro.config.js.
  CustomUIComponent: LiteUI,
});

export default StorybookUIRoot;
