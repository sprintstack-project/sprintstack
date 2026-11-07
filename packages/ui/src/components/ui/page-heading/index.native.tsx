import Eyebrow from '@ui/eyebrow';
import Text from '@ui/text';
import type { PageHeadingProps } from '@ui/types';
import { View } from 'react-native';

const PageHeading = ({ eyebrow, title, accent }: PageHeadingProps) => (
  <View>
    {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
    <Text
      accessibilityRole="header"
      className="text-4xl leading-14 font-extrabold uppercase text-ink"
    >
      {title}
      {accent && <Text className="text-brand-ink"> {accent}</Text>}
    </Text>
  </View>
);

export default PageHeading;
