import { ComponentConfig } from '@puckjs/core';
import { Icon, IconProps } from './Icon';

export const IconPuck: ComponentConfig<IconProps> = {
  fields: {},
  render: (props) => <Icon {...props} />,
};
