import { ComponentConfig } from '@measured/puck';
import { TemplateCard, TemplateCardProps } from './TemplateCard';

export const TemplateCardPuck: ComponentConfig<TemplateCardProps> = {
    fields: {
        icon: { type: 'text' },
        label: { type: 'text' },
        accentColor: { type: 'text' },
    },
    defaultProps: {
        icon: '📱',
        label: '인스타 릴스',
        accentColor: '#E1306C',
    },
    render: (props) => <TemplateCard { ...props } />,
};
