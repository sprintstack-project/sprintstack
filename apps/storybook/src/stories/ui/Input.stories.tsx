import { Button, Field, Input } from '@sprintstack/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Eye, EyeOff, Mail, Search, X } from 'lucide-react';
import { useState } from 'react';
import { expect, fn, userEvent, within } from 'storybook/test';

const meta = {
  title: 'UI/Input',
  component: Input,
  args: { placeholder: 'E.g. checkout bug', onChange: fn() },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

/** Same states as design-system/reference/previews/Input.html. */
export const States: Story = {
  render: () => (
    <div className="flex max-w-3xl flex-col gap-5">
      <Input
        pill
        placeholder="E.g. checkout bug"
        slots={{
          left: <Search />,
          right: (
            <Button variant="brand" size="sm">
              Search
            </Button>
          ),
        }}
      />
      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Title">
          <Input placeholder="What needs to be done?" />
        </Field>
        <Field label="Project key" description="Set when the project was created">
          <Input defaultValue="PAY" disabled />
        </Field>
      </div>
    </div>
  ),
};

function PasswordInput() {
  const [visible, setVisible] = useState(false);
  return (
    <Input
      type={visible ? 'text' : 'password'}
      defaultValue="hunter22"
      slots={{
        right: (
          <Button
            variant="ghost"
            size="sm"
            iconOnly
            icon={visible ? EyeOff : Eye}
            onClick={() => setVisible(!visible)}
          >
            {visible ? 'Hide password' : 'Show password'}
          </Button>
        ),
      }}
    />
  );
}

function ClearableInput() {
  const [value, setValue] = useState('Checkout');
  return (
    <Input
      type="search"
      value={value}
      onChange={setValue}
      slots={{
        left: <Search />,
        right: value ? (
          <Button variant="ghost" size="sm" iconOnly icon={X} onClick={() => setValue('')}>
            Clear search
          </Button>
        ) : null,
      }}
    />
  );
}

/** Left and right slots take icons, text or actions. */
export const Slots: Story = {
  render: () => (
    <div className="grid max-w-3xl gap-5 md:grid-cols-2">
      <Field label="Reporter email">
        <Input type="email" placeholder="E.g. sam@example.com" slots={{ left: <Mail /> }} />
      </Field>
      <Field label="Password">
        <PasswordInput />
      </Field>
      <Field label="Search issues">
        <ClearableInput />
      </Field>
      <Field label="Budget">
        <Input defaultValue="1200" slots={{ right: <span className="text-body">EUR</span> }} />
      </Field>
      <Field label="Reporter email" error="Enter a valid email address">
        <Input type="email" defaultValue="not-an-email" slots={{ left: <Mail /> }} />
      </Field>
      <Field label="Reporter email" description="Synced from your profile">
        <Input type="email" defaultValue="sam@example.com" disabled slots={{ left: <Mail /> }} />
      </Field>
    </div>
  ),
};

export const Keyboard: Story = {
  parameters: { singleTheme: true },
  render: (args) => (
    <div className="grid max-w-md gap-5">
      <Field label="Search issues">
        <Input
          onChange={args.onChange}
          slots={{
            left: <Search />,
            right: (
              <Button variant="brand" size="sm">
                Search
              </Button>
            ),
          }}
        />
      </Field>
      <Field label="Project key">
        <Input defaultValue="PAY" disabled />
      </Field>
    </div>
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const search = canvas.getByRole('textbox', { name: 'Search issues' });

    await userEvent.tab();
    await expect(search).toHaveFocus();
    await userEvent.keyboard('Login');
    await expect(search).toHaveValue('Login');
    await expect(args.onChange).toHaveBeenLastCalledWith('Login');

    // Tab reaches the action in the right slot; the disabled field is skipped.
    await userEvent.tab();
    await expect(canvas.getByRole('button', { name: 'Search' })).toHaveFocus();
    await userEvent.tab();
    await expect(canvas.getByRole('textbox', { name: 'Project key' })).not.toHaveFocus();
  },
};

export const Labels: Story = {
  parameters: { singleTheme: true },
  render: () => (
    <div className="grid max-w-md gap-5">
      <Field label="Reporter email" error="Enter a valid email address">
        <Input type="email" defaultValue="not-an-email" slots={{ left: <Mail /> }} />
      </Field>
      <Field label="Search issues">
        <ClearableInput />
      </Field>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Slot content never leaks into the field's name.
    const email = canvas.getByRole('textbox', { name: 'Reporter email' });
    await expect(email).toHaveAttribute('aria-invalid', 'true');
    await expect(email).toHaveAccessibleDescription('Enter a valid email address');
    // The shell shows the error state from Field via :has().
    await expect(getComputedStyle(email.parentElement as HTMLElement).borderColor).not.toBe(
      getComputedStyle(
        canvas.getByRole('searchbox', { name: 'Search issues' }).parentElement as HTMLElement,
      ).borderColor,
    );

    // Slot actions are labelled buttons and work.
    const search = canvas.getByRole('searchbox', { name: 'Search issues' });
    await userEvent.click(canvas.getByRole('button', { name: 'Clear search' }));
    await expect(search).toHaveValue('');
    await expect(canvas.queryByRole('button', { name: 'Clear search' })).toBeNull();
  },
};
