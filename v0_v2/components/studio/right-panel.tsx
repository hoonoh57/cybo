'use client';

import { useState } from 'react';
import { RefreshCw, Monitor, Tablet, Smartphone } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useStudioStore, useSelectedNode } from '@/lib/studio-store';
import { cn } from '@/lib/utils';
import { 
  HomeDashboardPreview, 
  TimelinePreview, 
  VideoPreviewPreview, 
  EmptyStatePreview 
} from './screen-previews';

function DeviceButton({ 
  device, 
  currentDevice, 
  onClick,
  isActive
}: { 
  device: 'desktop' | 'tablet' | 'mobile';
  currentDevice: string;
  onClick: () => void;
  isActive: boolean;
}) {
  const Icon = device === 'desktop' ? Monitor : device === 'tablet' ? Tablet : Smartphone;
  
  return (
    <button
      onClick={onClick}
      className={cn(
        'w-6 h-6 rounded flex items-center justify-center transition-smooth',
        isActive 
          ? 'bg-[rgba(108,99,255,0.15)]' 
          : 'hover:bg-white/[0.05]'
      )}
    >
      <Icon className={cn(
        'w-4 h-4 transition-smooth',
        isActive ? 'text-[#6c63ff]' : 'text-[#505070]'
      )} />
    </button>
  );
}

function ComponentInfoCard() {
  const selectedNode = useSelectedNode();
  
  if (!selectedNode) return null;
  
  const filePath = selectedNode.filePath || `components/${selectedNode.name.toLowerCase().replace(/\s+/g, '-')}.tsx`;
  const fileSize = selectedNode.fileSize ? `${(selectedNode.fileSize / 1024).toFixed(1)} KB` : '12.4 KB';
  const modified = selectedNode.lastModified 
    ? new Date(selectedNode.lastModified).toLocaleDateString() 
    : '2 min ago';
  const version = selectedNode.versionCount || 3;
  
  return (
    <div className="mx-3 mb-3 p-4 rounded-lg bg-[#0c0c20] border border-[rgba(255,255,255,0.06)]">
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-[11px] text-[#505070]">File Path</span>
          <span className="text-[12px] font-mono text-[#b0b0c8]">{filePath}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-[11px] text-[#505070]">Size</span>
          <span className="text-[12px] text-[#b0b0c8]">{fileSize}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-[11px] text-[#505070]">Modified</span>
          <span className="text-[12px] text-[#b0b0c8]">{modified}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-[11px] text-[#505070]">Version</span>
          <div className="flex items-center gap-2">
            <span className="text-[12px] text-[#b0b0c8]">v{version}</span>
            {/* Version dots timeline */}
            <div className="flex items-center gap-1">
              {Array.from({ length: version }).map((_, i) => (
                <div 
                  key={i} 
                  className={cn(
                    'w-1.5 h-1.5 rounded-full',
                    i === version - 1 ? 'bg-[#6c63ff]' : 'bg-[#333350]'
                  )}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Determine which preview to show based on node name
function getPreviewComponent(nodeName: string, status: string) {
  const lowerName = nodeName.toLowerCase();
  
  // If empty or prompt status, show empty state
  if (status === 'empty' || status === 'prompt') {
    return <EmptyStatePreview />;
  }
  
  // Match by name
  if (lowerName.includes('home') || lowerName.includes('dashboard')) {
    return <HomeDashboardPreview />;
  }
  if (lowerName.includes('timeline') || lowerName.includes('transport') || lowerName.includes('track')) {
    return <TimelinePreview />;
  }
  if (lowerName.includes('preview') || lowerName.includes('player') || lowerName.includes('video')) {
    return <VideoPreviewPreview />;
  }
  
  // Default to dashboard for done/progress status
  if (status === 'done' || status === 'progress') {
    return <HomeDashboardPreview />;
  }
  
  return <EmptyStatePreview />;
}

export function RightPanel() {
  const { previewDevice, setPreviewDevice } = useStudioStore();
  const selectedNode = useSelectedNode();
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 500);
  };
  
  return (
    <div className="w-full h-full flex flex-col bg-[#0a0a1c] panel-depth">
      {/* Header */}
      <div className="flex items-center justify-between px-4 h-11 border-b border-[#1a1a30]">
        <span className="text-[11px] font-semibold uppercase tracking-widest text-[#505070]">
          Preview
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            className="w-6 h-6 rounded flex items-center justify-center hover:bg-white/[0.05] transition-smooth"
          >
            <RefreshCw className={cn(
              'w-4 h-4 text-[#505070] transition-transform',
              isRefreshing && 'animate-spin'
            )} />
          </button>
          <div className="flex items-center gap-1 ml-1">
            {(['desktop', 'tablet', 'mobile'] as const).map((device) => (
              <DeviceButton
                key={device}
                device={device}
                currentDevice={previewDevice}
                onClick={() => setPreviewDevice(device)}
                isActive={previewDevice === device}
              />
            ))}
          </div>
        </div>
      </div>
      
      {/* Preview Area */}
      <ScrollArea className="flex-1">
        {/* Preview container */}
        <div className="m-3 rounded-lg bg-black overflow-hidden">
          {selectedNode ? (
            <div className="relative" style={{ aspectRatio: '16/10' }}>
              {/* Scaled preview container */}
              <div 
                className="absolute inset-0 origin-top-left overflow-hidden"
                style={{ 
                  transform: 'scale(0.5)',
                  width: '200%',
                  height: '200%'
                }}
              >
                {getPreviewComponent(selectedNode.name, selectedNode.status)}
              </div>
            </div>
          ) : (
            <div className="h-[220px] flex items-center justify-center text-[12px] text-[#505070]">
              Select a screen to preview
            </div>
          )}
        </div>
        
        {/* Component Info */}
        {selectedNode && <ComponentInfoCard />}
      </ScrollArea>
    </div>
  );
}
