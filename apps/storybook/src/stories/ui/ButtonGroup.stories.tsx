import { Button, ButtonGroup } from '@sprintstack/ui';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';

const meta = {
  title: 'UI/ButtonGroup',
  component: ButtonGroup,
  parameters: {
    docs: {
      description: {
        component: `A row of buttons with the standard gap; it wraps when there isn't room. In a form, \`form.FormActions\` lays out Save and Discard with it.

\`\`\`tsx
import { Button, ButtonGroup } from '@sprintstack/ui';

<ButtonGroup>
  <Button variant="brand" size="lg">Save changes</Button>
  <Button variant="ghost" size="lg">Discard</Button>
</ButtonGroup>
\`\`\``,
      },
    },
  },
  args: {
    children: (
      <>
        <Button variant="brand" size="lg">
          Save changes
        </Button>
        <Button variant="ghost" size="lg">
          Discard
        </Button>
      </>
    ),
  },
} satisfies Meta<typeof ButtonGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

/** It renders every button it's given. */
export const Buttons: Story = {
  tags: ['!autodocs'],
  parameters: { singleTheme: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getAllByRole('button')).toHaveLength(2);
  },
};
