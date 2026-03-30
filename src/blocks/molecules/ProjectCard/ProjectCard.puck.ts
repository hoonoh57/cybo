import { ComponentConfig } from '@measured/puck';
import { ProjectCard, ProjectCardProps } from './ProjectCard';

export const ProjectCardPuck: ComponentConfig<ProjectCardProps> = {
    fields: {
        name: { type: 'text' },
        date: { type: 'text' },
        progress: { type: 'number', min: 0, max: 100 },
        thumbnail: { type: 'text' },
        duration: { type: 'text' },
    },
    defaultProps: {
        name: '프로젝트 이름',
        date: '2026.03.30',
        progress: 50,
        thumbnail: 'https://picsum.photos/seed/default/400/200',
        duration: '03:24',
    },
    render: (props) => <ProjectCard { ...props } />,
};
