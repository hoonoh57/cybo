import type { Meta, StoryObj } from '@storybook/react';
import { TimelineRuler } from './TimelineRuler';

const meta: Meta<typeof TimelineRuler> = {
  title: 'Molecules/TimelineRuler',
  component: TimelineRuler,
  tags: ['autodocs'],
  decorators: [(Story) => <div style={{ overflowX: 'auto', background: '#121228', padding: 8 }}><Story /></div>],
};
export default meta;
type Story = StoryObj<typeof TimelineRuler>;

export const Default: Story = { args: { totalDuration: 330, pixelsPerSecond: 3 } };
export const ZoomedIn: Story = { args: { totalDuration: 330, pixelsPerSecond: 8 } };