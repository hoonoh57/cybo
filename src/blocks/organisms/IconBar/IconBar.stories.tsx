import type { Meta, StoryObj } from '@storybook/react';
import { IconBar } from './IconBar';

const meta: Meta<typeof IconBar> = {
  title: 'Organisms/IconBar',
  component: IconBar,
};

export default meta;
type Story = StoryObj<typeof IconBar>;

export const Default: Story = {
  args: {},
};
