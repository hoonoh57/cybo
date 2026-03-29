import type { Meta, StoryObj } from '@storybook/react';
import { RightPanel } from './RightPanel';

const meta: Meta<typeof RightPanel> = {
  title: 'Organisms/RightPanel',
  component: RightPanel,
};

export default meta;
type Story = StoryObj<typeof RightPanel>;

export const Default: Story = {
  args: {},
};
