import { ComponentConfig } from '@puckjs/core';
import { ClipCard, ClipCardProps } from './ClipCard';

export const ClipCardPuck: ComponentConfig<ClipCardProps> = {
  fields: {},
  render: (props) => <ClipCard {...props} />,
};
