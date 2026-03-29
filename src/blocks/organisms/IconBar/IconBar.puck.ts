import { ComponentConfig } from '@puckjs/core';
import { IconBar, IconBarProps } from './IconBar';

export const IconBarPuck: ComponentConfig<IconBarProps> = {
  fields: {},
  render: (props) => <IconBar {...props} />,
};
