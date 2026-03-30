import type { Meta, StoryObj } from '@storybook/react';
import { ZoomSlider } from './ZoomSlider';
import { useState } from 'react';

const meta: Meta<typeof ZoomSlider> = {
  title: 'Atoms/ZoomSlider',
  component: ZoomSlider,
  tags: ['autodocs'],
  decorators: [(Story) => <div style={{ padding: 20, background: '#181830' }}><Story /></div>],
};
export default meta;
type Story = StoryObj<typeof ZoomSlider>;

export const Default: Story = { args: { zoom: 100, onChange: () => {} } };
export const ZoomedIn: Story = { args: { zoom: 300, onChange: () => {} } };