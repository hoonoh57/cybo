import { ComponentConfig } from '@measured/puck';
import { TransportBar, TransportBarProps } from './TransportBar';

export const TransportBarPuck: ComponentConfig<TransportBarProps> = {
  fields: {
    currentTime: { type: 'number' },
    totalDuration: { type: 'number' },
    isPlaying: { type: 'radio', options: [{ label: 'Playing', value: true }, { label: 'Paused', value: false }] },
    speed: { type: 'text' },
  },
  defaultProps: { currentTime: 84.5, totalDuration: 330, isPlaying: false, speed: '1.0x', onTogglePlay: () => {}, onSpeedChange: () => {} },
  render: (props) => <TransportBar {...props} />,
};