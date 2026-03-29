import type { Meta, StoryObj } from '@storybook/react';
import { PreviewArea } from './PreviewArea';

const meta: Meta<typeof PreviewArea> = {
  title: 'Organisms/PreviewArea',
  component: PreviewArea,
};

export default meta;
type Story = StoryObj<typeof PreviewArea>;

export const Default: Story = {
  args: {},
};
