v0.dev에 입력할 프롬프트:

Create a video editor preview/canvas area component with these specs:

LAYOUT:
- Dark background (#16213e)
- Top toolbar (32px): 
  Left: aspect ratio buttons [16:9] [9:16] [1:1] [4:3] with 16:9 active
  Center: zoom level "Fit" dropdown
  Right: safe-zone toggle, grid toggle, snapshot button
- Center: video canvas area maintaining 16:9 aspect ratio
  - Black canvas with a sample frame showing a cafe interior photo
  - Thin white border around canvas
  - Corner and edge resize handles (small white squares)
- Transport controls bar (40px) below canvas:
  Left: ⏮ ◀ ▶(play, large, purple accent) ▶ ⏭
  Center: timecode display "00:00:23:15 / 00:01:30:00" in monospace
  Right: loop toggle, volume slider with icon, fullscreen button
- When 9:16 is selected, canvas rotates to vertical (tall and narrow, centered)

STYLE:
- Canvas area uses flexbox centering
- Transport icons are 20px, play button 28px
- Active aspect ratio button has purple bottom border
- Monospace font (JetBrains Mono) for timecode
- All via CSS custom properties
- Responsive: canvas scales to fit available space