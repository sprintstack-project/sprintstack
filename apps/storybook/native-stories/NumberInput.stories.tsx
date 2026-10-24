import { Field, NumberInput } from '@sprintstack/ui';
import type { Meta, StoryObj } from '@storybook/react-native';
import { fn } from 'storybook/test';

const meta = {
  title: 'UI/NumberInput',
  component: NumberInput,
  args: { defaultValue: 3, min: 0, max: 21, onValueChange: fn() },
} satisfies Meta<typeof NumberInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const States: Story = {
  render: () => (
    <>
      <Field label="Story points">
        <NumberInput defaultValue={3} min={0} max={21} />
      </Field>
      <Field label="Capacity" error="Must be 100% or less">
        <NumberInput defaultValue={120} unit="%" invalid />
      </Field>
      <Field label="Sprint length" description="At the minimum, minus is disabled">
        <NumberInput defaultValue={1} min={1} max={4} unit="weeks" />
      </Field>
      <Field label="Estimate" description="Locked after planning">
        <NumberInput defaultValue={5} disabled />
      </Field>
    </>
  ),
};
