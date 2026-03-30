import type { Meta, StoryObj } from '@storybook/react';
import { TopBar } from './TopBar';

const meta: Meta<typeof TopBar> = {
  title: 'Organisms/TopBar',
  component: TopBar,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof TopBar>;

export const Default: Story = {
  args: { appName: 'AI-Studio', userInitial: 'U' },
};
