import { ComponentConfig } from '@measured/puck';
import { ToolCard, ToolCardProps } from './ToolCard';

export const ToolCardPuck: ComponentConfig<ToolCardProps> = {
    fields: {
        icon: { type: 'text' },
        label: { type: 'text' },
    },
    defaultProps: { icon: '📝', label: '자동자막' },
    render: (props) => <ToolCard { ...props } />,
};
