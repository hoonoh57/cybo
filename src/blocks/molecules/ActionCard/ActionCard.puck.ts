import { ComponentConfig } from '@measured/puck';
import { ActionCard, ActionCardProps } from './ActionCard';

export const ActionCardPuck: ComponentConfig<ActionCardProps> = {
    fields: {
        icon: { type: 'text' },
        title: { type: 'text' },
        subtitle: { type: 'text' },
        variant: {
            type: 'select',
            options: [
                { label: 'Gradient', value: 'gradient' },
                { label: 'Surface', value: 'surface' },
            ],
        },
    },
    defaultProps: {
        icon: '✨',
        title: 'AI가 만들어줘요',
        subtitle: '아이디어만 말해주세요',
        variant: 'gradient',
    },
    render: (props) => <ActionCard { ...props } />,
};
