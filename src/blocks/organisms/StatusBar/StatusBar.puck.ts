import { ComponentConfig } from '@puckjs/core';
import { StatusBar, StatusBarProps } from './StatusBar';

export const StatusBarPuck: ComponentConfig<StatusBarProps> = {
  fields: {},
  render: (props) => <StatusBar {...props} />,
};
