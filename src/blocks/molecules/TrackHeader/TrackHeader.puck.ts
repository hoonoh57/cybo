import { ComponentConfig } from '@puckjs/core';
import { TrackHeader, TrackHeaderProps } from './TrackHeader';

export const TrackHeaderPuck: ComponentConfig<TrackHeaderProps> = {
  fields: {},
  render: (props) => <TrackHeader {...props} />,
};
