import type { Meta, StoryObj } from '@storybook/react';
import { SectionTitle } from './SectionTitle';

const meta: Meta<typeof SectionTitle> = {
    title: 'Atoms/SectionTitle',
    component: SectionTitle,
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof SectionTitle>;

export const Default: Story = {
    args: { title: '최근 프로젝트', actionLabel: '모두 보기 →' },
};

export const NoAction: Story = {
    args: { title: '템플릿', actionLabel: '' },
};
