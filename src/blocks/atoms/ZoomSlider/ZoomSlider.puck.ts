import { ComponentConfig } from '@measured/puck';
import { ZoomSlider, ZoomSliderProps } from './ZoomSlider';

export const ZoomSliderPuck: ComponentConfig<ZoomSliderProps> = {
  fields: {
    zoom: { type: 'number' },
    min: { type: 'number' },
    max: { type: 'number' },
  },
  defaultProps: { zoom: 100, min: 50, max: 400, onChange: () => {} },
  render: (props) => <ZoomSlider {...props} />,
};