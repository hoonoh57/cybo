import type { Meta, StoryObj } from '@storybook/react';
import { ExportShell } from './ExportShell';

const meta: Meta<typeof ExportShell> = {
  title: 'Templates/ExportShell',
  component: ExportShell,
};

export default meta;
type Story = StoryObj<typeof ExportShell>;

export const Default: Story = {
  args: {},
};
