import type { Meta, StoryObj } from '@storybook/react-vite';
import Button from '@ui/button';
import Field from '@ui/field';
import Input from '@ui/input';
import { Eye, EyeOff, Mail, Search, X } from 'lucide-react';
import { useState } from 'react';
import { expect, fn, userEvent, within } from 'storybook/test';
import { code } from '../../lib/code';

const meta = {
  title: 'UI/Input',
  component: Input,
  parameters: {
    docs: {
      description: {
        component: `A 56px text field. \`slots\` put icons, units or actions on either side; \`pill\` makes the search-bar style.

\`\`\`tsx
import Button from '@ui/button';
import Input from '@ui/input';
import { Search } from 'lucide-react';

<Input value={query} onChange={setQuery} placeholder="E.g. checkout bug" />

<Input
  pill
  slots={{ left: <Search />, right: <Button variant="brand" size="sm">Search</Button> }}
/>
\`\`\`

Wrap it (and every other control) in \`Field\` for the bold label, helper text and red error. Base UI controls link to the label automatically, and the error replaces the helper text:

\`\`\`tsx
import Field from '@ui/field';
import Input from '@ui/input';

<Field label="Reporter email" required description="We'll let them know" error={errors.email}>
  <Input type="email" value={email} onChange={setEmail} onBlur={validate} />
</Field>
\`\`\`

In forms, \`@sprintstack/forms\` renders the Field for you: \`<f.TextField label="Summary" />\`.`,
      },
    },
  },
  args: { placeholder: 'E.g. checkout bug', onChange: fn() },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  parameters: {
    docs: {
      source: {
        code: code`
          import Field from '@ui/field';
          import Input from '@ui/input';
          import { useState } from 'react';

          const Summary = () => {
            const [summary, setSummary] = useState('');
            return (
              <Field label="Summary">
                <Input value={summary} onChange={setSummary} placeholder="E.g. checkout bug" />
              </Field>
            );
          };
        `,
      },
    },
  },
};

/** Same states as design-system/reference/previews/Input.html. */
export const States: Story = {
  parameters: {
    docs: {
      source: {
        code: code`
          import Button from '@ui/button';
          import Field from '@ui/field';
          import Input from '@ui/input';
          import { Search } from 'lucide-react';

          // Search bar
          <Input
            pill
            placeholder="E.g. checkout bug"
            slots={{
              left: <Search />,
              right: (
                <Button variant="brand" size="sm" onClick={search}>
                  Search
                </Button>
              ),
            }}
          />

          <Field label="Title">
            <Input placeholder="What needs to be done?" />
          </Field>

          <Field label="Project key" description="Set when the project was created">
            <Input defaultValue="PAY" disabled />
          </Field>
        `,
      },
    },
  },
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

const PasswordInput = () => {
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
};

const ClearableInput = () => {
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
};

/** Left and right slots take icons, text or actions. */
export const Slots: Story = {
  parameters: {
    docs: {
      source: {
        code: code`
          import Button from '@ui/button';
          import Field from '@ui/field';
          import Input from '@ui/input';
          import { Eye, EyeOff, Mail, Search, X } from 'lucide-react';
          import { useState } from 'react';

          // Icon on the left
          <Field label="Reporter email">
            <Input type="email" placeholder="E.g. sam@example.com" slots={{ left: <Mail /> }} />
          </Field>

          // Action on the right (prefer InputPassword for real password fields)
          const PasswordInput = () => {
            const [visible, setVisible] = useState(false);
            return (
              <Input
                type={visible ? 'text' : 'password'}
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
          };

          // Clear button that only shows with a value
          const SearchIssues = () => {
            const [query, setQuery] = useState('');
            return (
              <Field label="Search issues">
                <Input
                  type="search"
                  value={query}
                  onChange={setQuery}
                  slots={{
                    left: <Search />,
                    right: query ? (
                      <Button variant="ghost" size="sm" iconOnly icon={X} onClick={() => setQuery('')}>
                        Clear search
                      </Button>
                    ) : null,
                  }}
                />
              </Field>
            );
          };

          // Unit on the right
          <Field label="Budget">
            <Input defaultValue="1200" slots={{ right: <span className="text-body">EUR</span> }} />
          </Field>

          // Error and disabled
          <Field label="Reporter email" error="Enter a valid email address">
            <Input type="email" defaultValue="not-an-email" slots={{ left: <Mail /> }} />
          </Field>
          <Field label="Reporter email" description="Synced from your profile">
            <Input type="email" defaultValue="sam@example.com" disabled slots={{ left: <Mail /> }} />
          </Field>
        `,
      },
    },
  },
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
  tags: ['!autodocs'],
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

    // Clicking a label moves focus to its control.
    await userEvent.click(canvas.getByText('Search issues'));
    await expect(search).toHaveFocus();
  },
};

export const Labels: Story = {
  tags: ['!autodocs'],
  parameters: { singleTheme: true },
  render: () => (
    <div className="grid max-w-md gap-5">
      <Field
        label="Summary"
        required
        htmlFor="summary"
        description="Shown on boards and in notifications"
      >
        <Input id="summary" placeholder="Enter a summary" />
      </Field>
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

    // The asterisk is decorative, so the name is just the label; the description is announced.
    const summary = canvas.getByRole('textbox', { name: 'Summary' });
    await expect(summary).toHaveAttribute('id', 'summary');
    await expect(summary).toHaveAccessibleDescription('Shown on boards and in notifications');
    await expect(summary).not.toHaveAttribute('aria-invalid');

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
