import type { Meta, StoryObj } from '@storybook/react-vite';
import Checkbox from '@ui/checkbox';
import { expect, fn, userEvent, within } from 'storybook/test';
import { code } from '../../lib/code';

const meta = {
  title: 'UI/Checkbox',
  component: Checkbox,
  parameters: {
    docs: {
      description: {
        component: `A checkbox with its label. Links inside the label stay clickable.

\`\`\`tsx
import Checkbox from '@ui/checkbox';

<Checkbox checked={keep} onCheckedChange={setKeep}>Keep me signed in on this device</Checkbox>
\`\`\``,
      },
    },
  },
  args: { children: 'Keep me signed in on this device', onCheckedChange: fn() },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  parameters: {
    docs: {
      source: {
        code: code`
          import Checkbox from '@ui/checkbox';
          import { useState } from 'react';

          const KeepSignedIn = () => {
            const [keep, setKeep] = useState(false);
            return (
              <Checkbox checked={keep} onCheckedChange={setKeep}>
                Keep me signed in on this device
              </Checkbox>
            );
          };
        `,
      },
    },
  },
};

export const States: Story = {
  parameters: {
    docs: {
      source: {
        code: code`
          import Checkbox from '@ui/checkbox';

          <Checkbox>Keep me signed in on this device</Checkbox>
          <Checkbox defaultChecked>Don’t ask again on this device for 30 days</Checkbox>

          // Links inside the label stay clickable
          <Checkbox error="Agree to the Terms to continue">
            I agree to the{' '}
            <a href="/terms" className="link">
              Terms
            </a>
          </Checkbox>

          <Checkbox disabled defaultChecked>
            Managed by your organisation
          </Checkbox>
        `,
      },
    },
  },
  render: () => (
    <div className="grid max-w-md gap-4">
      <Checkbox>Keep me signed in on this device</Checkbox>
      <Checkbox defaultChecked>Don’t ask again on this device for 30 days</Checkbox>
      <Checkbox error="Agree to the Terms to continue">
        I agree to the{' '}
        <a href="#terms" className="link">
          Terms
        </a>
      </Checkbox>
      <Checkbox disabled defaultChecked>
        Managed by your organisation
      </Checkbox>
    </div>
  ),
};

/** Clicking the box or its label toggles it, and Space works from the keyboard. */
export const Toggle: Story = {
  tags: ['!autodocs'],
  parameters: { singleTheme: true },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const box = canvas.getByRole('checkbox', { name: 'Keep me signed in on this device' });

    await userEvent.click(box);
    await expect(box).toBeChecked();
    await expect(args.onCheckedChange).toHaveBeenLastCalledWith(true);

    await userEvent.click(canvas.getByText('Keep me signed in on this device'));
    await expect(box).not.toBeChecked();

    box.focus();
    await userEvent.keyboard(' ');
    await expect(box).toBeChecked();
  },
};
