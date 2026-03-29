import type { Meta, StoryObj } from '@storybook/react';
import { PanelHeader } from './PanelHeader';

const meta: Meta<typeof PanelHeader> = {
  title: 'Molecules/PanelHeader',
  component: PanelHeader,
};

export default meta;
type Story = StoryObj<typeof PanelHeader>;

export const Default: Story = {
  args: {},
};
