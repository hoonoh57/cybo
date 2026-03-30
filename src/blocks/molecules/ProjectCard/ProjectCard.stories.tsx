import type { Meta, StoryObj } from '@storybook/react';
import { ProjectCard } from './ProjectCard';

const meta: Meta<typeof ProjectCard> = {
    title: 'Molecules/ProjectCard',
    component: ProjectCard,
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ProjectCard>;

export const InProgress: Story = {
    args: {
        name: '여행 브이로그 EP.12',
        date: '2026.03.28',
        progress: 75,
        thumbnail: 'https://picsum.photos/seed/travel/400/200',
    },
};

export const Complete: Story = {
    args: {
        name: '쿠킹 클래스 #5',
        date: '2026.03.27',
        progress: 100,
        thumbnail: 'https://picsum.photos/seed/cooking/400/200',
    },
};

export const EarlyStage: Story = {
    args: {
        name: '서울 야경 시네마틱',
        date: '2026.03.25',
        progress: 40,
        thumbnail: 'https://picsum.photos/seed/city/400/200',
    },
};
