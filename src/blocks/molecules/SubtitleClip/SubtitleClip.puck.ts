import { ComponentConfig } from '@measured/puck';
import { SubtitleClip, SubtitleClipProps } from './SubtitleClip';

export const SubtitleClipPuck: ComponentConfig<SubtitleClipProps> = {
  fields: { name: { type: 'text' }, startPx: { type: 'number' }, widthPx: { type: 'number' } },
  defaultProps: { name: '?먮쭑', startPx: 0, widthPx: 100 },
  render: (props) => <SubtitleClip {...props} />,
};