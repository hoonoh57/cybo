import { ComponentConfig } from '@measured/puck';
import { TimelineToolbar, TimelineToolbarProps } from './TimelineToolbar';

export const TimelineToolbarPuck: ComponentConfig<TimelineToolbarProps> = {
  fields: {},
  defaultProps: {},
  render: (props) => <TimelineToolbar {...props} />,
};