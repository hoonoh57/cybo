import { ComponentConfig } from '@puckjs/core';
import { AICreatorShell, AICreatorShellProps } from './AICreatorShell';

export const AICreatorShellPuck: ComponentConfig<AICreatorShellProps> = {
  fields: {},
  render: (props) => <AICreatorShell {...props} />,
};
