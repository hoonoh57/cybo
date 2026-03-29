import { ComponentConfig } from '@puckjs/core';
import { TabItem, TabItemProps } from './TabItem';

export const TabItemPuck: ComponentConfig<TabItemProps> = {
  fields: {},
  render: (props) => <TabItem {...props} />,
};
