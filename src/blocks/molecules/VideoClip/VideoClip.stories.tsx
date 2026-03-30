import type { Meta, StoryObj } from '@storybook/react';
import { VideoClip } from './VideoClip';

const meta: Meta<typeof VideoClip> = {
  title: 'Molecules/VideoClip',
  component: VideoClip,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ position: 'relative', height: 64, background: '#1e1e3a', width: 600 }}>
        <Story />
      </div>
    ),
  ],
};
export default meta;
type Story = StoryObj<typeof VideoClip>;

export const Default: Story = { args: { name: 'Intro', startPx: 0, widthPx: 90, duration: 30 } };
export const Selected: Story = { args: { name: 'Part A', startPx: 105, widthPx: 270, duration: 90, selected: true } };
