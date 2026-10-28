import { Field, RangeCalendar } from '@sprintstack/ui';
import type { Meta, StoryObj } from '@storybook/react-native';
import { fn } from 'storybook/test';

// Dates relative to today so the stories never go stale.
const iso = (offsetDays: number) => {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

const meta = {
  title: 'UI/RangeCalendar',
  component: RangeCalendar,
  args: { onValueChange: fn() },
} satisfies Meta<typeof RangeCalendar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const States: Story = {
  render: () => (
    <>
      <Field label="Days off" description="Holidays carry a dot">
        <RangeCalendar
          defaultValue={{ start: iso(1), end: iso(4) }}
          markers={[{ date: iso(6), label: 'Company holiday' }]}
        />
      </Field>
      <Field label="Half day" description="One day only">
        <RangeCalendar defaultValue={{ start: iso(2), end: iso(2) }} single />
      </Field>
      <Field label="Days off" description="Locked once approved">
        <RangeCalendar defaultValue={{ start: iso(-2), end: iso(0) }} disabled />
      </Field>
    </>
  ),
};
