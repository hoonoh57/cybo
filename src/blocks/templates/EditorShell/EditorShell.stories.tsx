import type { Meta, StoryObj } from '@storybook/react';
import { EditorShell } from './EditorShell';

const meta: Meta<typeof EditorShell> = {
  title: 'Templates/EditorShell',
  component: EditorShell,
};

export default meta;
type Story = StoryObj<typeof EditorShell>;

export const Default: Story = {
  args: {},
};
