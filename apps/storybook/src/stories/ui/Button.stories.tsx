import { Button } from '@sprintstack/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { ArrowRight, Bookmark, Plus, Trash2 } from 'lucide-react';
import { expect, fn, userEvent, within } from 'storybook/test';

const meta = {
  title: 'UI/Button',
  component: Button,
  parameters: {
    docs: {
      description: {
        component: `Fat pills with heavy condensed labels. \`primary\` (ink) for the main action, \`brand\` (red) for the one action you want people to take (at most one per view), \`secondary\` and \`danger\` outlines, \`ghost\` for icon buttons in bars, \`link\` for inline text actions.

\`\`\`tsx
import { Button } from '@sprintstack/ui';
import { Plus, Bookmark } from 'lucide-react'; // lucide-react-native on mobile

<Button variant="primary" icon={Plus} onClick={create}>Create issue</Button>
<Button variant="brand">Start sprint</Button>
<Button variant="ghost" iconOnly icon={Bookmark}>Watch</Button> {/* children = accessible name */}
\`\`\``,
      },
    },
  },
  args: { children: 'Create issue', onClick: fn() },
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'brand', 'secondary', 'danger', 'ghost', 'link'],
    },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = { args: { variant: 'primary' } };

/** Same states as design-system/reference/previews/Button.html. */
export const States: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center gap-3">
        <Button variant="primary">Create issue</Button>
        <Button variant="brand">Start sprint</Button>
        <Button>Cancel</Button>
        <Button variant="danger">Delete</Button>
        <Button variant="link">View details</Button>
        <Button disabled>Disabled</Button>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <Button variant="primary" size="sm">
          Small
        </Button>
        <Button variant="primary">Medium</Button>
        <Button variant="primary" size="lg">
          Large
        </Button>
        <Button variant="brand" iconOnly icon={ArrowRight}>
          Next
        </Button>
        <Button variant="primary" iconOnly icon={Plus}>
          Add
        </Button>
        <Button variant="ghost" iconOnly icon={Bookmark}>
          Watch
        </Button>
      </div>
    </div>
  ),
};

export const WithIcons: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button variant="primary" icon={Plus}>
        Create issue
      </Button>
      <Button variant="brand" iconEnd={ArrowRight}>
        Start sprint
      </Button>
      <Button variant="danger" icon={Trash2}>
        Delete
      </Button>
      <Button variant="link" iconEnd={ArrowRight}>
        See all
      </Button>
    </div>
  ),
};

export const Keyboard: Story = {
  tags: ['!autodocs'],
  parameters: { singleTheme: true },
  args: { onClick: fn() },
  render: (args) => (
    <div className="flex gap-3">
      <Button variant="primary" onClick={args.onClick}>
        Create issue
      </Button>
      <Button disabled onClick={args.onClick}>
        Disabled
      </Button>
      <Button variant="link" onClick={args.onClick}>
        View details
      </Button>
    </div>
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const create = canvas.getByRole('button', { name: 'Create issue' });
    const link = canvas.getByRole('button', { name: 'View details' });

    await userEvent.tab();
    await expect(create).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    await userEvent.keyboard(' ');
    await expect(args.onClick).toHaveBeenCalledTimes(2);

    // Disabled buttons are skipped in the tab order and ignore clicks.
    await userEvent.tab();
    await expect(link).toHaveFocus();
    await userEvent.click(canvas.getByRole('button', { name: 'Disabled' }));
    await expect(args.onClick).toHaveBeenCalledTimes(2);
    await expect(canvas.getByRole('button', { name: 'Disabled' })).toBeDisabled();

    await userEvent.keyboard('{Enter}');
    await expect(args.onClick).toHaveBeenCalledTimes(3);
  },
};

export const Labels: Story = {
  tags: ['!autodocs'],
  parameters: { singleTheme: true },
  render: () => (
    <div className="flex gap-3">
      <Button variant="brand" iconOnly icon={ArrowRight}>
        Next
      </Button>
      <Button variant="primary" icon={Plus}>
        Create issue
      </Button>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // Icon-only buttons take their children as the accessible name.
    const next = canvas.getByRole('button', { name: 'Next' });
    await expect(next).toHaveTextContent('Next');
    await expect(next.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
    // Icons never add to the name.
    await expect(canvas.getByRole('button', { name: 'Create issue' })).toBeInTheDocument();
    for (const button of canvas.getAllByRole('button')) {
      await expect(button).toHaveAttribute('type', 'button');
    }
  },
};
