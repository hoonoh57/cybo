$utf8 = New-Object System.Text.UTF8Encoding $false
function WF($path,$content){
  $dir = Split-Path $path -Parent
  if(!(Test-Path $dir)){ New-Item -ItemType Directory -Force -Path $dir | Out-Null }
  [System.IO.File]::WriteAllText($path,$content,$utf8)
  Write-Host "OK: $path" -ForegroundColor Green
}

# ============================================================
# 1. organisms/TransportBar
# ============================================================
WF "src\blocks\organisms\TransportBar\TransportBar.tsx" @'
import React, { useState } from 'react';
import styles from './TransportBar.module.css';

export interface TransportBarProps {
  currentTime: number;
  totalDuration: number;
  isPlaying: boolean;
  speed: string;
  onTogglePlay: () => void;
  onSpeedChange: (speed: string) => void;
}

const speedOptions = ['0.25x','0.5x','0.75x','1.0x','1.25x','1.5x','2.0x'];

function formatTimecode(seconds: number): string {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  const frames = Math.floor((seconds % 1) * 30);
  return `${hrs.toString().padStart(2,'0')}:${mins.toString().padStart(2,'0')}:${secs.toString().padStart(2,'0')}:${frames.toString().padStart(2,'0')}`;
}

export const TransportBar: React.FC<TransportBarProps> = ({ currentTime, totalDuration, isPlaying, speed, onTogglePlay, onSpeedChange }) => {
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <div className={styles.root}>
      <span className={styles.timecode}>{formatTimecode(currentTime)}</span>
      <button className={styles.playBtn} onClick={onTogglePlay} aria-label={isPlaying ? 'Pause' : 'Play'}>
        {isPlaying ? '⏸' : '▶'}
      </button>
      <div className={styles.right}>
        <span className={styles.duration}>{formatTimecode(totalDuration)}</span>
        <div className={styles.speedWrap}>
          <button className={styles.speedBtn} onClick={() => setShowDropdown(!showDropdown)}>
            {speed} ▾
          </button>
          {showDropdown && (
            <div className={styles.dropdown}>
              {speedOptions.map((s) => (
                <button key={s} className={`${styles.dropItem} ${s === speed ? styles.active : ''}`}
                  onClick={() => { onSpeedChange(s); setShowDropdown(false); }}>{s}</button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
'@

WF "src\blocks\organisms\TransportBar\TransportBar.module.css" @'
.root {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 40px;
  padding: 0 16px;
  border-bottom: 1px solid var(--cybo-timeline-border);
  background: var(--cybo-timeline-bg);
}
.timecode { font-family: var(--cybo-font-mono); font-size: var(--cybo-font-sm); color: var(--cybo-timeline-text); }
.playBtn {
  width: 40px; height: 40px; border-radius: 50%; border: none;
  background: var(--cybo-timeline-playhead); color: #fff;
  font-size: 18px; cursor: pointer; display: flex; align-items: center; justify-content: center;
  transition: transform 0.15s ease;
}
.playBtn:hover { transform: scale(1.05); }
.right { display: flex; align-items: center; gap: 12px; }
.duration { font-family: var(--cybo-font-mono); font-size: var(--cybo-font-sm); color: var(--cybo-timeline-text-muted); }
.speedWrap { position: relative; }
.speedBtn {
  padding: 4px 8px; border-radius: var(--cybo-radius-sm); border: none;
  background: transparent; color: var(--cybo-timeline-text);
  font-size: var(--cybo-font-sm); cursor: pointer;
}
.speedBtn:hover { background: rgba(255,255,255,0.1); }
.dropdown {
  position: absolute; right: 0; top: 100%; margin-top: 4px;
  background: var(--cybo-timeline-toolbar); border-radius: var(--cybo-radius-md);
  box-shadow: 0 4px 12px rgba(0,0,0,0.4); padding: 4px 0; z-index: 50;
}
.dropItem {
  display: block; width: 100%; padding: 6px 16px; border: none;
  background: transparent; color: var(--cybo-timeline-text);
  font-size: var(--cybo-font-sm); text-align: left; cursor: pointer;
}
.dropItem:hover { background: rgba(255,255,255,0.1); }
.active { background: rgba(255,255,255,0.05); }
'@

WF "src\blocks\organisms\TransportBar\TransportBar.stories.tsx" @'
import type { Meta, StoryObj } from '@storybook/react';
import { TransportBar } from './TransportBar';

const meta: Meta<typeof TransportBar> = {
  title: 'Organisms/TransportBar',
  component: TransportBar,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof TransportBar>;

export const Playing: Story = { args: { currentTime: 84.5, totalDuration: 330, isPlaying: true, speed: '1.0x', onTogglePlay: () => {}, onSpeedChange: () => {} } };
export const Paused: Story = { args: { currentTime: 0, totalDuration: 330, isPlaying: false, speed: '1.0x', onTogglePlay: () => {}, onSpeedChange: () => {} } };
'@

WF "src\blocks\organisms\TransportBar\TransportBar.puck.ts" @'
import { ComponentConfig } from '@measured/puck';
import { TransportBar, TransportBarProps } from './TransportBar';

export const TransportBarPuck: ComponentConfig<TransportBarProps> = {
  fields: {
    currentTime: { type: 'number' },
    totalDuration: { type: 'number' },
    isPlaying: { type: 'radio', options: [{ label: 'Playing', value: true }, { label: 'Paused', value: false }] },
    speed: { type: 'text' },
  },
  defaultProps: { currentTime: 84.5, totalDuration: 330, isPlaying: false, speed: '1.0x', onTogglePlay: () => {}, onSpeedChange: () => {} },
  render: (props) => <TransportBar {...props} />,
};
'@

# ============================================================
# 2. organisms/TimelineToolbar
# ============================================================
WF "src\blocks\organisms\TimelineToolbar\TimelineToolbar.tsx" @'
import React from 'react';
import styles from './TimelineToolbar.module.css';

export interface TimelineToolbarProps {
  onAction?: (action: string) => void;
}

const tools = [
  { id: 'undo', label: 'Undo', icon: '↩' },
  { id: 'redo', label: 'Redo', icon: '↪' },
  { id: 'split', label: 'Split', icon: '✂' },
  { id: 'delete', label: 'Delete', icon: '🗑' },
  { id: 'speed', label: 'Speed', icon: '⏱' },
  { id: 'crop', label: 'Crop', icon: '⬒' },
  { id: 'zoomfit', label: 'Zoom-fit', icon: '⛶' },
];

export const TimelineToolbar: React.FC<TimelineToolbarProps> = ({ onAction }) => (
  <div className={styles.root}>
    {tools.map((t) => (
      <button key={t.id} className={styles.btn} title={t.label} onClick={() => onAction?.(t.id)}>
        {t.icon}
      </button>
    ))}
  </div>
);
'@

WF "src\blocks\organisms\TimelineToolbar\TimelineToolbar.module.css" @'
.root {
  display: flex;
  align-items: center;
  gap: 4px;
  height: 32px;
  padding: 0 8px;
  background: var(--cybo-timeline-toolbar);
  border-bottom: 1px solid var(--cybo-timeline-border);
}
.btn {
  width: 28px; height: 28px; border: none; border-radius: var(--cybo-radius-sm);
  background: transparent; color: var(--cybo-timeline-text-muted);
  font-size: 14px; cursor: pointer; display: flex; align-items: center; justify-content: center;
}
.btn:hover { background: rgba(255,255,255,0.1); }
'@

WF "src\blocks\organisms\TimelineToolbar\TimelineToolbar.stories.tsx" @'
import type { Meta, StoryObj } from '@storybook/react';
import { TimelineToolbar } from './TimelineToolbar';

const meta: Meta<typeof TimelineToolbar> = {
  title: 'Organisms/TimelineToolbar',
  component: TimelineToolbar,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof TimelineToolbar>;

export const Default: Story = { args: {} };
'@

WF "src\blocks\organisms\TimelineToolbar\TimelineToolbar.puck.ts" @'
import { ComponentConfig } from '@measured/puck';
import { TimelineToolbar, TimelineToolbarProps } from './TimelineToolbar';

export const TimelineToolbarPuck: ComponentConfig<TimelineToolbarProps> = {
  fields: {},
  defaultProps: {},
  render: (props) => <TimelineToolbar {...props} />,
};
'@

# ============================================================
# 3. templates/Timeline (전체 조립)
# ============================================================
WF "src\blocks\templates\Timeline\Timeline.tsx" @'
import React, { useState, useRef } from 'react';
import styles from './Timeline.module.css';
import { TransportBar } from '../../organisms/TransportBar/TransportBar';
import { TimelineToolbar } from '../../organisms/TimelineToolbar/TimelineToolbar';
import { TimelineRuler } from '../../molecules/TimelineRuler/TimelineRuler';
import { TrackLane } from '../../molecules/TrackLane/TrackLane';
import { VideoClip } from '../../molecules/VideoClip/VideoClip';
import { SubtitleClip } from '../../molecules/SubtitleClip/SubtitleClip';
import { AudioClip } from '../../molecules/AudioClip/AudioClip';
import { Playhead } from '../../atoms/Playhead/Playhead';
import { ZoomSlider } from '../../atoms/ZoomSlider/ZoomSlider';

interface ClipData { id: string; name: string; start: number; duration: number; }
interface TrackData { id: string; name: string; icon: string; type: 'main'|'subtitle'|'bgm'|'effect'|'overlay'; muted: boolean; locked: boolean; visible: boolean; clips: ClipData[]; }

const initialTracks: TrackData[] = [
  { id:'main', name:'Main', icon:'🎬', type:'main', muted:false, locked:false, visible:true, clips:[
    { id:'c1', name:'인트로', start:0, duration:30 },
    { id:'c2', name:'본편 A', start:35, duration:90 },
    { id:'c3', name:'본편 B', start:130, duration:120 },
  ]},
  { id:'sub', name:'자막', icon:'📝', type:'subtitle', muted:false, locked:false, visible:true, clips:[
    { id:'s1', name:'안녕하세요', start:5, duration:25 },
    { id:'s2', name:'다음 장면은...', start:100, duration:40 },
  ]},
  { id:'bgm', name:'BGM', icon:'🎵', type:'bgm', muted:false, locked:false, visible:true, clips:[
    { id:'b1', name:'배경음악.mp3', start:0, duration:250 },
  ]},
  { id:'fx', name:'효과음', icon:'🔊', type:'effect', muted:false, locked:false, visible:true, clips:[
    { id:'f1', name:'효과 1', start:30, duration:5 },
    { id:'f2', name:'효과 2', start:125, duration:8 },
  ]},
  { id:'ov', name:'오버레이', icon:'🖼', type:'overlay', muted:false, locked:false, visible:true, clips:[
    { id:'o1', name:'로고', start:0, duration:60 },
  ]},
];

export const Timeline: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(84.5);
  const [speed, setSpeed] = useState('1.0x');
  const [tracks] = useState<TrackData[]>(initialTracks);
  const [selectedClip, setSelectedClip] = useState<string | null>(null);
  const [zoom, setZoom] = useState(100);
  const [scrollLeft, setScrollLeft] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const totalDuration = 330;
  const pps = (zoom / 100) * 3;
  const totalWidthPx = totalDuration * pps;
  const trackCount = tracks.length;

  const toggleMute = (id: string) => {};
  const toggleLock = (id: string) => {};
  const toggleVisible = (id: string) => {};

  const renderClip = (track: TrackData, clip: ClipData) => {
    const startPx = clip.start * pps;
    const widthPx = clip.duration * pps;
    const sel = selectedClip === clip.id;
    const click = () => setSelectedClip(clip.id);

    switch (track.type) {
      case 'main':
        return <VideoClip key={clip.id} name={clip.name} startPx={startPx} widthPx={widthPx} duration={clip.duration} selected={sel} onClick={click} />;
      case 'subtitle':
        return <SubtitleClip key={clip.id} name={clip.name} startPx={startPx} widthPx={widthPx} selected={sel} onClick={click} />;
      default:
        return <AudioClip key={clip.id} name={clip.name} startPx={startPx} widthPx={widthPx} clipType={track.type as any} selected={sel} onClick={click} />;
    }
  };

  return (
    <div className={styles.root}>
      <TransportBar currentTime={currentTime} totalDuration={totalDuration} isPlaying={isPlaying} speed={speed}
        onTogglePlay={() => setIsPlaying(!isPlaying)} onSpeedChange={setSpeed} />
      <TimelineToolbar />
      <div className={styles.body}>
        {/* Track Headers */}
        <div className={styles.headers}>
          <div className={styles.rulerSpacer} />
          {tracks.map((t) => (
            <div key={t.id} className={`${styles.header} ${t.type === 'main' ? styles.headerMain : ''}`}>
              <span className={styles.headerIcon}>{t.icon}</span>
              <span className={styles.headerName}>{t.name}</span>
              <div className={styles.headerToggles}>
                <button className={styles.toggleBtn} onClick={() => toggleMute(t.id)}>{t.muted ? '🔇' : '🔊'}</button>
                <button className={styles.toggleBtn} onClick={() => toggleLock(t.id)}>{t.locked ? '🔒' : '🔓'}</button>
                <button className={styles.toggleBtn} onClick={() => toggleVisible(t.id)}>{t.visible ? '👁' : '🚫'}</button>
              </div>
            </div>
          ))}
        </div>
        {/* Scrollable Lanes */}
        <div className={styles.lanes} ref={scrollRef} onScroll={(e) => setScrollLeft(e.currentTarget.scrollLeft)}>
          <div style={{ width: `${totalWidthPx}px` }}>
            <TimelineRuler totalDuration={totalDuration} pixelsPerSecond={pps} onClick={setCurrentTime} />
            <div className={styles.tracksWrap}>
              {tracks.map((t) => (
                <TrackLane key={t.id} trackType={t.type} widthPx={totalWidthPx}>
                  {t.clips.map((c) => renderClip(t, c))}
                </TrackLane>
              ))}
              <Playhead positionPx={currentTime * pps} heightPx={trackCount * 64} />
            </div>
          </div>
        </div>
      </div>
      {/* Bottom */}
      <div className={styles.bottom}>
        <div className={styles.scrollIndicator}>
          <div className={styles.scrollThumb}
            style={{ width: `${(100 / zoom) * 100}%`, marginLeft: `${(scrollLeft / totalWidthPx) * 100}%` }} />
        </div>
        <ZoomSlider zoom={zoom} onChange={setZoom} />
      </div>
    </div>
  );
};
'@

WF "src\blocks\templates\Timeline\Timeline.module.css" @'
.root {
  display: flex;
  flex-direction: column;
  width: 100%;
  min-width: 800px;
  background: var(--cybo-timeline-bg);
  user-select: none;
  border-radius: var(--cybo-radius-md);
  overflow: hidden;
}
.body { display: flex; flex: 1; overflow: hidden; }
.headers {
  display: flex; flex-direction: column;
  width: 120px; flex-shrink: 0;
  border-right: 1px solid var(--cybo-timeline-border);
}
.rulerSpacer {
  height: 24px;
  background: var(--cybo-timeline-ruler);
  border-bottom: 1px solid var(--cybo-timeline-border);
}
.header {
  display: flex; align-items: center; gap: 6px;
  height: 64px; padding: 0 8px;
  background: var(--cybo-timeline-track-sub);
  border-bottom: 1px solid var(--cybo-timeline-border);
  transition: filter 0.15s ease;
}
.header:hover { filter: brightness(1.1); }
.headerMain { background: var(--cybo-timeline-track-main); font-weight: 700; }
.headerIcon { font-size: 16px; }
.headerName { font-size: var(--cybo-font-sm); color: var(--cybo-timeline-text); flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.headerToggles { display: flex; gap: 2px; }
.toggleBtn {
  width: 22px; height: 22px; border: none; border-radius: 4px;
  background: transparent; font-size: 10px; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
}
.toggleBtn:hover { background: rgba(255,255,255,0.1); }
.lanes { flex: 1; overflow-x: auto; overflow-y: hidden; }
.tracksWrap { position: relative; }
.bottom {
  display: flex; align-items: center; justify-content: space-between;
  height: 32px; padding: 0 16px;
  background: var(--cybo-timeline-toolbar);
  border-top: 1px solid var(--cybo-timeline-border);
}
.scrollIndicator { flex: 1; height: 6px; border-radius: 999px; background: var(--cybo-timeline-border); margin-right: 16px; overflow: hidden; }
.scrollThumb { height: 100%; border-radius: 999px; background: var(--cybo-timeline-text-muted); transition: all 0.15s ease; }
'@

WF "src\blocks\templates\Timeline\Timeline.stories.tsx" @'
import type { Meta, StoryObj } from '@storybook/react';
import { Timeline } from './Timeline';

const meta: Meta<typeof Timeline> = {
  title: 'Templates/Timeline',
  component: Timeline,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
};
export default meta;
type Story = StoryObj<typeof Timeline>;

export const Default: Story = {};
'@

WF "src\blocks\templates\Timeline\Timeline.puck.ts" @'
import { ComponentConfig } from '@measured/puck';
import { Timeline } from './Timeline';

export const TimelinePuck: ComponentConfig = {
  fields: {},
  defaultProps: {},
  render: () => <Timeline />,
};
'@

# ============================================================
# 4. puck/config.ts 업데이트
# ============================================================
$configPath = "src\puck\config.ts"
$config = [System.IO.File]::ReadAllText($configPath, $utf8)

$newImports = @"

// Timeline blocks
import { PlayheadPuck } from '../blocks/atoms/Playhead/Playhead.puck';
import { ZoomSliderPuck } from '../blocks/atoms/ZoomSlider/ZoomSlider.puck';
import { TimelineRulerPuck } from '../blocks/molecules/TimelineRuler/TimelineRuler.puck';
import { VideoClipPuck } from '../blocks/molecules/VideoClip/VideoClip.puck';
import { SubtitleClipPuck } from '../blocks/molecules/SubtitleClip/SubtitleClip.puck';
import { AudioClipPuck } from '../blocks/molecules/AudioClip/AudioClip.puck';
import { TrackLanePuck } from '../blocks/molecules/TrackLane/TrackLane.puck';
import { TransportBarPuck } from '../blocks/organisms/TransportBar/TransportBar.puck';
import { TimelineToolbarPuck } from '../blocks/organisms/TimelineToolbar/TimelineToolbar.puck';
import { TimelinePuck } from '../blocks/templates/Timeline/Timeline.puck';
"@

$newComponents = @"
    Playhead: PlayheadPuck,
    ZoomSlider: ZoomSliderPuck,
    TimelineRuler: TimelineRulerPuck,
    VideoClip: VideoClipPuck,
    SubtitleClip: SubtitleClipPuck,
    AudioClip: AudioClipPuck,
    TrackLane: TrackLanePuck,
    TransportBar: TransportBarPuck,
    TimelineToolbar: TimelineToolbarPuck,
    Timeline: TimelinePuck,
"@

if($config -notmatch "TimelinePuck"){
  # Add imports before "export const config"
  $config = $config -replace '(export const config)', "$newImports`n`$1"
  # Add components before the closing of components object
  $config = $config -replace '(\s*},?\s*\};\s*$)', "$newComponents`$1"
  [System.IO.File]::WriteAllText($configPath, $config, $utf8)
  Write-Host "OK: config.ts updated with timeline blocks" -ForegroundColor Green
} else {
  Write-Host "SKIP: config.ts already has Timeline" -ForegroundColor Yellow
}

Write-Host "`n=== Part 3 complete: TransportBar + TimelineToolbar + Timeline template + config ===" -ForegroundColor Cyan
Write-Host "`n=== ALL 3 PARTS DONE ===" -ForegroundColor Green
Write-Host "Total new files: 40 (10 blocks x 4 files)" -ForegroundColor Green
Write-Host "`nNext: npm run storybook  ->  Templates/Timeline" -ForegroundColor Yellow
