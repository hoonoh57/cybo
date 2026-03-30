import React from 'react';
import styles from './HomeDashboard.module.css';
import { TopBar } from '../../organisms/TopBar/TopBar';
import { SecurityBadge } from '../../atoms/SecurityBadge/SecurityBadge';
import { ActionCard } from '../../molecules/ActionCard/ActionCard';
import { ToolCard } from '../../molecules/ToolCard/ToolCard';
import { SectionTitle } from '../../atoms/SectionTitle/SectionTitle';
import { ProjectCard } from '../../molecules/ProjectCard/ProjectCard';
import { TemplateCard } from '../../molecules/TemplateCard/TemplateCard';

const TOOLS = [
  { icon: '📝', label: '자동자막' },
  { icon: '🗣', label: '음성합성' },
  { icon: '🔇', label: '무음제거' },
  { icon: '🎵', label: 'AI음악' },
  { icon: '🖼', label: '배경제거' },
];

const PROJECTS = [
  { id: 1, name: '여행 브이로그 EP.12', date: '2026.03.28', progress: 75, thumbnail: 'https://picsum.photos/seed/travel/400/200' },
  { id: 2, name: '쿠킹 클래스 #5', date: '2026.03.27', progress: 100, thumbnail: 'https://picsum.photos/seed/cooking/400/200' },
  { id: 3, name: '서울 야경 시네마틱', date: '2026.03.25', progress: 40, thumbnail: 'https://picsum.photos/seed/city/400/200' },
];

const TEMPLATES = [
  { icon: '📱', label: '인스타 릴스', color: '#E1306C' },
  { icon: '🎬', label: '유튜브 쇼츠', color: '#FF0000' },
  { icon: '📦', label: '제품 리뷰', color: '#FF9800' },
  { icon: '📚', label: '교육', color: '#4CAF50' },
];

export interface HomeDashboardProps {
  children?: React.ReactNode;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = () => {
  return (
    <div className={styles.root}>
      <TopBar />
      <main className={styles.main}>
        <SecurityBadge />

        {/* Main Action Cards */}
        <div className={styles.actionGrid}>
          <ActionCard
            icon="✨"
            title="AI가 만들어줘요"
            subtitle="아이디어만 말해주세요"
            variant="gradient"
          />
          <ActionCard
            icon="🎬"
            title="직접 편집할게요"
            subtitle="내 영상을 자유롭게"
            variant="surface"
          />
        </div>

        {/* Tool Grid */}
        <section className={styles.section}>
          <div className={styles.toolGrid}>
            {TOOLS.map((t) => (
              <ToolCard key={t.label} icon={t.icon} label={t.label} />
            ))}
          </div>
        </section>

        {/* Recent Projects */}
        <section className={styles.section}>
          <SectionTitle title="최근 프로젝트" />
          <div className={styles.projectGrid}>
            {PROJECTS.map((p) => (
              <ProjectCard
                key={p.id}
                name={p.name}
                date={p.date}
                progress={p.progress}
                thumbnail={p.thumbnail}
              />
            ))}
          </div>
        </section>

        {/* Templates */}
        <section className={styles.section}>
          <SectionTitle title="템플릿" />
          <div className={styles.templateGrid}>
            {TEMPLATES.map((t) => (
              <TemplateCard
                key={t.label}
                icon={t.icon}
                label={t.label}
                accentColor={t.color}
              />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};
