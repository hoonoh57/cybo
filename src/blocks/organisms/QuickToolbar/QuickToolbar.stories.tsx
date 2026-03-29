import type { Meta, StoryObj } from '@storybook/react';
import { QuickToolbar } from './QuickToolbar';

const meta: Meta<typeof QuickToolbar> = {
  title: 'Organisms/QuickToolbar',
  component: QuickToolbar,
};

export default meta;
type Story = StoryObj<typeof QuickToolbar>;

export const Default: Story = {
  args: {},
};
