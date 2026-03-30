'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { RefreshCw, Monitor, Tablet, Smartphone, ExternalLink, Maximize2, Minimize2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useStudioStore, useSelectedNode } from '@/lib/studio-store';
import { cn } from '@/lib/utils';
import {
  HomeDashboardPreview,
  TimelinePreview,
  VideoPreviewPreview,
  EmptyStatePreview,
} from './screen-previews';

// 컴포넌트 이름 → preview route slug 매핑
const PREVIEW_ROUTE_MAP: Record<string, string> = {
  TransportBar: 'transport-bar',
};

function DeviceButton({
  device,
  currentDevice,
  onClick,
  isActive,
}: {
  device: 'desktop' | 'tablet' | 'mobile';
  currentDevice: string;
  onClick: () => void;
  isActive: boolean;
}) {
  const Icon =
    device === 'desktop' ? Monitor : device === 'tablet' ? Tablet : Smartphone;

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
      <Icon
        className={cn(
          'w-4 h-4 transition-smooth',
          isActive ? 'text-[#6c63ff]' : 'text-[#505070]'
        )}
      />
    </button>
  );
}

function ComponentInfoCard() {
  const selectedNode = useSelectedNode();
  if (!selectedNode) return null;

  const filePath =
    selectedNode.filePath ||
    `components/${selectedNode.name.toLowerCase().replace(/\s+/g, '-')}.tsx`;
  const fileSize = selectedNode.fileSize
    ? `${(selectedNode.fileSize / 1024).toFixed(1)} KB`
    : '—';
  const modified = selectedNode.lastModified
    ? new Date(selectedNode.lastModified).toLocaleDateString()
    : '—';
  const version = selectedNode.versionCount || 1;

  return (
    <div className="mx-3 mb-3 p-4 rounded-lg bg-[#0c0c20] border border-[rgba(255,255,255,0.06)]">
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-[11px] text-[#505070]">File Path</span>
          <span className="text-[12px] font-mono text-[#b0b0c8] truncate max-w-[180px]">
            {filePath}
          </span>
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
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(version, 10) }).map((_, i) => (
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

// 기존 mock preview (iframe 미등록 컴포넌트용 폴백)
function getMockPreview(nodeName: string, status: string) {
  const lower = nodeName.toLowerCase();
  if (status === 'empty' || status === 'prompt') return <EmptyStatePreview />;
  if (lower.includes('home') || lower.includes('dashboard'))
    return <HomeDashboardPreview />;
  if (
    lower.includes('timeline') ||
    lower.includes('track')
  )
    return <TimelinePreview />;
  if (
    lower.includes('preview') ||
    lower.includes('player') ||
    lower.includes('video')
  )
    return <VideoPreviewPreview />;
  if (status === 'done' || status === 'progress')
    return <HomeDashboardPreview />;
  return <EmptyStatePreview />;
}

export function RightPanel() {
  const { previewDevice, setPreviewDevice } = useStudioStore();
  const selectedNode = useSelectedNode();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // 선택된 노드에 대한 preview route slug 확인
  const previewSlug = selectedNode
    ? PREVIEW_ROUTE_MAP[selectedNode.name]
    : null;

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    setRefreshKey((k) => k + 1);
    setTimeout(() => setIsRefreshing(false), 600);
  }, []);

  const handleOpenExternal = useCallback(() => {
    if (previewSlug) {
      window.open(`/preview/${previewSlug}`, '_blank');
    }
  }, [previewSlug]);

  // 디바이스별 iframe 크기
  const deviceSize =
    previewDevice === 'desktop'
      ? { width: '100%', maxWidth: '100%' }
      : previewDevice === 'tablet'
        ? { width: '768px', maxWidth: '768px' }
        : { width: '375px', maxWidth: '375px' };

  return (
    <div className="w-full h-full flex flex-col bg-[#0a0a1c] panel-depth">
      {/* Header */}
      <div className="flex items-center justify-between px-4 h-11 border-b border-[#1a1a30]">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-semibold uppercase tracking-widest text-[#505070]">
            Preview
          </span>
          {previewSlug && (
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#6c63ff]/20 text-[#6c63ff] font-medium">
              LIVE
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            className="w-6 h-6 rounded flex items-center justify-center hover:bg-white/[0.05] transition-smooth"
            title="Refresh preview"
          >
            <RefreshCw
              className={cn(
                'w-4 h-4 text-[#505070] transition-transform',
                isRefreshing && 'animate-spin'
              )}
            />
          </button>
          {previewSlug && (
            <button
              onClick={handleOpenExternal}
              className="w-6 h-6 rounded flex items-center justify-center hover:bg-white/[0.05] transition-smooth"
              title="Open in new tab"
            >
              <ExternalLink className="w-4 h-4 text-[#505070]" />
            </button>
          )}
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
        <div className="m-3 rounded-lg bg-black overflow-hidden">
          {selectedNode ? (
            previewSlug ? (
              /* ── iframe 라이브 프리뷰 ── */
              <div
                className="w-full flex justify-center"
                style={{ minHeight: '300px' }}
              >
                <iframe
                  ref={iframeRef}
                  key={`${previewSlug}-${refreshKey}`}
                  src={`/preview/${previewSlug}?t=${refreshKey}`}
                  className="border-0 rounded-lg"
                  style={{
                    width: deviceSize.width,
                    maxWidth: deviceSize.maxWidth,
                    height: '500px',
                    background: '#0a0a1a',
                  }}
                  title={`Preview: ${selectedNode.name}`}
                />
              </div>
            ) : (
              /* ── mock 프리뷰 폴백 ── */
              <div
                className="relative"
                style={{ aspectRatio: '16/10' }}
              >
                <div
                  className="absolute inset-0 origin-top-left overflow-hidden"
                  style={{
                    transform: 'scale(0.5)',
                    width: '200%',
                    height: '200%',
                  }}
                >
                  {getMockPreview(selectedNode.name, selectedNode.status)}
                </div>
              </div>
            )
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
