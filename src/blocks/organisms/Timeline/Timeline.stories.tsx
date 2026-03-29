import type { Meta, StoryObj } from '@storybook/react';
import { Timeline } from './Timeline';

const meta: Meta<typeof Timeline> = {
  title: 'Organisms/Timeline',
  component: Timeline,
};

export default meta;
type Story = StoryObj<typeof Timeline>;

export const Default: Story = {
  args: {},
};
