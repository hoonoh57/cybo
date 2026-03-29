import type { Meta, StoryObj } from '@storybook/react';
import { AICreatorShell } from './AICreatorShell';

const meta: Meta<typeof AICreatorShell> = {
  title: 'Templates/AICreatorShell',
  component: AICreatorShell,
};

export default meta;
type Story = StoryObj<typeof AICreatorShell>;

export const Default: Story = {
  args: {},
};
