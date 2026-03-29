import { ComponentConfig } from '@puckjs/core';
import { LeftPanel, LeftPanelProps } from './LeftPanel';

export const LeftPanelPuck: ComponentConfig<LeftPanelProps> = {
  fields: {},
  render: (props) => <LeftPanel {...props} />,
};
