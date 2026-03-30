'use client';

import { useState, useCallback, useRef } from 'react';
import { cn } from '@/lib/utils';
import {
  TRACK_ICONS,
  CONTROL_ICONS,
  TOOL_ICONS,
  NAV_ICONS,
  UI_ICONS,
} from '@/lib/icon-map';
import {
  BRAND,
  BG,
  TEXT,
  BORDER,
  TRACK_COLORS,
  Z,
  type TrackType,
} from '@/lib/design-tokens';

/* ─── Types ─── */
export interface Clip {
  id: string;
  name: string;
  startTime: number;
  duration: number;
  color?: string;
  type: TrackType;
}

export interface Track {
  id: string;
  name: string;
  type: TrackType;
  muted: boolean;
  solo: boolean;
  locked: boolean;
  height: number;
  clips: Clip[];
}

export interface TrackAreaProps {
  tracks?: Track[];
  currentTime?: number;
  totalDuration?: number;
  zoom?: number;
  snapEnabled?: boolean;
  onSeek?: (time: number) => void;
  onTrackAdd?: (type: TrackType) => void;
  onTrackUpdate?: (trackId: string, updates: Partial<Track>) => void;
  onClipMove?: (clipId: string, trackId: string, newStart: number) => void;
  onZoomChange?: (zoom: number) => void;
  className?: string;
}

/* ─── Sample Data ─── */
const DEFAULT_TRACKS: Track[] = [
  {
    id: 't-v1',
    name: 'Video 1',
    type: 'video',
    muted: false,
    solo: false,
    locked: false,
    height: 56,
    clips: [
      { id: 'c1', name: 'Intro', startTime: 0, duration: 8, type: 'video' },
      { id: 'c2', name: 'Interview A', startTime: 9, duration: 18, type: 'video' },
      { id: 'c3', name: 'B-Roll', startTime: 28, duration: 12, type: 'video' },
    ],
  },
  {
    id: 't-v2',
    name: 'Video 2',
    type: 'overlay',
    muted: false,
    solo: false,
    locked: false,
    height: 48,
    clips: [
      { id: 'c4', name: 'Logo', startTime: 2, duration: 5, type: 'overlay' },
      { id: 'c5', name: 'Lower Third', startTime: 20, duration: 8, type: 'overlay' },
    ],
  },
  {
    id: 't-a1',
    name: 'Voiceover',
    type: 'audio',
    muted: false,
    solo: false,
    locked: false,
    height: 52,
    clips: [
      { id: 'c6', name: 'VO Take 3', startTime: 0, duration: 38, type: 'audio' },
    ],
  },
  {
    id: 't-m1',
    name: 'BGM',
    type: 'music',
    muted: false,
    solo: false,
    locked: false,
    height: 48,
    clips: [
      { id: 'c7', name: 'Ambient Loop', startTime: 0, duration: 45, type: 'music' },
    ],
  },
  {
    id: 't-s1',
    name: 'Subtitles',
    type: 'subtitle',
    muted: false,
    solo: false,
    locked: false,
    height: 40,
    clips: [
      { id: 'c8', name: 'Hello everyone', startTime: 1, duration: 3, type: 'subtitle' },
      { id: 'c9', name: 'Today we will...', startTime: 10, duration: 4, type: 'subtitle' },
      { id: 'c10', name: 'Thank you!', startTime: 35, duration: 3, type: 'subtitle' },
    ],
  },
  {
    id: 't-fx',
    name: 'Effects',
    type: 'effect',
    muted: false,
    solo: false,
    locked: false,
    height: 40,
    clips: [
      { id: 'c11', name: 'Cross Dissolve', startTime: 8, duration: 2, type: 'effect' },
      { id: 'c12', name: 'Color Grade', startTime: 27, duration: 2, type: 'effect' },
    ],
  },
];

