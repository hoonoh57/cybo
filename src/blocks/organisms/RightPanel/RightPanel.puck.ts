import { ComponentConfig } from '@puckjs/core';
import { RightPanel, RightPanelProps } from './RightPanel';

export const RightPanelPuck: ComponentConfig<RightPanelProps> = {
  fields: {},
  render: (props) => <RightPanel {...props} />,
};
