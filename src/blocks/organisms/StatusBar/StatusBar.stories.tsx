import type { Meta, StoryObj } from '@storybook/react';
import { StatusBar } from './StatusBar';

const meta: Meta<typeof StatusBar> = {
  title: 'Organisms/StatusBar',
  component: StatusBar,
};

export default meta;
type Story = StoryObj<typeof StatusBar>;

export const Default: Story = {
  args: {},
};
