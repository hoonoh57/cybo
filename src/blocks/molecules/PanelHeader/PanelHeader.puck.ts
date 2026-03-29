import { ComponentConfig } from '@puckjs/core';
import { PanelHeader, PanelHeaderProps } from './PanelHeader';

export const PanelHeaderPuck: ComponentConfig<PanelHeaderProps> = {
  fields: {},
  render: (props) => <PanelHeader {...props} />,
};
