$utf8 = New-Object System.Text.UTF8Encoding $false
function WF($path,$content){
  $dir = Split-Path $path -Parent
  if(!(Test-Path $dir)){ New-Item -ItemType Directory -Force -Path $dir | Out-Null }
  [System.IO.File]::WriteAllText($path,$content,$utf8)
  Write-Host "OK: $path" -ForegroundColor Green
}

# ============================================================
# 1. molecules/TimelineRuler
# ============================================================
WF "src\blocks\molecules\TimelineRuler\TimelineRuler.tsx" @'
import React from 'react';
import styles from './TimelineRuler.module.css';

export interface TimelineRulerProps {
  totalDuration: number;
  pixelsPerSecond: number;
  onClick?: (time: number) => void;
}

function formatRulerTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export const TimelineRuler: React.FC<TimelineRulerProps> = ({ totalDuration, pixelsPerSecond, onClick }) => {
  const majorMarks: number[] = [];
  for (let i = 0; i <= totalDuration; i += 30) majorMarks.push(i);

  const tickMarks: number[] = [];
  for (let i = 0; i <= totalDuration; i += 5) tickMarks.push(i);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!onClick) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const time = Math.max(0, Math.min(x / pixelsPerSecond, totalDuration));
    onClick(time);
  };

  return (
    <div className={styles.root} onClick={handleClick} style={{ width: `${totalDuration * pixelsPerSecond}px` }}>
      {tickMarks.map((t) => (
        <div key={`t-${t}`} className={styles.tick} style={{ left: `${t * pixelsPerSecond}px` }} />
      ))}
      {majorMarks.map((t) => (
        <div key={`m-${t}`} className={styles.major} style={{ left: `${t * pixelsPerSecond}px` }}>
          <span className={styles.label}>{formatRulerTime(t)}</span>
          <div className={styles.majorTick} />
        </div>
      ))}
    </div>
  );
};
'@

