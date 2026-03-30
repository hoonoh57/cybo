import type { Meta, StoryObj } from '@storybook/react';
import { ToolCard } from './ToolCard';

const meta: Meta<typeof ToolCard> = {
    title: 'Molecules/ToolCard',
    component: ToolCard,
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ToolCard>;

export const AutoSubtitle: Story = {
    args: { icon: '📝', label: '자동자막' },
};

export const VoiceSynth: Story = {
    args: { icon: '🗣', label: '음성합성' },
};

export const RemoveSilence: Story = {
    args: { icon: '🔇', label: '무음제거' },
};

export const AIMusic: Story = {
    args: { icon: '🎵', label: 'AI음악' },
};

export const RemoveBG: Story = {
    args: { icon: '🖼', label: '배경제거' },
};
