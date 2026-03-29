import type { Meta, StoryObj } from '@storybook/react';
import { LeftPanel } from './LeftPanel';

const meta: Meta<typeof LeftPanel> = {
  title: 'Organisms/LeftPanel',
  component: LeftPanel,
};

export default meta;
type Story = StoryObj<typeof LeftPanel>;

export const Default: Story = {
  args: {},
};
