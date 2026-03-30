'use client';

import { useCallback, useRef, useEffect } from 'react';
import {
  DockviewReact,
  type DockviewReadyEvent,
  type IDockviewPanelProps,
} from 'dockview-react';
import 'dockview-core/dist/styles/dockview.css';
import { LeftPanel } from '@/components/studio/left-panel';
import { CenterPanel } from '@/components/studio/center-panel';
import { RightPanel } from '@/components/studio/right-panel';
import { StatusBar } from '@/components/studio/status-bar';
import { StructureDialog } from '@/components/studio/structure-dialog';
import { AiPanel } from '@/components/studio/ai-panel';

function ExplorerPanel(props: IDockviewPanelProps) {
  return <LeftPanel />;
}

function EditorPanel(props: IDockviewPanelProps) {
  return <CenterPanel />;
}

function PreviewPanel(props: IDockviewPanelProps) {
  return <RightPanel />;
}

function AiAgentPanel(props: IDockviewPanelProps) {
  return <AiPanel />;
}

const components: Record<string, React.FC<IDockviewPanelProps>> = {
  explorer: ExplorerPanel,
  editor: EditorPanel,
  preview: PreviewPanel,
  ai: AiAgentPanel,
};

export default function StudioPage() {
  const apiRef = useRef<any>(null);

  const onReady = useCallback((event: DockviewReadyEvent) => {
    apiRef.current = event.api;

    const explorerPanel = event.api.addPanel({
      id: 'explorer',
      component: 'explorer',
      title: 'Explorer',
    });

    const editorPanel = event.api.addPanel({
      id: 'editor',
      component: 'editor',
      title: 'Code Editor',
      position: { referencePanel: explorerPanel, direction: 'right' },
    });

    const previewPanel = event.api.addPanel({
      id: 'preview',
      component: 'preview',
      title: 'Preview',
      position: { referencePanel: editorPanel, direction: 'right' },
    });

    const aiPanel = event.api.addPanel({
      id: 'ai',
      component: 'ai',
      title: 'AI Agent',
      position: { referencePanel: previewPanel, direction: 'right' },
    });

    // 비율 설정: Explorer 15%, Editor 40%, Preview 25%, AI 20%
    event.api.getGroup(explorerPanel.group)?.api.setSize({ width: window.innerWidth * 0.15 });
    event.api.getGroup(aiPanel.group)?.api.setSize({ width: window.innerWidth * 0.20 });
    event.api.getGroup(previewPanel.group)?.api.setSize({ width: window.innerWidth * 0.25 });
  }, []);

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-[#08081a]">
      <div className="flex-1 overflow-hidden">
        <DockviewReact
          className="dockview-theme-dark"
          onReady={onReady}
          components={components}
        />
      </div>
      <StatusBar />
      <StructureDialog />
    </div>
  );
}
