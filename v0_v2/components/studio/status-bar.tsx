'use client';

import { useProjectStats } from '@/lib/studio-store';

export function StatusBar() {
  const stats = useProjectStats();
  
  return (
    <div className="h-7 flex items-center justify-between px-4 bg-[#08081a] border-t border-[#1a1a30]">
      <div className="flex items-center gap-1 text-[11px] text-[#505070]">
        <span>{stats.total} screens</span>
        <span className="text-[#303050]">{'·'}</span>
        <span>{stats.done} completed</span>
        <span className="text-[#303050]">{'·'}</span>
        <span>{stats.progress} in progress</span>
      </div>
      <div className="flex items-center gap-2 text-[11px] text-[#505070]">
        <span className="w-1.5 h-1.5 rounded-full bg-[#00c853] status-glow-done" />
        <span>Saved</span>
      </div>
    </div>
  );
}
