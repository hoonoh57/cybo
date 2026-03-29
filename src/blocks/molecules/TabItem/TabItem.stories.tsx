import type { Meta, StoryObj } from '@storybook/react';
import { TabItem } from './TabItem';

const meta: Meta<typeof TabItem> = {
  title: 'Molecules/TabItem',
  component: TabItem,
};

export default meta;
type Story = StoryObj<typeof TabItem>;

export const Default: Story = {
  args: {},
};
