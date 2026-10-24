import { DatePicker, Field } from '@sprintstack/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test';

// Stories use dates relative to today so they never go stale.
const iso = (offsetDays: number) => {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};
const label = (offsetDays: number) => {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
};

const meta = {
  title: 'UI/DatePicker',
  component: DatePicker,
  parameters: {
    docs: {
      description: {
        component: `A field that opens a calendar: today ringed in ink, the selection filled red, and a month grid behind the title. Values are ISO dates (\`YYYY-MM-DD\`) and show as \`30 Oct 2026\`.

\`\`\`tsx
import { DatePicker } from '@sprintstack/ui';

<DatePicker value={due} onValueChange={setDue} min={sprintStart} dueStyle />
\`\`\`

\`dueStyle\` adds "· Overdue" in red to past dates.`,
      },
    },
  },
  args: { onValueChange: fn() },
} satisfies Meta<typeof DatePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

/** Same states as design-system/reference/previews/DatePicker.html (calendar open on the first). */
export const States: Story = {
  // Opens a menu on load: give it its own frame on the docs page so the popup has room.
  parameters: { docs: { story: { inline: false, iframeHeight: 560 } } },
  render: () => (
    <div className="grid max-w-3xl gap-5 pb-[440px] md:grid-cols-2">
      <Field label="Due date">
        <DatePicker defaultValue={iso(7)} defaultOpen />
      </Field>
      <div className="flex flex-col gap-5">
        <Field label="Start date">
          <DatePicker />
        </Field>
        <Field label="Due date" description="Past due dates say so in red">
          <DatePicker defaultValue={iso(-4)} dueStyle />
        </Field>
      </div>
    </div>
  ),
};

export const More: Story = {
  // Opens a menu on load: give it its own frame on the docs page so the popup has room.
  parameters: { docs: { story: { inline: false, iframeHeight: 560 } } },
  render: () => (
    <div className="grid max-w-3xl gap-5 pb-80 md:grid-cols-2">
      <Field label="Release month" description="Opens on the month grid">
        <DatePicker defaultValue={iso(40)} defaultView="months" defaultOpen />
      </Field>
      <div className="flex flex-col gap-5">
        <Field label="Due date" error="Pick a date after the sprint starts">
          <DatePicker defaultValue={iso(-30)} invalid />
        </Field>
        <Field label="Sprint start" description="Locked once the sprint begins">
          <DatePicker defaultValue={iso(-2)} disabled />
        </Field>
      </div>
    </div>
  ),
};

export const Keyboard: Story = {
  tags: ['!autodocs'],
  parameters: { singleTheme: true },
  render: (args) => (
    <div className="pb-[440px]">
      <Field label="Due date">
        <DatePicker defaultValue={iso(0)} min={iso(-1)} onValueChange={args.onValueChange} />
      </Field>
    </div>
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: `Due date ${label(0)}` });

    // Enter opens with focus on the selected day; arrows move by day; Enter picks and closes.
    await userEvent.tab();
    await expect(trigger).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    const dialog = await screen.findByRole('dialog', { name: 'Choose a date' });
    await waitFor(() =>
      expect(within(dialog).getByRole('grid').querySelector('button:focus')).not.toBeNull(),
    );
    await userEvent.keyboard('{ArrowRight}{Enter}');
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    await expect(args.onValueChange).toHaveBeenLastCalledWith(iso(1));
    await expect(trigger).toHaveTextContent(label(1));

    // Days before `min` can't be picked.
    await userEvent.click(trigger);
    const picker = await screen.findByRole('dialog');
    const grid = within(picker).getByRole('grid');
    const before = within(grid)
      .getAllByRole('button')
      .find((b) => b.hasAttribute('disabled'));
    if (before) await expect(before).toBeDisabled();

    // Clear empties the field; Escape closes without changing.
    await userEvent.click(within(picker).getByRole('button', { name: 'Clear' }));
    await expect(args.onValueChange).toHaveBeenLastCalledWith(null);
    await userEvent.click(trigger);
    await screen.findByRole('dialog');
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
  },
};

export const Labels: Story = {
  tags: ['!autodocs'],
  parameters: { singleTheme: true },
  render: () => (
    <div className="pb-[440px]">
      <Field label="Due date" description="Past due dates say so in red">
        <DatePicker defaultValue={iso(-4)} dueStyle />
      </Field>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // The value is read with the label, and overdue is said in words.
    const trigger = canvas.getByRole('button', { name: `Due date ${label(-4)} · Overdue` });
    await expect(trigger).toHaveAccessibleDescription('Past due dates say so in red');

    // The month title switches to the month grid and back.
    await userEvent.click(trigger);
    const dialog = await screen.findByRole('dialog');
    await userEvent.click(within(dialog).getByRole('button', { name: /choose a month/ }));
    await expect(within(dialog).getAllByRole('button', { pressed: true })).toHaveLength(1);
    await userEvent.keyboard('{Escape}');
  },
};
