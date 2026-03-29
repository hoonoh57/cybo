import type { Meta, StoryObj } from '@storybook/react';
import { TrackHeader } from './TrackHeader';

const meta: Meta<typeof TrackHeader> = {
  title: 'Molecules/TrackHeader',
  component: TrackHeader,
};

export default meta;
type Story = StoryObj<typeof TrackHeader>;

export const Default: Story = {
  args: {},
};
