$utf8 = New-Object System.Text.UTF8Encoding $false
function WF($path,$content){
  $dir = Split-Path $path -Parent
  if(!(Test-Path $dir)){ New-Item -ItemType Directory -Force -Path $dir | Out-Null }
  [System.IO.File]::WriteAllText($path,$content,$utf8)
  Write-Host "OK: $path" -ForegroundColor Green
}

# ============================================================
# 1. tokens.css — 타임라인 변수 추가
# ============================================================
$tokensPath = "src\tokens\tokens.css"
$existing = [System.IO.File]::ReadAllText($tokensPath, $utf8)
if($existing -notmatch "timeline-bg"){
  $timelineVars = @"

  /* === Timeline tokens (v0 import) === */
  --cybo-timeline-bg: #121228;
  --cybo-timeline-track-main: #1e1e3a;
  --cybo-timeline-track-sub: #161630;
  --cybo-timeline-clip-video: #2a4a7a;
  --cybo-timeline-clip-subtitle: #4a2a7a;
  --cybo-timeline-clip-bgm: #1a4a3a;
  --cybo-timeline-clip-effect: #1a2a4a;
  --cybo-timeline-clip-overlay: #4a3a2a;
  --cybo-timeline-playhead: #ff6b6b;
  --cybo-timeline-ruler: #1a1a35;
  --cybo-timeline-toolbar: #181830;
  --cybo-timeline-border: #2a2a4a;
  --cybo-timeline-text: #e0e0f0;
  --cybo-timeline-text-muted: #8080a0;
  --cybo-timeline-selected-glow: rgba(100, 150, 255, 0.5);
"@
  $updated = $existing.TrimEnd() -replace '\}\s*$', "$timelineVars`n}"
  [System.IO.File]::WriteAllText($tokensPath, $updated, $utf8)
  Write-Host "OK: tokens.css updated" -ForegroundColor Green
} else {
  Write-Host "SKIP: tokens.css already has timeline vars" -ForegroundColor Yellow
}

# ============================================================
# 2. atoms/Playhead
# ============================================================
WF "src\blocks\atoms\Playhead\Playhead.tsx" @'
import React from 'react';
import styles from './Playhead.module.css';

export interface PlayheadProps {
  positionPx: number;
  heightPx: number;
  onDragStart?: () => void;
}

export const Playhead: React.FC<PlayheadProps> = ({ positionPx, heightPx, onDragStart }) => (
  <div className={styles.root} style={{ left: `${positionPx}px`, height: `${heightPx}px` }}>
    <div
      className={styles.handle}
      onMouseDown={onDragStart}
      role="slider"
      aria-label="Playhead"
      tabIndex={0}
    />
    <div className={styles.line} />
  </div>
);
'@

WF "src\blocks\atoms\Playhead\Playhead.module.css" @'
.root {
  position: absolute;
  top: 0;
  z-index: 20;
  pointer-events: none;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.handle {
  width: 12px;
  height: 12px;
  border-radius: var(--cybo-radius-sm);
  background: var(--cybo-timeline-playhead);
  cursor: grab;
  pointer-events: auto;
  flex-shrink: 0;
}
.handle:active { cursor: grabbing; }
.line {
  width: 2px;
  flex: 1;
  background: var(--cybo-timeline-playhead);
}
'@

WF "src\blocks\atoms\Playhead\Playhead.stories.tsx" @'
import type { Meta, StoryObj } from '@storybook/react';
import { Playhead } from './Playhead';

const meta: Meta<typeof Playhead> = {
  title: 'Atoms/Playhead',
  component: Playhead,
  tags: ['autodocs'],
  decorators: [(Story) => <div style={{ position: 'relative', height: 300, background: '#121228' }}><Story /></div>],
};
export default meta;
type Story = StoryObj<typeof Playhead>;

export const Default: Story = { args: { positionPx: 120, heightPx: 280 } };
export const AtStart: Story = { args: { positionPx: 0, heightPx: 280 } };
'@

WF "src\blocks\atoms\Playhead\Playhead.puck.ts" @'
import { ComponentConfig } from '@measured/puck';
import { Playhead, PlayheadProps } from './Playhead';

export const PlayheadPuck: ComponentConfig<PlayheadProps> = {
  fields: {
    positionPx: { type: 'number' },
    heightPx: { type: 'number' },
  },
  defaultProps: { positionPx: 100, heightPx: 280 },
  render: (props) => <Playhead {...props} />,
};
'@

# ============================================================
# 3. atoms/ZoomSlider
# ============================================================
WF "src\blocks\atoms\ZoomSlider\ZoomSlider.tsx" @'
import React from 'react';
import styles from './ZoomSlider.module.css';

export interface ZoomSliderProps {
  zoom: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
}

export const ZoomSlider: React.FC<ZoomSliderProps> = ({ zoom, min = 50, max = 400, onChange }) => (
  <div className={styles.root}>
    <span className={styles.label}>{min}%</span>
    <input
      type="range"
      min={min}
      max={max}
      value={zoom}
      onChange={(e) => onChange(Number(e.target.value))}
      className={styles.slider}
    />
    <span className={styles.label}>{max}%</span>
    <span className={styles.value}>{zoom}%</span>
  </div>
);
'@

WF "src\blocks\atoms\ZoomSlider\ZoomSlider.module.css" @'
.root {
  display: flex;
  align-items: center;
  gap: var(--cybo-gap-md);
}
.label {
  font-size: var(--cybo-font-xs);
  font-family: var(--cybo-font-mono);
  color: var(--cybo-timeline-text-muted);
}
.value {
  font-size: var(--cybo-font-xs);
  font-family: var(--cybo-font-mono);
  color: var(--cybo-timeline-text);
  margin-left: var(--cybo-gap-md);
  min-width: 36px;
}
.slider {
  width: 96px;
  height: 4px;
  border-radius: 999px;
  appearance: none;
  background: var(--cybo-timeline-border);
  cursor: pointer;
  accent-color: var(--cybo-timeline-playhead);
}
'@

WF "src\blocks\atoms\ZoomSlider\ZoomSlider.stories.tsx" @'
import type { Meta, StoryObj } from '@storybook/react';
import { ZoomSlider } from './ZoomSlider';
import { useState } from 'react';

const meta: Meta<typeof ZoomSlider> = {
  title: 'Atoms/ZoomSlider',
  component: ZoomSlider,
  tags: ['autodocs'],
  decorators: [(Story) => <div style={{ padding: 20, background: '#181830' }}><Story /></div>],
};
export default meta;
type Story = StoryObj<typeof ZoomSlider>;

export const Default: Story = { args: { zoom: 100, onChange: () => {} } };
export const ZoomedIn: Story = { args: { zoom: 300, onChange: () => {} } };
'@

WF "src\blocks\atoms\ZoomSlider\ZoomSlider.puck.ts" @'
import { ComponentConfig } from '@measured/puck';
import { ZoomSlider, ZoomSliderProps } from './ZoomSlider';

export const ZoomSliderPuck: ComponentConfig<ZoomSliderProps> = {
  fields: {
    zoom: { type: 'number' },
    min: { type: 'number' },
    max: { type: 'number' },
  },
  defaultProps: { zoom: 100, min: 50, max: 400, onChange: () => {} },
  render: (props) => <ZoomSlider {...props} />,
};
'@

Write-Host "`n=== Part 1 complete: tokens.css + Playhead + ZoomSlider ===" -ForegroundColor Cyan
Write-Host "Run: powershell -ExecutionPolicy Bypass -File create-timeline-part2.ps1" -ForegroundColor Cyan
