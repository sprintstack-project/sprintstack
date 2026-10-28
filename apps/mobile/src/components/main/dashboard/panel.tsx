import { Button, Card, Text } from '@sprintstack/ui';
import { type Href, router } from 'expo-router';
import type { ReactNode } from 'react';
import { View } from 'react-native';

interface PanelProps {
  title: string;
  /** The page the panel summarises, behind its "See all" link. */
  link?: { label: string; href: string };
  children: ReactNode;
}

/** A dashboard panel: a Card with an uppercase title and an optional link to the full page. */
export const Panel = ({ title, link, children }: PanelProps) => {
  return (
    <Card
      actions={
        <View className="flex-1 flex-row items-center gap-3">
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
      }
    >
      {children}
    </Card>
  );
};
