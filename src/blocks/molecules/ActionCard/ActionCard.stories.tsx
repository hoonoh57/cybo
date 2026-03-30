import type { Meta, StoryObj } from '@storybook/react';
import { ActionCard } from './ActionCard';

const meta: Meta<typeof ActionCard> = {
    title: 'Molecules/ActionCard',
    component: ActionCard,
    tags: ['autodocs'],
    argTypes: {
        variant: { control: 'select', options: ['gradient', 'surface'] },
    },
};

export default meta;
type Story = StoryObj<typeof ActionCard>;

export const AICreate: Story = {
    args: {
        icon: '✨',
        title: 'AI가 만들어줘요',
        subtitle: '아이디어만 말해주세요',
        variant: 'gradient',
    },
};

export const ManualEdit: Story = {
    args: {
        icon: '🎬',
        title: '직접 편집할게요',
        subtitle: '내 영상을 자유롭게',
        variant: 'surface',
    },
};
