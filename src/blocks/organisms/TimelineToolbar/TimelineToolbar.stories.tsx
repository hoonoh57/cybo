import type { Meta, StoryObj } from '@storybook/react';
import { TimelineToolbar } from './TimelineToolbar';

const meta: Meta<typeof TimelineToolbar> = {
  title: 'Organisms/TimelineToolbar',
  component: TimelineToolbar,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof TimelineToolbar>;

export const Default: Story = { args: {} };