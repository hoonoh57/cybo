import { ComponentConfig } from '@puckjs/core';
import { Timeline, TimelineProps } from './Timeline';

export const TimelinePuck: ComponentConfig<TimelineProps> = {
  fields: {},
  render: (props) => <Timeline {...props} />,
};
