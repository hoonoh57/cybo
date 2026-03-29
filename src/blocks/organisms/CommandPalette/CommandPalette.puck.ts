import { ComponentConfig } from '@puckjs/core';
import { CommandPalette, CommandPaletteProps } from './CommandPalette';

export const CommandPalettePuck: ComponentConfig<CommandPaletteProps> = {
  fields: {},
  render: (props) => <CommandPalette {...props} />,
};
