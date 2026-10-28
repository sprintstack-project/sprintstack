import { Field, RangeCalendar } from '@sprintstack/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';

// Stories use dates relative to today so they never go stale.
const day = (offsetDays: number) => {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d;
};
const iso = (offsetDays: number) => {
  const d = day(offsetDays);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};
// Day buttons are named "Tuesday 27 October, …".
const named = (offsetDays: number) =>
  new RegExp(
    `^${day(offsetDays).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}`,
  );

const meta = {
  title: 'UI/RangeCalendar',
  component: RangeCalendar,
  parameters: {
    docs: {
      description: {
        component: `An inline calendar for a run of days: the first press sets the start, the next the end; an earlier day starts over. The range is a band with ink ends; today is ringed; markers (public holidays) carry a dot and their name for screen readers. Values are \`{ start, end }\` in ISO dates.

\`\`\`tsx
import { Field, RangeCalendar } from '@sprintstack/ui';

<Field label="Days off">
  <RangeCalendar value={range} onValueChange={setRange} markers={holidays} />
</Field>
\`\`\`

In forms, use \`f.RangeCalendarField\` from \`@sprintstack/forms\` with \`dateRange()\` from \`@sprintstack/shared\`.`,
      },
    },
  },
  args: { onValueChange: fn() },
  decorators: [
    (Story) => (
      <div className="max-w-md">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof RangeCalendar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const States: Story = {
  render: () => (
    <div className="grid max-w-4xl gap-10 md:grid-cols-2">
      <Field label="Days off" description="Holidays carry a dot">
        <RangeCalendar
          defaultValue={{ start: iso(1), end: iso(4) }}
          markers={[{ date: iso(6), label: 'Company holiday' }]}
        />
      </Field>
      <Field label="Half day" description="One day only">
        <RangeCalendar defaultValue={{ start: iso(2), end: iso(2) }} single />
      </Field>
      <Field label="Days off" error="Pick at least one working day">
        <RangeCalendar invalid />
      </Field>
      <Field label="Days off" description="Locked once approved">
        <RangeCalendar defaultValue={{ start: iso(-2), end: iso(0) }} disabled />
      </Field>
    </div>
  ),
};

export const Picking: Story = {
  tags: ['!autodocs'],
  parameters: { singleTheme: true },
  render: (args) => (
    <Field label="Days off">
      <RangeCalendar min={iso(0)} onValueChange={args.onValueChange} />
    </Field>
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    // Keep to this month so the days are on the grid shown.
    const offset = day(2).getMonth() === day(0).getMonth() ? 0 : -2;
    const first = offset + 1;
    const last = offset + 2;

    // The grid is labelled by the field.
    await expect(canvas.getByRole('group', { name: 'Days off' })).toBeInTheDocument();

    // Start, then end.
    await userEvent.click(canvas.getByRole('button', { name: named(first) }));
    await expect(args.onValueChange).toHaveBeenLastCalledWith({
      start: iso(first),
      end: iso(first),
    });
    await userEvent.click(canvas.getByRole('button', { name: named(last) }));
    await expect(args.onValueChange).toHaveBeenLastCalledWith({
      start: iso(first),
      end: iso(last),
    });

    // A press after a full range starts a new one.
    await userEvent.click(canvas.getByRole('button', { name: named(first) }));
    await expect(args.onValueChange).toHaveBeenLastCalledWith({
      start: iso(first),
      end: iso(first),
    });

    // Days before `min` can't be picked.
    if (day(-1).getMonth() === day(0).getMonth()) {
      await expect(canvas.getByRole('button', { name: named(-1) })).toBeDisabled();
    }
  },
};
