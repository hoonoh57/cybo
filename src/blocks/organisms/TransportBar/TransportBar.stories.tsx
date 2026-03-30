import type { Meta, StoryObj } from '@storybook/react';
import { TransportBar } from './TransportBar';

const meta: Meta<typeof TransportBar> = {
  title: 'Organisms/TransportBar',
  component: TransportBar,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof TransportBar>;

export const Playing: Story = { args: { currentTime: 84.5, totalDuration: 330, isPlaying: true, speed: '1.0x', onTogglePlay: () => {}, onSpeedChange: () => {} } };
export const Paused: Story = { args: { currentTime: 0, totalDuration: 330, isPlaying: false, speed: '1.0x', onTogglePlay: () => {}, onSpeedChange: () => {} } };