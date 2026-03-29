import { ComponentConfig } from '@puckjs/core';
import { QuickToolbar, QuickToolbarProps } from './QuickToolbar';

export const QuickToolbarPuck: ComponentConfig<QuickToolbarProps> = {
  fields: {},
  render: (props) => <QuickToolbar {...props} />,
};