WF "src\blocks\molecules\TimelineRuler\TimelineRuler.module.css" @'
.root {
  position: relative;
  height: 24px;
  background: var(--cybo-timeline-ruler);
  border-bottom: 1px solid var(--cybo-timeline-border);
  cursor: pointer;
  user-select: none;
}
.tick {
  position: absolute;
  top: 16px;
  width: 1px;
  height: 8px;
  background: var(--cybo-timeline-border);
}
.major {
  position: absolute;
  top: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.label {
  font-size: 10px;
  font-family: var(--cybo-font-mono);
  color: var(--cybo-timeline-text-muted);
}
.majorTick {
  width: 1px;
  height: 12px;
  margin-top: 2px;
  background: var(--cybo-timeline-text-muted);
}
'@

WF "src\blocks\molecules\TimelineRuler\TimelineRuler.stories.tsx" @'
import type { Meta, StoryObj } from '@storybook/react';
import { TimelineRuler } from './TimelineRuler';

const meta: Meta<typeof TimelineRuler> = {
  title: 'Molecules/TimelineRuler',
  component: TimelineRuler,
  tags: ['autodocs'],
  decorators: [(Story) => <div style={{ overflowX: 'auto', background: '#121228', padding: 8 }}><Story /></div>],
};
export default meta;
type Story = StoryObj<typeof TimelineRuler>;

export const Default: Story = { args: { totalDuration: 330, pixelsPerSecond: 3 } };
export const ZoomedIn: Story = { args: { totalDuration: 330, pixelsPerSecond: 8 } };
'@

WF "src\blocks\molecules\TimelineRuler\TimelineRuler.puck.ts" @'
import { ComponentConfig } from '@measured/puck';
import { TimelineRuler, TimelineRulerProps } from './TimelineRuler';

export const TimelineRulerPuck: ComponentConfig<TimelineRulerProps> = {
  fields: {
    totalDuration: { type: 'number' },
    pixelsPerSecond: { type: 'number' },
  },
  defaultProps: { totalDuration: 330, pixelsPerSecond: 3 },
  render: (props) => <TimelineRuler {...props} />,
};
'@

# ============================================================
# 2. molecules/VideoClip
# ============================================================
WF "src\blocks\molecules\VideoClip\VideoClip.tsx" @'
import React, { useState } from 'react';
import styles from './VideoClip.module.css';

export interface VideoClipProps {
  name: string;
  startPx: number;
  widthPx: number;
  duration: number;
  selected?: boolean;
  onClick?: () => void;
}

function formatTime(s: number) {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m.toString().padStart(2,'0')}:${sec.toString().padStart(2,'0')}`;
}

export const VideoClip: React.FC<VideoClipProps> = ({ name, startPx, widthPx, duration, selected, onClick }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className={`${styles.root} ${selected ? styles.selected : ''} ${hovered ? styles.hovered : ''}`}
      style={{ left: `${startPx}px`, width: `${widthPx}px` }}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {hovered && <div className={styles.resizeHandle} data-side="left" />}
      <div className={styles.thumbnail}>🎥</div>
      <div className={styles.info}>
        <span className={styles.name}>{name}</span>
        <span className={styles.time}>{formatTime(duration)}</span>
      </div>
      {hovered && <div className={styles.resizeHandle} data-side="right" />}
    </div>
  );
};
'@

WF "src\blocks\molecules\VideoClip\VideoClip.module.css" @'
.root {
  position: absolute;
  top: 8px;
  height: 48px;
  border-radius: var(--cybo-radius-md);
  background: var(--cybo-timeline-clip-video);
  display: flex;
  align-items: center;
  overflow: hidden;
  cursor: pointer;
  transition: filter 0.15s ease;
  box-shadow: 0 2px 4px rgba(0,0,0,0.3);
}
.selected { box-shadow: 0 0 12px var(--cybo-timeline-selected-glow); outline: 2px solid var(--cybo-timeline-selected-glow); }
.hovered { filter: brightness(1.1); }
.resizeHandle {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 8px;
  cursor: ew-resize;
  display: flex;
  align-items: center;
  justify-content: center;
}
.resizeHandle[data-side="left"] { left: 0; }
.resizeHandle[data-side="right"] { right: 0; }
.resizeHandle:hover { background: rgba(255,255,255,0.2); }
.thumbnail {
  width: 40px;
  height: 32px;
  border-radius: 4px;
  background: rgba(0,0,0,0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  flex-shrink: 0;
  margin-left: 8px;
}
.info { display: flex; flex-direction: column; padding: 0 8px; min-width: 0; flex: 1; }
.name { font-size: 12px; font-weight: 500; color: var(--cybo-timeline-text); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.time { font-size: 10px; font-family: var(--cybo-font-mono); color: var(--cybo-timeline-text-muted); }
'@

WF "src\blocks\molecules\VideoClip\VideoClip.stories.tsx" @'
import type { Meta, StoryObj } from '@storybook/react';
import { VideoClip } from './VideoClip';

const meta: Meta<typeof VideoClip> = {
  title: 'Molecules/VideoClip',
  component: VideoClip,
  tags: ['autodocs'],
  decorators: [(Story) => <div style={{ position: 'relative', height: 64, background: '#1e1e3a', width: 600 }}><Story /></div>],
};
export default meta;
type Story = StoryObj<typeof VideoClip>;

export const Default: Story = { args: { name: '인트로', startPx: 0, widthPx: 90, duration: 30 } };
export const Selected: Story = { args: { name: '본편 A', startPx: 105, widthPx: 270, duration: 90, selected: true } };
'@

WF "src\blocks\molecules\VideoClip\VideoClip.puck.ts" @'
import { ComponentConfig } from '@measured/puck';
import { VideoClip, VideoClipProps } from './VideoClip';

export const VideoClipPuck: ComponentConfig<VideoClipProps> = {
  fields: { name: { type: 'text' }, startPx: { type: 'number' }, widthPx: { type: 'number' }, duration: { type: 'number' } },
  defaultProps: { name: '클립', startPx: 0, widthPx: 120, duration: 30 },
  render: (props) => <VideoClip {...props} />,
};
'@

# ============================================================
# 3. molecules/SubtitleClip
# ============================================================
WF "src\blocks\molecules\SubtitleClip\SubtitleClip.tsx" @'
import React, { useState } from 'react';
import styles from './SubtitleClip.module.css';

export interface SubtitleClipProps {
  name: string;
  startPx: number;
  widthPx: number;
  selected?: boolean;
  onClick?: () => void;
}

export const SubtitleClip: React.FC<SubtitleClipProps> = ({ name, startPx, widthPx, selected, onClick }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className={`${styles.root} ${selected ? styles.selected : ''} ${hovered ? styles.hovered : ''}`}
      style={{ left: `${startPx}px`, width: `${widthPx}px` }}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span className={styles.name}>{name}</span>
    </div>
  );
};
'@

WF "src\blocks\molecules\SubtitleClip\SubtitleClip.module.css" @'
.root {
  position: absolute;
  top: 8px;
  height: 48px;
  border-radius: var(--cybo-radius-md);
  background: var(--cybo-timeline-clip-subtitle);
  display: flex;
  align-items: center;
  padding: 0 12px;
  cursor: pointer;
  transition: filter 0.15s ease;
  box-shadow: 0 2px 4px rgba(0,0,0,0.3);
}
.selected { box-shadow: 0 0 12px var(--cybo-timeline-selected-glow); outline: 2px solid var(--cybo-timeline-selected-glow); }
.hovered { filter: brightness(1.1); }
.name { font-size: 12px; font-weight: 500; color: var(--cybo-timeline-text); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
'@

WF "src\blocks\molecules\SubtitleClip\SubtitleClip.stories.tsx" @'
import type { Meta, StoryObj } from '@storybook/react';
import { SubtitleClip } from './SubtitleClip';

const meta: Meta<typeof SubtitleClip> = {
  title: 'Molecules/SubtitleClip',
  component: SubtitleClip,
  tags: ['autodocs'],
  decorators: [(Story) => <div style={{ position: 'relative', height: 64, background: '#161630', width: 600 }}><Story /></div>],
};
export default meta;
type Story = StoryObj<typeof SubtitleClip>;

export const Default: Story = { args: { name: '안녕하세요', startPx: 15, widthPx: 75 } };
export const Selected: Story = { args: { name: '다음 장면은...', startPx: 300, widthPx: 120, selected: true } };
'@

WF "src\blocks\molecules\SubtitleClip\SubtitleClip.puck.ts" @'
import { ComponentConfig } from '@measured/puck';
import { SubtitleClip, SubtitleClipProps } from './SubtitleClip';

export const SubtitleClipPuck: ComponentConfig<SubtitleClipProps> = {
  fields: { name: { type: 'text' }, startPx: { type: 'number' }, widthPx: { type: 'number' } },
  defaultProps: { name: '자막', startPx: 0, widthPx: 100 },
  render: (props) => <SubtitleClip {...props} />,
};
'@

# ============================================================
# 4. molecules/AudioClip
# ============================================================
WF "src\blocks\molecules\AudioClip\AudioClip.tsx" @'
import React, { useState, useMemo } from 'react';
import styles from './AudioClip.module.css';

export interface AudioClipProps {
  name: string;
  startPx: number;
  widthPx: number;
  clipType?: 'bgm' | 'effect' | 'overlay';
  selected?: boolean;
  onClick?: () => void;
}

const colorMap: Record<string, string> = {
  bgm: 'var(--cybo-timeline-clip-bgm)',
  effect: 'var(--cybo-timeline-clip-effect)',
  overlay: 'var(--cybo-timeline-clip-overlay)',
};

export const AudioClip: React.FC<AudioClipProps> = ({ name, startPx, widthPx, clipType = 'bgm', selected, onClick }) => {
  const [hovered, setHovered] = useState(false);
  const bars = useMemo(() => {
    const count = Math.max(1, Math.floor(widthPx / 4));
    return Array.from({ length: count }, (_, i) => 8 + Math.abs(Math.sin(i * 0.7)) * 16);
  }, [widthPx]);

  return (
    <div
      className={`${styles.root} ${selected ? styles.selected : ''} ${hovered ? styles.hovered : ''}`}
      style={{ left: `${startPx}px`, width: `${widthPx}px`, background: colorMap[clipType] }}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {clipType === 'bgm' && (
        <div className={styles.waveform}>
          {bars.map((h, i) => (
            <div key={i} className={styles.bar} style={{ height: `${h}px` }} />
          ))}
        </div>
      )}
      <span className={styles.name}>{name}</span>
    </div>
  );
};
'@

WF "src\blocks\molecules\AudioClip\AudioClip.module.css" @'
.root {
  position: absolute;
  top: 8px;
  height: 48px;
  border-radius: var(--cybo-radius-md);
  display: flex;
  align-items: center;
  padding: 0 8px;
  cursor: pointer;
  transition: filter 0.15s ease;
  box-shadow: 0 2px 4px rgba(0,0,0,0.3);
  overflow: hidden;
}
.selected { box-shadow: 0 0 12px var(--cybo-timeline-selected-glow); outline: 2px solid var(--cybo-timeline-selected-glow); }
.hovered { filter: brightness(1.1); }
.waveform { display: flex; align-items: flex-end; gap: 1px; flex: 1; height: 24px; overflow: hidden; }
.bar { width: 3px; border-radius: 2px 2px 0 0; background: rgba(255,255,255,0.4); flex-shrink: 0; }
.name { font-size: 12px; font-weight: 500; color: var(--cybo-timeline-text); white-space: nowrap; margin-left: 8px; flex-shrink: 0; }
'@

WF "src\blocks\molecules\AudioClip\AudioClip.stories.tsx" @'
import type { Meta, StoryObj } from '@storybook/react';
import { AudioClip } from './AudioClip';

const meta: Meta<typeof AudioClip> = {
  title: 'Molecules/AudioClip',
  component: AudioClip,
  tags: ['autodocs'],
  decorators: [(Story) => <div style={{ position: 'relative', height: 64, background: '#161630', width: 800 }}><Story /></div>],
};
export default meta;
type Story = StoryObj<typeof AudioClip>;

export const BGM: Story = { args: { name: '배경음악.mp3', startPx: 0, widthPx: 750, clipType: 'bgm' } };
export const Effect: Story = { args: { name: '효과 1', startPx: 90, widthPx: 15, clipType: 'effect' } };
export const Overlay: Story = { args: { name: '로고', startPx: 0, widthPx: 180, clipType: 'overlay' } };
'@

WF "src\blocks\molecules\AudioClip\AudioClip.puck.ts" @'
import { ComponentConfig } from '@measured/puck';
import { AudioClip, AudioClipProps } from './AudioClip';

export const AudioClipPuck: ComponentConfig<AudioClipProps> = {
  fields: {
    name: { type: 'text' },
    startPx: { type: 'number' },
    widthPx: { type: 'number' },
    clipType: { type: 'select', options: [{ label: 'BGM', value: 'bgm' }, { label: 'Effect', value: 'effect' }, { label: 'Overlay', value: 'overlay' }] },
  },
  defaultProps: { name: '오디오', startPx: 0, widthPx: 200, clipType: 'bgm' },
  render: (props) => <AudioClip {...props} />,
};
'@

# ============================================================
# 5. molecules/TrackLane
# ============================================================
WF "src\blocks\molecules\TrackLane\TrackLane.tsx" @'
import React from 'react';
import styles from './TrackLane.module.css';

export interface TrackLaneProps {
  trackType: 'main' | 'subtitle' | 'bgm' | 'effect' | 'overlay';
  widthPx: number;
  children?: React.ReactNode;
}

export const TrackLane: React.FC<TrackLaneProps> = ({ trackType, widthPx, children }) => (
  <div
    className={`${styles.root} ${trackType === 'main' ? styles.main : styles.sub}`}
    style={{ width: `${widthPx}px` }}
  >
    {children}
  </div>
);
'@

WF "src\blocks\molecules\TrackLane\TrackLane.module.css" @'
.root {
  position: relative;
  height: 64px;
  border-bottom: 1px solid var(--cybo-timeline-border);
}
.main { background: var(--cybo-timeline-track-main); }
.sub { background: var(--cybo-timeline-track-sub); }
'@

WF "src\blocks\molecules\TrackLane\TrackLane.stories.tsx" @'
import type { Meta, StoryObj } from '@storybook/react';
import { TrackLane } from './TrackLane';

const meta: Meta<typeof TrackLane> = {
  title: 'Molecules/TrackLane',
  component: TrackLane,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof TrackLane>;

export const Main: Story = { args: { trackType: 'main', widthPx: 600 } };
export const Sub: Story = { args: { trackType: 'subtitle', widthPx: 600 } };
'@

WF "src\blocks\molecules\TrackLane\TrackLane.puck.ts" @'
import { ComponentConfig } from '@measured/puck';
import { TrackLane, TrackLaneProps } from './TrackLane';

export const TrackLanePuck: ComponentConfig<TrackLaneProps> = {
  fields: {
    trackType: { type: 'select', options: [{ label: 'Main', value: 'main' }, { label: 'Subtitle', value: 'subtitle' }, { label: 'BGM', value: 'bgm' }, { label: 'Effect', value: 'effect' }, { label: 'Overlay', value: 'overlay' }] },
    widthPx: { type: 'number' },
  },
  defaultProps: { trackType: 'main', widthPx: 990 },
  render: (props) => <TrackLane {...props} />,
};
'@

Write-Host "`n=== Part 2 complete: TimelineRuler + VideoClip + SubtitleClip + AudioClip + TrackLane ===" -ForegroundColor Cyan
Write-Host "Run: powershell -ExecutionPolicy Bypass -File create-timeline-part3.ps1" -ForegroundColor Cyan
