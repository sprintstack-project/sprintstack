import { DatePicker, Field } from '@sprintstack/ui';
import type { Meta, StoryObj } from '@storybook/react-native';
import { fn } from 'storybook/test';

// Dates relative to today so the stories never go stale.
const iso = (offsetDays: number) => {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

const meta = {
  title: 'UI/DatePicker',
  component: DatePicker,
  args: { onValueChange: fn() },
} satisfies Meta<typeof DatePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const States: Story = {
  render: () => (
    <>
      <Field label="Due date">
        <DatePicker defaultValue={iso(7)} />
      </Field>
      <Field label="Start date">
        <DatePicker />
      </Field>
      <Field label="Due date" description="Past due dates say so in red">
        <DatePicker defaultValue={iso(-4)} dueStyle />
      </Field>
      <Field label="Release month" description="Opens on the month grid">
        <DatePicker defaultValue={iso(40)} defaultView="months" />
      </Field>
      <Field label="Sprint start" description="Locked once the sprint begins">
        <DatePicker defaultValue={iso(-2)} disabled />
      </Field>
    </>
  ),
};
