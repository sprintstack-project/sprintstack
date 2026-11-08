import Button from '@ui/button';
import Card from '@ui/card';
import Text from '@ui/text';
import { View } from 'react-native';

const ImportTile = () => {
  const onImport = () => {};
  return (
    <Card variant="muted">
      <View className="gap-4">
        <Text className="text-eyebrow font-bold uppercase text-ink-muted">
          Moving from another tool?
        </Text>
        <Text
          accessibilityRole="header"
          className="text-[2.5rem] leading-[2.375rem] font-extrabold uppercase text-ink"
        >
          Bring your backlog
        </Text>
        <Text className="text-body font-semibold text-ink-muted">
          Import issues, sprints and assignees from a CSV export.
        </Text>
        <Button size="lg" fullwidth onClick={onImport}>
          Import from CSV
        </Button>
      </View>
    </Card>
  );
};

export default ImportTile;
