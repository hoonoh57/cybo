import { ComponentConfig } from '@puckjs/core';
import { Badge, BadgeProps } from './Badge';

export const BadgePuck: ComponentConfig<BadgeProps> = {
  fields: {},
  render: (props) => <Badge {...props} />,
};
