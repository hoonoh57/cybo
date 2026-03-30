import type { Meta, StoryObj } from '@storybook/react';
import { AudioClip } from './AudioClip';

const meta: Meta<typeof AudioClip> = {
  title: 'Molecules/AudioClip',
  component: AudioClip,
  tags: ['autodocs'],
  decorators: [(Story) => <div style={{ position: 'relative', height: 64, background: '#161630', width: 800 }}><Story /></div>],
};
export default meta;
type Story = StoryObj<typeof AudioClip>;

export const BGM: Story = { args: { name: '諛곌꼍?뚯븙.mp3', startPx: 0, widthPx: 750, clipType: 'bgm' } };
export const Effect: Story = { args: { name: '?④낵 1', startPx: 90, widthPx: 15, clipType: 'effect' } };
export const Overlay: Story = { args: { name: '濡쒓퀬', startPx: 0, widthPx: 180, clipType: 'overlay' } };