v0.dev에 입력할 프롬프트:

Create a video editor timeline panel component with these specs:

LAYOUT:
- Dark theme (#121228 background)
- Top toolbar bar (32px): icons for Cut, Magnet, Ripple, Marker, 
  "✨ 자동자막" button highlighted in purple (#6c63ff)
- Time ruler (24px): tick marks at 5-second intervals, 
  "00:00" to "01:30" visible, current time "00:23" highlighted
- Track area with 4 tracks:
  - V1 (Main): lighter background (#1e1e3a), "Main" label, 
    3 video clips as colored blocks with thumbnail strips and names
  - V2: darker, 1 subtitle overlay clip (semi-transparent purple)
  - A1 🎵: audio waveform visualization (green), "나레이션.wav"
  - A2 🎵: BGM waveform (blue, lower amplitude), "bgm_chill.mp3"
- Each track header (120px left): track name, eye icon, mute icon, lock icon
- Red playhead line at 00:23 spanning all tracks vertically
- Bottom: horizontal scrollbar with zoom slider (50% to 400%)

INTERACTIONS:
- Track headers show hover states on icons
- Clips show selection border when clicked (blue outline)
- Playhead has a red triangle handle at top

STYLE:
- Clip colors: video=#2a4a7a, subtitle=#4a2a7a, audio=#1a4a3a, bgm=#1a2a4a
- Waveforms rendered as SVG paths
- Font: 11px Inter for timecodes, 12px for track labels
- All colors via CSS custom properties