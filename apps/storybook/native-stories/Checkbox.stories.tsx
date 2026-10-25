import { Checkbox } from '@sprintstack/ui';
import type { Meta, StoryObj } from '@storybook/react-native';
import { fn } from 'storybook/test';

const meta = {
  title: 'UI/Checkbox',
  component: Checkbox,
  args: { children: 'Keep me signed in on this device', onCheckedChange: fn() },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const States: Story = {
  render: () => (
    <>
      <Checkbox>Keep me signed in on this device</Checkbox>
      <Checkbox defaultChecked>Trust this phone for 30 days</Checkbox>
      <Checkbox error="Agree to the Terms to continue">
        I agree to the Terms and Privacy notice
      </Checkbox>
      <Checkbox disabled defaultChecked>
        Managed by your organisation
      </Checkbox>
    </>
  ),
};
