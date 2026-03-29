import { ComponentConfig } from '@puckjs/core';
import { ExportShell, ExportShellProps } from './ExportShell';

export const ExportShellPuck: ComponentConfig<ExportShellProps> = {
  fields: {},
  render: (props) => <ExportShell {...props} />,
};
