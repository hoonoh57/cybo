import { ComponentConfig } from '@measured/puck';
import { TopBar, TopBarProps } from './TopBar';

export const TopBarPuck: ComponentConfig<TopBarProps> = {
  fields: {
    appName: { type: 'text' },
    userInitial: { type: 'text' },
  },
  defaultProps: { appName: 'AI-Studio', userInitial: 'U' },
  render: (props) => <TopBar { ...props } />,
};
