'use client';

import { LeftPanel } from '@/components/studio/left-panel';
import { CenterPanel } from '@/components/studio/center-panel';
import { RightPanel } from '@/components/studio/right-panel';
import { StatusBar } from '@/components/studio/status-bar';
import { StructureDialog } from '@/components/studio/structure-dialog';

export default function StudioPage() {
  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-[#08081a]">
      {/* Main Panels */}
      <div className="flex-1 flex overflow-hidden">
        <LeftPanel />
        <CenterPanel />
        <RightPanel />
      </div>
      
      {/* Status Bar */}
      <StatusBar />
      
      {/* Dialogs */}
      <StructureDialog />
    </div>
  );
}
