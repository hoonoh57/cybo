import { ComponentConfig } from '@measured/puck';
import { VideoClip, VideoClipProps } from './VideoClip';

export const VideoClipPuck: ComponentConfig<VideoClipProps> = {
  fields: { name: { type: 'text' }, startPx: { type: 'number' }, widthPx: { type: 'number' }, duration: { type: 'number' } },
  defaultProps: { name: '?대┰', startPx: 0, widthPx: 120, duration: 30 },
  render: (props) => <VideoClip {...props} />,
};