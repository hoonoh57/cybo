import { ComponentConfig } from '@puckjs/core';
import { EditorShell, EditorShellProps } from './EditorShell';

export const EditorShellPuck: ComponentConfig<EditorShellProps> = {
  fields: {},
  render: (props) => <EditorShell {...props} />,
};
