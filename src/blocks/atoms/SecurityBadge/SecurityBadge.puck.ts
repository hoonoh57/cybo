import { ComponentConfig } from '@measured/puck';
import { SecurityBadge, SecurityBadgeProps } from './SecurityBadge';

export const SecurityBadgePuck: ComponentConfig<SecurityBadgeProps> = {
    fields: {
        label: { type: 'text' },
    },
    defaultProps: {
        label: '🔒 100% Local Processing - No Cloud',
    },
    render: (props) => <SecurityBadge { ...props } />,
};
