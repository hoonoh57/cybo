import { ComponentConfig } from '@puckjs/core';
import { Tooltip, TooltipProps } from './Tooltip';

export const TooltipPuck: ComponentConfig<TooltipProps> = {
  fields: {},
  render: (props) => <Tooltip {...props} />,
};
