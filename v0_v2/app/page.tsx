'use client';

import { useRef, useCallback } from 'react';
import {
  DockviewReact,
  DockviewReadyEvent,
  IDockviewPanelProps,
} from 'dockview-react';
import 'dockview-core/dist/styles/dockview.css';
import { LeftPanel } from '@/components/studio/left-panel';
import { CenterPanel } from '@/components/studio/center-panel';
import { RightPanel } from '@/components/studio/right-panel';
import { StatusBar } from '@/components/studio/status-bar';
import { StructureDialog } from '@/components/studio/structure-dialog';

function ExplorerPanel(props: IDockviewPanelProps) {
  return (
    <div className="h-full overflow-hidden bg-[#0c0c1e]">
      <LeftPanel />
    </div>
  );
}

function EditorPanel(props: IDockviewPanelProps) {
  return (
    <div className="h-full overflow-hidden bg-[#0a0a1a]">
      <CenterPanel />
    </div>
  );
}

function PreviewPanel(props: IDockviewPanelProps) {
  return (
    <div className="h-full overflow-hidden bg-[#0a0a1c]">
      <RightPanel />
    </div>
  );
}

const components: Record<string, React.FC<IDockviewPanelProps>> = {
  explorer: ExplorerPanel,
  editor: EditorPanel,
  preview: PreviewPanel,
};

export default function StudioPage() {
  const apiRef = useRef<DockviewReadyEvent['api'] | null>(null);

  const onReady = useCallback((event: DockviewReadyEvent) => {
    const api = event.api;
    apiRef.current = api;

    // Left: Explorer
    api.addPanel({
      id: 'explorer',
      component: 'explorer',
      title: 'Explorer',
      position: {
        direction: 'left',
      },
    });

    // Center: Code Editor
    api.addPanel({
      id: 'editor',
      component: 'editor',
      title: 'Code Editor',
    });

    // Right: Preview
    api.addPanel({
      id: 'preview',
      component: 'preview',
      title: 'Preview',
      position: {
        direction: 'right',
        referencePanel: 'editor',
      },
    });

    // Set initial sizes
    const explorerGroup = api.getPanel('explorer')?.group;
    const editorGroup = api.getPanel('editor')?.group;
    const previewGroup = api.getPanel('preview')?.group;

    if (explorerGroup) {
      api.getGroup(explorerGroup.id)?.api.setSize({ width: 260 });
    }
    if (previewGroup) {
      api.getGroup(previewGroup.id)?.api.setSize({ width: 420 });
    }
  }, []);

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-[#08081a]">
      <div className="flex-1 overflow-hidden">
        <DockviewReact
          className="dockview-theme-dark"
          onReady={onReady}
          components={components}
          watermarkComponent={() => null}
        />
      </div>
      <StatusBar />
      <StructureDialog />
    </div>
  );
}