/* ─── Helper: format timecode ─── */
function fmt(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

/* ─── Helper: generate waveform bars ─── */
function Waveform({ width, color }: { width: number; color: string }) {
  const bars = Math.max(Math.floor(width / 3), 4);
  return (
    <div className="flex items-center gap-px h-full px-1 overflow-hidden">
      {Array.from({ length: bars }).map((_, i) => {
        const h = 20 + Math.sin(i * 0.7) * 30 + Math.cos(i * 1.3) * 20;
        return (
          <div
            key={i}
            className="shrink-0 rounded-full opacity-60"
            style={{
              width: '2px',
              height: `${Math.max(15, Math.min(85, h))}%`,
              backgroundColor: color,
            }}
          />
        );
      })}
    </div>
  );
}

/* ─── Sub: Minimap ─── */
function Minimap({
  tracks,
  totalDuration,
  viewStart,
  viewEnd,
  onViewDrag,
}: {
  tracks: Track[];
  totalDuration: number;
  viewStart: number;
  viewEnd: number;
  onViewDrag: (start: number) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const handlePointer = useCallback(
    (e: React.PointerEvent) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      const viewWidth = viewEnd - viewStart;
      const newStart = Math.max(0, Math.min(totalDuration - viewWidth, ratio * totalDuration - viewWidth / 2));
      onViewDrag(newStart);
    },
    [totalDuration, viewStart, viewEnd, onViewDrag]
  );

  return (
    <div
      ref={ref}
      className="relative w-full cursor-pointer select-none"
      style={{ height: '24px', backgroundColor: BG.base }}
      onPointerDown={(e) => {
        dragging.current = true;
        e.currentTarget.setPointerCapture(e.pointerId);
        handlePointer(e);
      }}
      onPointerMove={(e) => dragging.current && handlePointer(e)}
      onPointerUp={() => { dragging.current = false; }}
    >
      {tracks.map((track, ti) => {
        const y = (ti / Math.max(tracks.length, 1)) * 100;
        const h = Math.max(2, 100 / Math.max(tracks.length, 1) - 1);
        const colors = TRACK_COLORS[track.type] || TRACK_COLORS.video;
        return track.clips.map((clip) => {
          const left = (clip.startTime / totalDuration) * 100;
          const w = (clip.duration / totalDuration) * 100;
          return (
            <div
              key={clip.id}
              className="absolute rounded-sm"
              style={{
                left: `${left}%`,
                width: `${Math.max(w, 0.5)}%`,
                top: `${y}%`,
                height: `${h}%`,
                backgroundColor: colors.primary,
                opacity: 0.7,
              }}
            />
          );
        });
      })}
      <div
        className="absolute top-0 bottom-0 rounded-sm"
        style={{
          left: `${(viewStart / totalDuration) * 100}%`,
          width: `${((viewEnd - viewStart) / totalDuration) * 100}%`,
          backgroundColor: BRAND.primaryMuted,
          border: `1px solid ${BRAND.primary}`,
        }}
      />
    </div>
  );
}

/* ─── Sub: Time Ruler ─── */
function TimeRuler({
  viewStart,
  viewEnd,
  zoom,
  onSeek,
}: {
  viewStart: number;
  viewEnd: number;
  zoom: number;
  onSeek: (time: number) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const viewDuration = viewEnd - viewStart;
  const step = zoom < 0.5 ? 10 : zoom < 1 ? 5 : zoom < 2 ? 2 : 1;
  const firstMark = Math.ceil(viewStart / step) * step;
  const marks: number[] = [];
  for (let t = firstMark; t <= viewEnd; t += step) marks.push(t);

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const ratio = (e.clientX - rect.left) / rect.width;
      onSeek(viewStart + ratio * viewDuration);
    },
    [viewStart, viewDuration, onSeek]
  );

  return (
    <div
      ref={ref}
      className="relative w-full cursor-pointer select-none"
      style={{ height: '28px', backgroundColor: BG.base, borderBottom: `1px solid ${BORDER.default}` }}
      onClick={handleClick}
    >
      {marks.map((t) => {
        const left = ((t - viewStart) / viewDuration) * 100;
        return (
          <div key={t} className="absolute top-0 bottom-0 flex flex-col items-start" style={{ left: `${left}%` }}>
            <div className="w-px h-2" style={{ backgroundColor: BORDER.active }} />
            <span
              className="ml-1 select-none"
              style={{ fontSize: '10px', fontFamily: "'JetBrains Mono', monospace", color: TEXT.muted }}
            >
              {fmt(t)}
            </span>
          </div>
        );
      })}
    </div>
  );
}

