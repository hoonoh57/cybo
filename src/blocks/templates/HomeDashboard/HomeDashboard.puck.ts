import { ComponentConfig } from '@puckjs/core';
import { HomeDashboard, HomeDashboardProps } from './HomeDashboard';

export const HomeDashboardPuck: ComponentConfig<HomeDashboardProps> = {
  fields: {},
  render: (props) => <HomeDashboard {...props} />,
};
