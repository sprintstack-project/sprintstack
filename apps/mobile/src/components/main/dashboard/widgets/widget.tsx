import Button from '@ui/button';
import Card from '@ui/card';
import Text from '@ui/text';
import { type Href, router } from 'expo-router';
import type { ReactNode } from 'react';
import { View } from 'react-native';

interface WidgetProps {
  title: string;
  /** The page the widget summarises, behind its "See all" link. */
  link?: { label: string; href: string };
  children: ReactNode;
}

/** A dashboard widget: a Card with an uppercase title and an optional link to the full page. */
export const Widget = ({ title, link, children }: WidgetProps) => {
  return (
    <Card>
      <View className="flex-row items-center gap-3">
        <Text
          accessibilityRole="header"
          className="flex-1 text-title font-extrabold uppercase text-ink"
        >
          {title}
        </Text>
        {link && (
          <Button variant="link" onClick={() => router.navigate(link.href as Href)}>
            {link.label}
          </Button>
        )}
      </View>
      <View className="mt-3">{children}</View>
    </Card>
  );
};
