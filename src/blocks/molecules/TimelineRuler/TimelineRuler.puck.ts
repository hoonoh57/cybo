import { ComponentConfig } from '@measured/puck';
import { TimelineRuler, TimelineRulerProps } from './TimelineRuler';

export const TimelineRulerPuck: ComponentConfig<TimelineRulerProps> = {
  fields: {
    totalDuration: { type: 'number' },
    pixelsPerSecond: { type: 'number' },
  },
  defaultProps: { totalDuration: 330, pixelsPerSecond: 3 },
  render: (props) => <TimelineRuler {...props} />,
};