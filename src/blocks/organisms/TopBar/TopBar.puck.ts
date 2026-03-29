import { ComponentConfig } from '@puckjs/core';
import { TopBar, TopBarProps } from './TopBar';

export const TopBarPuck: ComponentConfig<TopBarProps> = {
  fields: {},
  render: (props) => <TopBar {...props} />,
};
