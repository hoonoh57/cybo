import type { Meta, StoryObj } from '@storybook/react';
import { HomeDashboard } from './HomeDashboard';

const meta: Meta<typeof HomeDashboard> = {
  title: 'Templates/HomeDashboard',
  component: HomeDashboard,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof HomeDashboard>;

export const Default: Story = {};
