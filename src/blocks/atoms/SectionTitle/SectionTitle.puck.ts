import { ComponentConfig } from '@measured/puck';
import { SectionTitle, SectionTitleProps } from './SectionTitle';

export const SectionTitlePuck: ComponentConfig<SectionTitleProps> = {
    fields: {
        title: { type: 'text' },
        actionLabel: { type: 'text' },
    },
    defaultProps: {
        title: '섹션 제목',
        actionLabel: '모두 보기 →',
    },
    render: (props) => <SectionTitle { ...props } />,
};
