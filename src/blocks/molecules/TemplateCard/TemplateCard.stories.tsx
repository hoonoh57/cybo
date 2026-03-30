import type { Meta, StoryObj } from '@storybook/react';
import { TemplateCard } from './TemplateCard';

const meta: Meta<typeof TemplateCard> = {
    title: 'Molecules/TemplateCard',
    component: TemplateCard,
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof TemplateCard>;

export const InstaReels: Story = {
    args: { icon: '📱', label: '인스타 릴스', accentColor: '#E1306C' },
};

export const YoutubeShorts: Story = {
    args: { icon: '🎬', label: '유튜브 쇼츠', accentColor: '#FF0000' },
};

export const ProductReview: Story = {
    args: { icon: '📦', label: '제품 리뷰', accentColor: '#FF9800' },
};

export const Education: Story = {
    args: { icon: '📚', label: '교육', accentColor: '#4CAF50' },
};
