import type { Meta, StoryObj } from '@storybook/react';
import { SecurityBadge } from './SecurityBadge';

const meta: Meta<typeof SecurityBadge> = {
    title: 'Atoms/SecurityBadge',
    component: SecurityBadge,
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof SecurityBadge>;

export const Default: Story = { args: {} };

export const Custom: Story = {
    args: { label: '🔒 완전한 로컬 처리 - 클라우드 없음' },
};
