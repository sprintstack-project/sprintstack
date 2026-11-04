import { Skeleton, Text } from '@sprintstack/ui';
import type { Meta, StoryObj } from '@storybook/react-native';
import type { ReactNode } from 'react';
import { View } from 'react-native';

const meta = {
  title: 'UI/Skeleton',
  component: Skeleton,
  args: { shape: 'line', width: 240 },
  argTypes: {
    shape: {
      control: 'select',
      options: ['line', 'heading', 'circle', 'pill', 'control', 'input', 'bar', 'icon'],
    },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

const Labelled = ({ label, children }: { label: string; children: ReactNode }) => (
  <View className="gap-2">
    {children}
    <Text className="text-meta text-ink-muted">{label}</Text>
  </View>
);

export const BuildingBlocks: Story = {
  render: () => (
    <View className="gap-6">
      <Labelled label="Text line · 14px, radius 8">
        <Skeleton lines={3} />
      </Labelled>
      <Labelled label="Heading · 26px">
        <Skeleton shape="heading" width={220} />
      </Labelled>
      <Labelled label="Avatar · circle">
        <View className="flex-row items-center gap-3">
          <Skeleton shape="circle" width={32} />
          <Skeleton shape="circle" width={48} />
        </View>
      </Labelled>
      <Labelled label="Badge / chip · pill">
        <View className="flex-row gap-3">
          <Skeleton shape="pill" width={110} />
          <Skeleton shape="pill" width={80} />
        </View>
      </Labelled>
      <Labelled label="Control · pill">
        <Skeleton shape="control" />
      </Labelled>
      <Labelled label="Input · 56px, radius 16">
        <Skeleton shape="input" />
      </Labelled>
      <Labelled label="Bar / progress">
        <Skeleton shape="bar" />
      </Labelled>
      <Labelled label="Icon tile · 24px, radius 8">
        <Skeleton shape="icon" />
      </Labelled>
    </View>
  ),
};

export const WorkItemCard: Story = {
  render: () => (
    <View className="gap-4 rounded-xl border border-line bg-surface p-4">
      <View className="flex-row items-center gap-3">
        <Skeleton shape="icon" />
        <Skeleton width={80} />
      </View>
      <Skeleton lines={2} />
      <View className="flex-row items-center justify-between">
        <Skeleton shape="pill" width={80} />
        <Skeleton shape="circle" width={32} />
      </View>
    </View>
  ),
};
