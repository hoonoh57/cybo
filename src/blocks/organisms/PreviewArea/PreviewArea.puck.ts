import { ComponentConfig } from '@puckjs/core';
import { PreviewArea, PreviewAreaProps } from './PreviewArea';

export const PreviewAreaPuck: ComponentConfig<PreviewAreaProps> = {
  fields: {},
  render: (props) => <PreviewArea {...props} />,
};
