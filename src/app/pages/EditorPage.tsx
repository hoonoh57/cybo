import React from 'react';
import { EditorShell } from '../../blocks/templates/EditorShell/EditorShell';
import { TopBar } from '../../blocks/organisms/TopBar/TopBar';
import { LeftPanel } from '../../blocks/organisms/LeftPanel/LeftPanel';
import { PreviewArea } from '../../blocks/organisms/PreviewArea/PreviewArea';
import { Timeline } from '../../blocks/organisms/Timeline/Timeline';
import { StatusBar } from '../../blocks/organisms/StatusBar/StatusBar';

export const EditorPage: React.FC = () => {
  return (
    <EditorShell>
      <div style={{ display: 'grid', gridTemplateRows: 'auto 1fr auto', height: '100vh' }}>
        <TopBar />
        <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto', flexGrow: 1, overflow: 'hidden' }}>
          <LeftPanel />
          <PreviewArea />
          {/* RightPanel placeholder */}
          <div style={{ width: '240px', background: 'var(--color-bg-surface)' }}>Right Panel</div>
        </div>
        <div>
          <Timeline />
          <StatusBar />
        </div>
      </div>
    </EditorShell>
  );
};
