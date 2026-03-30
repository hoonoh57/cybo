import { ComponentConfig } from '@measured/puck';
import { Playhead, PlayheadProps } from './Playhead';

export const PlayheadPuck: ComponentConfig<PlayheadProps> = {
  fields: {
    positionPx: { type: 'number' },
    heightPx: { type: 'number' },
  },
  defaultProps: { positionPx: 100, heightPx: 280 },
  render: (props) => <Playhead {...props} />,
};