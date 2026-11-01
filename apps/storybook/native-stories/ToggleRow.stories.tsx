import { ToggleRow } from '@sprintstack/ui';
import type { Meta, StoryObj } from '@storybook/react-native';
import { useState } from 'react';
import { View } from 'react-native';
import { fn } from 'storybook/test';

const meta = {
  title: 'UI/ToggleRow',
  component: ToggleRow,
  args: {
    title: 'Carry over unfinished work',
    description: 'Open items move to the next sprint, not the backlog.',
    checked: false,
    onCheckedChange: fn(),
  },
} satisfies Meta<typeof ToggleRow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => {
    const [checked, setChecked] = useState(args.checked);
    return (
      <View>
        <ToggleRow
          {...args}
          checked={checked}
          onCheckedChange={(next) => {
            setChecked(next);
            args.onCheckedChange(next);
          }}
        />
      </View>
    );
  },
};

export const Stacked: Story = {
  render: () => (
    <View>
      <ToggleRow
        title="Start the next sprint automatically"
        description="At 09:00 on its start day."
        checked
        onCheckedChange={() => {}}
      />
      <ToggleRow
        title="Carry over unfinished work"
        description="Open items move to the next sprint, not the backlog."
        checked={false}
        onCheckedChange={() => {}}
      />
    </View>
  ),
};
