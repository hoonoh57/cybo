import type { Meta, StoryObj } from '@storybook/react';
import { TrackLane } from './TrackLane';

const meta: Meta<typeof TrackLane> = {
  title: 'Molecules/TrackLane',
  component: TrackLane,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof TrackLane>;

export const Main: Story = { args: { trackType: 'main', widthPx: 600 } };
export const Sub: Story = { args: { trackType: 'subtitle', widthPx: 600 } };