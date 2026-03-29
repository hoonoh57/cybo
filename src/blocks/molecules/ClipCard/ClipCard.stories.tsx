import type { Meta, StoryObj } from '@storybook/react';
import { ClipCard } from './ClipCard';

const meta: Meta<typeof ClipCard> = {
  title: 'Molecules/ClipCard',
  component: ClipCard,
};

export default meta;
type Story = StoryObj<typeof ClipCard>;

export const Default: Story = {
  args: {},
};
