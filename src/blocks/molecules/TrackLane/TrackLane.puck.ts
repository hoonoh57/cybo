import { ComponentConfig } from '@measured/puck';
import { TrackLane, TrackLaneProps } from './TrackLane';

export const TrackLanePuck: ComponentConfig<TrackLaneProps> = {
  fields: {
    trackType: { type: 'select', options: [{ label: 'Main', value: 'main' }, { label: 'Subtitle', value: 'subtitle' }, { label: 'BGM', value: 'bgm' }, { label: 'Effect', value: 'effect' }, { label: 'Overlay', value: 'overlay' }] },
    widthPx: { type: 'number' },
  },
  defaultProps: { trackType: 'main', widthPx: 990 },
  render: (props) => <TrackLane {...props} />,
};