import type { Meta, StoryObj } from '@storybook/react';
import { SubtitleClip } from './SubtitleClip';

const meta: Meta<typeof SubtitleClip> = {
  title: 'Molecules/SubtitleClip',
  component: SubtitleClip,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ position: 'relative', height: 64, background: '#161630', width: 600 }}>
        <Story />
      </div>
    ),
  ],
};
export default meta;
type Story = StoryObj<typeof SubtitleClip>;

export const Default: Story = { args: { name: 'Hello', startPx: 15, widthPx: 75 } };
export const Selected: Story = { args: { name: 'Next scene', startPx: 300, widthPx: 120, selected: true } };