/* ─── Sub: Track Header ─── */
function TrackHeader({
  track,
  onToggleMute,
  onToggleSolo,
  onToggleLock,
  onRename,
}: {
  track: Track;
  onToggleMute: () => void;
  onToggleSolo: () => void;
  onToggleLock: () => void;
  onRename: (name: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [localName, setLocalName] = useState(track.name);
  const colors = TRACK_COLORS[track.type] || TRACK_COLORS.video;
  const TypeIcon = TRACK_ICONS[track.type] || TRACK_ICONS.video;
  const MuteIcon = track.muted ? CONTROL_ICONS.mute : CONTROL_ICONS.unmute;
  const SoloIcon = CONTROL_ICONS.solo;
  const LockIcon = track.locked ? CONTROL_ICONS.lock : CONTROL_ICONS.unlock;
  const GripIcon = NAV_ICONS.grip;

  const commitRename = useCallback(() => {
    setEditing(false);
    if (localName.trim() && localName !== track.name) onRename(localName.trim());
    else setLocalName(track.name);
  }, [localName, track.name, onRename]);

  return (
    <div
      className="flex items-center gap-1.5 px-2 shrink-0 select-none"
      style={{
        width: '180px',
        minWidth: '180px',
        height: `${track.height}px`,
        backgroundColor: BG.elevated,
        borderRight: `1px solid ${BORDER.default}`,
        borderBottom: `1px solid ${BORDER.default}`,
      }}
    >
      <GripIcon className="w-3 h-3 cursor-grab" style={{ color: TEXT.disabled }} />
      <div
        className="w-5 h-5 rounded flex items-center justify-center shrink-0"
        style={{ backgroundColor: colors.bg, border: `1px solid ${colors.border}` }}
      >
        <TypeIcon className="w-3 h-3" style={{ color: colors.primary }} />
      </div>
      {editing ? (
        <input
          value={localName}
          onChange={(e) => setLocalName(e.target.value)}
          onBlur={commitRename}
          onKeyDown={(e) => e.key === 'Enter' && commitRename()}
          className="flex-1 min-w-0 bg-transparent outline-none px-1 rounded"
          style={{ fontSize: '11px', color: TEXT.primary, border: `1px solid ${BRAND.primary}` }}
          autoFocus
        />
      ) : (
        <span
          className="flex-1 min-w-0 truncate cursor-default"
          style={{ fontSize: '11px', color: TEXT.primary }}
          onDoubleClick={() => !track.locked && setEditing(true)}
        >
          {track.name}
        </span>
      )}
      <div className="flex items-center gap-0.5">
        <button
          onClick={onToggleMute}
          className="w-5 h-5 rounded flex items-center justify-center transition-colors"
          style={{ backgroundColor: track.muted ? BRAND.danger + '20' : 'transparent' }}
          aria-label={track.muted ? 'Unmute' : 'Mute'}
        >
          <MuteIcon className="w-3 h-3" style={{ color: track.muted ? BRAND.danger : TEXT.muted }} />
        </button>
        <button
          onClick={onToggleSolo}
          className="w-5 h-5 rounded flex items-center justify-center transition-colors"
          style={{ backgroundColor: track.solo ? BRAND.warning + '20' : 'transparent' }}
          aria-label={track.solo ? 'Unsolo' : 'Solo'}
        >
          <SoloIcon className="w-3 h-3" style={{ color: track.solo ? BRAND.warning : TEXT.muted }} />
        </button>
        <button
          onClick={onToggleLock}
          className="w-5 h-5 rounded flex items-center justify-center transition-colors"
          style={{ backgroundColor: track.locked ? BRAND.info + '20' : 'transparent' }}
          aria-label={track.locked ? 'Unlock' : 'Lock'}
        >
          <LockIcon className="w-3 h-3" style={{ color: track.locked ? BRAND.info : TEXT.muted }} />
        </button>
      </div>
    </div>
  );
}

/* ─── Sub: Clip Block ─── */
function ClipBlock({
  clip,
  trackType,
  trackHeight,
  viewStart,
  viewDuration,
}: {
  clip: Clip;
  trackType: TrackType;
  trackHeight: number;
  viewStart: number;
  viewDuration: number;
}) {
  const [hovered, setHovered] = useState(false);
  const colors = TRACK_COLORS[trackType] || TRACK_COLORS.video;
  const left = ((clip.startTime - viewStart) / viewDuration) * 100;
  const width = (clip.duration / viewDuration) * 100;
  const pxWidth = (clip.duration / viewDuration) * 800;

  if (left + width < 0 || left > 100) return null;

  return (
    <div
      className="absolute top-1 rounded-md overflow-hidden cursor-pointer transition-shadow"
      style={{
        left: `${left}%`,
        width: `${Math.max(width, 0.3)}%`,
        height: `${trackHeight - 8}px`,
        backgroundColor: colors.primary,
        boxShadow: hovered ? `0 0 12px ${colors.glow}` : '0 2px 4px rgba(0,0,0,0.3)',
        zIndex: Z.clip,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {(trackType === 'audio' || trackType === 'music') && (
        <Waveform width={pxWidth} color="rgba(255,255,255,0.5)" />
      )}
      {trackType === 'subtitle' && (
        <div className="flex items-center h-full px-2 overflow-hidden">
          <span
            className="truncate"
            style={{ fontSize: '10px', color: TEXT.inverse, fontWeight: 500 }}
          >
            {clip.name}
          </span>
        </div>
      )}
      {(trackType === 'video' || trackType === 'overlay') && (
        <div className="flex items-center h-full px-2 gap-1 overflow-hidden">
          <div
            className="shrink-0 rounded-sm"
            style={{
              width: `${Math.min(trackHeight - 14, 28)}px`,
              height: `${Math.min(trackHeight - 14, 20)}px`,
              backgroundColor: 'rgba(255,255,255,0.15)',
            }}
          />
          <span
            className="truncate"
            style={{ fontSize: '10px', color: TEXT.inverse, fontWeight: 500 }}
          >
            {clip.name}
          </span>
        </div>
      )}
      {trackType === 'effect' && (
        <div className="flex items-center justify-center h-full px-1 overflow-hidden">
          <span
            className="truncate"
            style={{ fontSize: '9px', color: TEXT.inverse, fontWeight: 500, letterSpacing: '0.02em' }}
          >
            {clip.name}
          </span>
        </div>
      )}
      {/* Resize handles */}
      <div
        className="absolute left-0 top-0 bottom-0 w-1 cursor-ew-resize hover:opacity-100 opacity-0 transition-opacity"
        style={{ backgroundColor: 'rgba(255,255,255,0.5)' }}
      />
      <div
        className="absolute right-0 top-0 bottom-0 w-1 cursor-ew-resize hover:opacity-100 opacity-0 transition-opacity"
        style={{ backgroundColor: 'rgba(255,255,255,0.5)' }}
      />
      {/* Tooltip on hover */}
      {hovered && (
        <div
          className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1 px-2 py-1 rounded whitespace-nowrap pointer-events-none"
          style={{
            backgroundColor: BG.overlay,
            border: `1px solid ${BORDER.active}`,
            zIndex: Z.dropdown,
          }}
        >
          <span style={{ fontSize: '10px', color: TEXT.primary, fontWeight: 500 }}>{clip.name}</span>
          <span style={{ fontSize: '9px', color: TEXT.muted, marginLeft: '6px' }}>
            {fmt(clip.startTime)} - {fmt(clip.startTime + clip.duration)}
          </span>
        </div>
      )}
    </div>
  );
}

/* ─── Sub: Playhead ─── */
function Playhead({
  currentTime,
  viewStart,
  viewDuration,
}: {
  currentTime: number;
  viewStart: number;
  viewDuration: number;
}) {
  const left = ((currentTime - viewStart) / viewDuration) * 100;
  if (left < -1 || left > 101) return null;

  return (
    <div
      className="absolute top-0 bottom-0 pointer-events-none"
      style={{ left: `${left}%`, zIndex: Z.playhead, width: '1px' }}
    >
      <div
        className="absolute -top-1 left-1/2 -translate-x-1/2"
        style={{
          width: 0,
          height: 0,
          borderLeft: '5px solid transparent',
          borderRight: '5px solid transparent',
          borderTop: `7px solid ${BRAND.danger}`,
        }}
      />
      <div className="w-px h-full" style={{ backgroundColor: BRAND.danger }} />
    </div>
  );
}

/* ─── Sub: Toolbar ─── */
function Toolbar({
  snapEnabled,
  zoom,
  onToggleSnap,
  onZoomChange,
  onAddTrack,
}: {
  snapEnabled: boolean;
  zoom: number;
  onToggleSnap: () => void;
  onZoomChange: (z: number) => void;
  onAddTrack: () => void;
}) {
  const AddIcon = UI_ICONS.add;
  const SnapIcon = TOOL_ICONS.snap;
  const ZoomInIcon = NAV_ICONS.zoomIn;
  const ZoomOutIcon = NAV_ICONS.zoomOut;

  return (
    <div
      className="flex items-center justify-between px-3 shrink-0"
      style={{
        height: '36px',
        backgroundColor: BG.elevated,
        borderTop: `1px solid ${BORDER.default}`,
      }}
    >
      <button
        onClick={onAddTrack}
        className="flex items-center gap-1.5 px-2 h-6 rounded transition-colors"
        style={{ backgroundColor: BG.clip, border: `1px solid ${BORDER.active}` }}
        aria-label="Add track"
      >
        <AddIcon className="w-3 h-3" style={{ color: TEXT.tertiary }} />
        <span style={{ fontSize: '10px', color: TEXT.tertiary }}>Add Track</span>
      </button>

      <button
        onClick={onToggleSnap}
        className="flex items-center gap-1.5 px-2 h-6 rounded transition-colors"
        style={{
          backgroundColor: snapEnabled ? BRAND.primaryMuted : 'transparent',
          border: `1px solid ${snapEnabled ? BRAND.primary + '40' : BORDER.active}`,
        }}
        aria-label={snapEnabled ? 'Disable snap' : 'Enable snap'}
      >
        <SnapIcon className="w-3 h-3" style={{ color: snapEnabled ? BRAND.primary : TEXT.muted }} />
        <span style={{ fontSize: '10px', color: snapEnabled ? BRAND.primary : TEXT.muted }}>Magnetic</span>
      </button>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onZoomChange(Math.max(0.1, zoom - 0.25))}
          className="w-5 h-5 rounded flex items-center justify-center"
          aria-label="Zoom out"
        >
          <ZoomOutIcon className="w-3.5 h-3.5" style={{ color: TEXT.muted }} />
        </button>
        <div className="relative w-20 h-1 rounded-full" style={{ backgroundColor: BORDER.active }}>
          <div
            className="absolute left-0 top-0 h-full rounded-full"
            style={{
              width: `${((zoom - 0.1) / 4.9) * 100}%`,
              backgroundColor: BRAND.primary,
            }}
          />
          <input
            type="range"
            min={10}
            max={500}
            value={zoom * 100}
            onChange={(e) => onZoomChange(Number(e.target.value) / 100)}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            aria-label="Zoom level"
          />
        </div>
        <button
          onClick={() => onZoomChange(Math.min(5, zoom + 0.25))}
          className="w-5 h-5 rounded flex items-center justify-center"
          aria-label="Zoom in"
        >
          <ZoomInIcon className="w-3.5 h-3.5" style={{ color: TEXT.muted }} />
        </button>
        <span
          className="min-w-[36px] text-right tabular-nums"
          style={{ fontSize: '10px', fontFamily: "'JetBrains Mono', monospace", color: TEXT.muted }}
        >
          {Math.round(zoom * 100)}%
        </span>
      </div>
    </div>
  );
}

/* ─── Main: TrackArea ─── */
export function TrackArea({
  tracks: propTracks,
  currentTime = 12,
  totalDuration = 60,
  zoom: propZoom = 1.0,
  snapEnabled: propSnap = true,
  onSeek,
  onTrackAdd,
  onTrackUpdate,
  onClipMove,
  onZoomChange,
  className,
}: TrackAreaProps) {
  const [localTracks, setLocalTracks] = useState<Track[]>(propTracks || DEFAULT_TRACKS);
  const [localZoom, setLocalZoom] = useState(propZoom);
  const [localSnap, setLocalSnap] = useState(propSnap);
  const [scrollLeft, setScrollLeft] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);

  const tracks = propTracks || localTracks;
  const zoom = propZoom !== 1.0 ? propZoom : localZoom;

  const viewDuration = totalDuration / zoom;
  const viewStart = (scrollLeft / 1000) * totalDuration;
  const viewEnd = Math.min(viewStart + viewDuration, totalDuration);

  const handleSeek = useCallback(
    (time: number) => {
      onSeek?.(Math.max(0, Math.min(totalDuration, time)));
    },
    [onSeek, totalDuration]
  );

  const handleZoom = useCallback(
    (z: number) => {
      const clamped = Math.max(0.1, Math.min(5, z));
      setLocalZoom(clamped);
      onZoomChange?.(clamped);
    },
    [onZoomChange]
  );

  const handleToggleTrack = useCallback(
    (trackId: string, field: 'muted' | 'solo' | 'locked') => {
      setLocalTracks((prev) =>
        prev.map((t) => (t.id === trackId ? { ...t, [field]: !t[field] } : t))
      );
      const track = tracks.find((t) => t.id === trackId);
      if (track) onTrackUpdate?.(trackId, { [field]: !track[field] });
    },
    [tracks, onTrackUpdate]
  );

  const handleRenameTrack = useCallback(
    (trackId: string, name: string) => {
      setLocalTracks((prev) =>
        prev.map((t) => (t.id === trackId ? { ...t, name } : t))
      );
      onTrackUpdate?.(trackId, { name });
    },
    [onTrackUpdate]
  );

  const handleAddTrack = useCallback(() => {
    const newTrack: Track = {
      id: `t-${Date.now()}`,
      name: `Track ${tracks.length + 1}`,
      type: 'video',
      muted: false,
      solo: false,
      locked: false,
      height: 48,
      clips: [],
    };
    setLocalTracks((prev) => [...prev, newTrack]);
    onTrackAdd?.('video');
  }, [tracks.length, onTrackAdd]);

  const handleViewDrag = useCallback(
    (newStart: number) => {
      const ratio = newStart / totalDuration;
      setScrollLeft(ratio * 1000);
    },
    [totalDuration]
  );

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const maxScroll = el.scrollWidth - el.clientWidth;
    if (maxScroll > 0) {
      setScrollLeft((el.scrollLeft / maxScroll) * 1000);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const files = e.dataTransfer.files;
      if (files.length === 0) return;
      const file = files[0];
      const ext = file.name.split('.').pop()?.toLowerCase() || '';
      let type: TrackType = 'video';
      if (['mp3', 'wav', 'ogg', 'aac', 'flac'].includes(ext)) type = 'audio';
      else if (['srt', 'vtt', 'ass', 'txt'].includes(ext)) type = 'subtitle';
      else if (['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg'].includes(ext)) type = 'overlay';
      else if (['mp4', 'mov', 'avi', 'webm', 'mkv'].includes(ext)) type = 'video';

      const newTrack: Track = {
        id: `t-${Date.now()}`,
        name: file.name.replace(/\.[^.]+$/, ''),
        type,
        muted: false,
        solo: false,
        locked: false,
        height: 48,
        clips: [
          {
            id: `c-${Date.now()}`,
            name: file.name.replace(/\.[^.]+$/, ''),
            startTime: 0,
            duration: 10,
            type,
          },
        ],
      };
      setLocalTracks((prev) => [...prev, newTrack]);
      onTrackAdd?.(type);
    },
    [onTrackAdd]
  );

  return (
    <div
      className={cn('w-full h-full flex flex-col', className)}
      style={{ backgroundColor: BG.surface }}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      {/* Minimap */}
      <Minimap
        tracks={tracks}
        totalDuration={totalDuration}
        viewStart={viewStart}
        viewEnd={viewEnd}
        onViewDrag={handleViewDrag}
      />

      {/* Ruler row */}
      <div className="flex shrink-0">
        <div
          className="shrink-0"
          style={{
            width: '180px',
            minWidth: '180px',
            height: '28px',
            backgroundColor: BG.elevated,
            borderRight: `1px solid ${BORDER.default}`,
            borderBottom: `1px solid ${BORDER.default}`,
          }}
        />
        <div className="flex-1 overflow-hidden">
          <TimeRuler viewStart={viewStart} viewEnd={viewEnd} zoom={zoom} onSeek={handleSeek} />
        </div>
      </div>

      {/* Tracks */}
      <div className="flex-1 flex overflow-hidden">
        <div className="flex flex-col shrink-0 overflow-y-auto" style={{ width: '180px' }}>
          {tracks.map((track) => (
            <TrackHeader
              key={track.id}
              track={track}
              onToggleMute={() => handleToggleTrack(track.id, 'muted')}
              onToggleSolo={() => handleToggleTrack(track.id, 'solo')}
              onToggleLock={() => handleToggleTrack(track.id, 'locked')}
              onRename={(name) => handleRenameTrack(track.id, name)}
            />
          ))}
        </div>

        <div
          ref={contentRef}
          className="flex-1 overflow-auto relative"
          onScroll={handleScroll}
        >
          <div style={{ width: `${zoom * 100}%`, minWidth: '100%' }}>
            {tracks.map((track) => (
              <div
                key={track.id}
                className="relative"
                style={{
                  height: `${track.height}px`,
                  backgroundColor: BG.track,
                  borderBottom: `1px solid ${BORDER.default}`,
                }}
              >
                {track.clips.map((clip) => (
                  <ClipBlock
                    key={clip.id}
                    clip={clip}
                    trackType={track.type}
                    trackHeight={track.height}
                    viewStart={viewStart}
                    viewDuration={viewEnd - viewStart}
                  />
                ))}
              </div>
            ))}
          </div>

          <div className="absolute top-0 bottom-0 left-0 right-0 pointer-events-none">
            <Playhead currentTime={currentTime} viewStart={viewStart} viewDuration={viewEnd - viewStart} />
          </div>
        </div>
      </div>

      {/* Bottom toolbar */}
      <Toolbar
        snapEnabled={localSnap}
        zoom={zoom}
        onToggleSnap={() => setLocalSnap((p) => !p)}
        onZoomChange={handleZoom}
        onAddTrack={handleAddTrack}
      />
    </div>
  );
}
