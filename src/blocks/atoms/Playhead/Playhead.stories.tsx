import type { Meta, StoryObj } from '@storybook/react';
import { Playhead } from './Playhead';

const meta: Meta<typeof Playhead> = {
  title: 'Atoms/Playhead',
  component: Playhead,
  tags: ['autodocs'],
  decorators: [(Story) => <div style={{ position: 'relative', height: 300, background: '#121228' }}><Story /></div>],
};
export default meta;
type Story = StoryObj<typeof Playhead>;

export const Default: Story = { args: { positionPx: 120, heightPx: 280 } };
export const AtStart: Story = { args: { positionPx: 0, heightPx: 280 } };