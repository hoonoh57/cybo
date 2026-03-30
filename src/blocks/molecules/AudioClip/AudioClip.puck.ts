import { ComponentConfig } from '@measured/puck';
import { AudioClip, AudioClipProps } from './AudioClip';

export const AudioClipPuck: ComponentConfig<AudioClipProps> = {
  fields: {
    name: { type: 'text' },
    startPx: { type: 'number' },
    widthPx: { type: 'number' },
    clipType: { type: 'select', options: [{ label: 'BGM', value: 'bgm' }, { label: 'Effect', value: 'effect' }, { label: 'Overlay', value: 'overlay' }] },
  },
  defaultProps: { name: '?ㅻ뵒??, startPx: 0, widthPx: 200, clipType: 'bgm' },
  render: (props) => <AudioClip {...props} />,
};