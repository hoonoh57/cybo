"use client"

import { useState, useRef, useCallback } from "react"
import {
  Play,
  Pause,
  Undo2,
  Redo2,
  Scissors,
  Trash2,
  Gauge,
  Crop,
  Maximize2,
  Volume2,
  VolumeOff,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  ChevronDown,
  GripVertical,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface Clip {
  id: string
  name: string
  start: number
  duration: number
  type: "video" | "subtitle" | "audio" | "effect" | "overlay"
}

interface Track {
  id: string
  name: string
  icon: string
  type: "main" | "subtitle" | "bgm" | "effect" | "overlay"
  muted: boolean
  locked: boolean
  visible: boolean
  clips: Clip[]
}

const initialTracks: Track[] = [
  {
    id: "main",
    name: "Main",
    icon: "🎬",
    type: "main",
    muted: false,
    locked: false,
    visible: true,
    clips: [
      { id: "clip1", name: "인트로", start: 0, duration: 30, type: "video" },
      { id: "clip2", name: "본편 A", start: 35, duration: 90, type: "video" },
      { id: "clip3", name: "본편 B", start: 130, duration: 120, type: "video" },
    ],
  },
  {
    id: "subtitle",
    name: "자막",
    icon: "📝",
    type: "subtitle",
    muted: false,
    locked: false,
    visible: true,
    clips: [
      { id: "sub1", name: "안녕하세요", start: 5, duration: 25, type: "subtitle" },
      { id: "sub2", name: "다음 장면은...", start: 100, duration: 40, type: "subtitle" },
    ],
  },
  {
    id: "bgm",
    name: "BGM",
    icon: "🎵",
    type: "bgm",
    muted: false,
    locked: false,
    visible: true,
    clips: [
      { id: "bgm1", name: "배경음악.mp3", start: 0, duration: 250, type: "audio" },
    ],
  },
  {
    id: "effect",
    name: "효과음",
    icon: "🔊",
    type: "effect",
    muted: false,
    locked: false,
    visible: true,
    clips: [
      { id: "fx1", name: "효과 1", start: 30, duration: 5, type: "effect" },
      { id: "fx2", name: "효과 2", start: 125, duration: 8, type: "effect" },
    ],
  },
  {
    id: "overlay",
    name: "오버레이",
    icon: "🖼",
    type: "overlay",
    muted: false,
    locked: false,
    visible: true,
    clips: [
      { id: "ov1", name: "로고", start: 0, duration: 60, type: "overlay" },
    ],
  },
]

const speedOptions = ["0.25x", "0.5x", "0.75x", "1.0x", "1.25x", "1.5x", "2.0x"]

function formatTimecode(seconds: number): string {
  const hrs = Math.floor(seconds / 3600)
  const mins = Math.floor((seconds % 3600) / 60)
  const secs = Math.floor(seconds % 60)
  const frames = Math.floor((seconds % 1) * 30)
  return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}:${frames.toString().padStart(2, "0")}`
}

function formatRulerTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
}

export default function VideoTimeline() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(84.5) // 00:01:24:15
  const [speed, setSpeed] = useState("1.0x")
  const [showSpeedDropdown, setShowSpeedDropdown] = useState(false)
  const [tracks, setTracks] = useState<Track[]>(initialTracks)
  const [selectedClip, setSelectedClip] = useState<string | null>(null)
  const [zoom, setZoom] = useState(100)
  const [scrollLeft, setScrollLeft] = useState(0)
  const [isDraggingPlayhead, setIsDraggingPlayhead] = useState(false)
  const [hoveredClip, setHoveredClip] = useState<string | null>(null)

  const timelineRef = useRef<HTMLDivElement>(null)
  const rulerRef = useRef<HTMLDivElement>(null)

  const totalDuration = 330 // 00:05:30:00 in seconds
  const pixelsPerSecond = (zoom / 100) * 3

  const toggleTrackMute = (trackId: string) => {
    setTracks(tracks.map(t => t.id === trackId ? { ...t, muted: !t.muted } : t))
  }

  const toggleTrackLock = (trackId: string) => {
    setTracks(tracks.map(t => t.id === trackId ? { ...t, locked: !t.locked } : t))
  }

  const toggleTrackVisibility = (trackId: string) => {
    setTracks(tracks.map(t => t.id === trackId ? { ...t, visible: !t.visible } : t))
  }

  const getClipColor = (type: Track["type"]): string => {
    switch (type) {
      case "main": return "var(--timeline-clip-video)"
      case "subtitle": return "var(--timeline-clip-subtitle)"
      case "bgm": return "var(--timeline-clip-bgm)"
      case "effect": return "var(--timeline-clip-effect)"
      case "overlay": return "var(--timeline-clip-overlay)"
      default: return "var(--timeline-clip-video)"
    }
  }

  const handleRulerClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!rulerRef.current) return
    const rect = rulerRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left + scrollLeft
    const time = Math.max(0, Math.min(x / pixelsPerSecond, totalDuration))
    setCurrentTime(time)
  }, [pixelsPerSecond, scrollLeft, totalDuration])

  const handlePlayheadDrag = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!isDraggingPlayhead || !rulerRef.current) return
    const rect = rulerRef.current.getBoundingClientRect()
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX
    const x = clientX - rect.left + scrollLeft
    const time = Math.max(0, Math.min(x / pixelsPerSecond, totalDuration))
    setCurrentTime(time)
  }, [isDraggingPlayhead, pixelsPerSecond, scrollLeft, totalDuration])

  const rulerMarks = []
  for (let i = 0; i <= totalDuration; i += 30) {
    rulerMarks.push(i)
  }

  const tickMarks = []
  for (let i = 0; i <= totalDuration; i += 5) {
    tickMarks.push(i)
  }

  return (
    <div 
      className="flex flex-col w-full min-w-[800px] select-none"
      style={{ backgroundColor: "var(--timeline-bg)" }}
    >
      {/* Transport Bar */}
      <div 
        className="flex items-center justify-between h-10 px-4 border-b"
        style={{ borderColor: "var(--timeline-border)" }}
      >
        <span 
          className="font-mono text-sm"
          style={{ color: "var(--timeline-text)" }}
        >
          {formatTimecode(currentTime)}
        </span>
        
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center justify-center w-10 h-10 rounded-full transition-all hover:scale-105"
            style={{ 
              backgroundColor: "var(--timeline-playhead)",
              color: "#fff"
            }}
          >
            {isPlaying ? <Pause size={18} /> : <Play size={18} className="ml-0.5" />}
          </button>
        </div>

        <div className="flex items-center gap-3">
          <span 
            className="font-mono text-sm"
            style={{ color: "var(--timeline-text-muted)" }}
          >
            {formatTimecode(totalDuration)}
          </span>
          <div className="relative">
            <button
              onClick={() => setShowSpeedDropdown(!showSpeedDropdown)}
              className="flex items-center gap-1 px-2 py-1 rounded text-sm transition-colors hover:bg-white/10"
              style={{ color: "var(--timeline-text)" }}
            >
              {speed}
              <ChevronDown size={14} />
            </button>
            {showSpeedDropdown && (
              <div 
                className="absolute right-0 top-full mt-1 rounded-md shadow-lg z-50 py-1"
                style={{ backgroundColor: "var(--timeline-toolbar)" }}
              >
                {speedOptions.map(s => (
                  <button
                    key={s}
                    onClick={() => { setSpeed(s); setShowSpeedDropdown(false) }}
                    className={cn(
                      "block w-full px-4 py-1.5 text-sm text-left transition-colors hover:bg-white/10",
                      s === speed && "bg-white/5"
                    )}
                    style={{ color: "var(--timeline-text)" }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div 
        className="flex items-center gap-1 h-8 px-2 border-b"
        style={{ 
          backgroundColor: "var(--timeline-toolbar)",
          borderColor: "var(--timeline-border)" 
        }}
      >
        {[
          { icon: Undo2, label: "Undo" },
          { icon: Redo2, label: "Redo" },
          { icon: Scissors, label: "Split" },
          { icon: Trash2, label: "Delete" },
          { icon: Gauge, label: "Speed" },
          { icon: Crop, label: "Crop" },
          { icon: Maximize2, label: "Zoom-fit" },
        ].map(({ icon: Icon, label }) => (
          <button
            key={label}
            title={label}
            className="flex items-center justify-center w-7 h-7 rounded transition-colors hover:bg-white/10"
            style={{ color: "var(--timeline-text-muted)" }}
          >
            <Icon size={16} />
          </button>
        ))}
      </div>

      {/* Main Timeline Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Track Headers */}
        <div 
          className="flex flex-col w-[120px] flex-shrink-0 border-r"
          style={{ borderColor: "var(--timeline-border)" }}
        >
          {/* Ruler header spacer */}
          <div 
            className="h-6 border-b"
            style={{ 
              backgroundColor: "var(--timeline-ruler)",
              borderColor: "var(--timeline-border)" 
            }}
          />
          
          {/* Track headers */}
          {tracks.map(track => (
            <div
              key={track.id}
              className="flex items-center gap-2 h-16 px-2 border-b transition-colors hover:brightness-110"
              style={{ 
                backgroundColor: track.type === "main" 
                  ? "var(--timeline-track-main)" 
                  : "var(--timeline-track-sub)",
                borderColor: "var(--timeline-border)"
              }}
            >
              <span className="text-base">{track.icon}</span>
              <span 
                className={cn("text-sm truncate flex-1", track.type === "main" && "font-bold")}
                style={{ color: "var(--timeline-text)" }}
              >
                {track.name}
              </span>
              <div className="flex items-center gap-0.5">
                <button
                  onClick={() => toggleTrackMute(track.id)}
                  className="p-1 rounded transition-colors hover:bg-white/10"
                  style={{ color: track.muted ? "var(--timeline-playhead)" : "var(--timeline-text-muted)" }}
                >
                  {track.muted ? <VolumeOff size={12} /> : <Volume2 size={12} />}
                </button>
                <button
                  onClick={() => toggleTrackLock(track.id)}
                  className="p-1 rounded transition-colors hover:bg-white/10"
                  style={{ color: track.locked ? "var(--timeline-playhead)" : "var(--timeline-text-muted)" }}
                >
                  {track.locked ? <Lock size={12} /> : <Unlock size={12} />}
                </button>
                <button
                  onClick={() => toggleTrackVisibility(track.id)}
                  className="p-1 rounded transition-colors hover:bg-white/10"
                  style={{ color: !track.visible ? "var(--timeline-playhead)" : "var(--timeline-text-muted)" }}
                >
                  {track.visible ? <Eye size={12} /> : <EyeOff size={12} />}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Timeline Tracks */}
        <div 
          className="flex-1 overflow-x-auto overflow-y-hidden"
          ref={timelineRef}
          onScroll={(e) => setScrollLeft(e.currentTarget.scrollLeft)}
        >
          <div style={{ width: `${totalDuration * pixelsPerSecond}px` }}>
            {/* Ruler */}
            <div 
              ref={rulerRef}
              className="relative h-6 border-b cursor-pointer"
              style={{ 
                backgroundColor: "var(--timeline-ruler)",
                borderColor: "var(--timeline-border)" 
              }}
              onClick={handleRulerClick}
              onMouseMove={handlePlayheadDrag}
              onMouseUp={() => setIsDraggingPlayhead(false)}
              onMouseLeave={() => setIsDraggingPlayhead(false)}
            >
              {/* Tick marks */}
              {tickMarks.map(time => (
                <div
                  key={`tick-${time}`}
                  className="absolute top-4 w-px h-2"
                  style={{ 
                    left: `${time * pixelsPerSecond}px`,
                    backgroundColor: "var(--timeline-border)"
                  }}
                />
              ))}
              
              {/* Major marks with labels */}
              {rulerMarks.map(time => (
                <div
                  key={`mark-${time}`}
                  className="absolute top-0 flex flex-col items-center"
                  style={{ left: `${time * pixelsPerSecond}px` }}
                >
                  <span 
                    className="text-[10px] font-mono"
                    style={{ color: "var(--timeline-text-muted)" }}
                  >
                    {formatRulerTime(time)}
                  </span>
                  <div 
                    className="w-px h-3 mt-0.5"
                    style={{ backgroundColor: "var(--timeline-text-muted)" }}
                  />
                </div>
              ))}

              {/* Playhead handle */}
              <div
                className="absolute top-0 z-20 cursor-grab active:cursor-grabbing"
                style={{ left: `${currentTime * pixelsPerSecond - 6}px` }}
                onMouseDown={() => setIsDraggingPlayhead(true)}
              >
                <div 
                  className="w-3 h-3 rounded-sm"
                  style={{ backgroundColor: "var(--timeline-playhead)" }}
                />
              </div>
            </div>

            {/* Track Lanes */}
            <div className="relative">
              {/* Grid lines every 30 seconds */}
              {rulerMarks.map(time => (
                <div
                  key={`grid-${time}`}
                  className="absolute top-0 bottom-0 w-px pointer-events-none"
                  style={{ 
                    left: `${time * pixelsPerSecond}px`,
                    backgroundColor: "var(--timeline-border)",
                    opacity: 0.3,
                    height: `${tracks.length * 64}px`
                  }}
                />
              ))}

              {tracks.map(track => (
                <div
                  key={track.id}
                  className="relative h-16 border-b"
                  style={{ 
                    backgroundColor: track.type === "main" 
                      ? "var(--timeline-track-main)" 
                      : "var(--timeline-track-sub)",
                    borderColor: "var(--timeline-border)"
                  }}
                >
                  {track.clips.map(clip => (
                    <div
                      key={clip.id}
                      className={cn(
                        "absolute top-2 h-12 rounded-md cursor-pointer transition-all",
                        "flex items-center overflow-hidden",
                        selectedClip === clip.id && "ring-2 ring-offset-1",
                        hoveredClip === clip.id && "brightness-110"
                      )}
                      style={{
                        left: `${clip.start * pixelsPerSecond}px`,
                        width: `${clip.duration * pixelsPerSecond}px`,
                        backgroundColor: getClipColor(track.type),
                        boxShadow: selectedClip === clip.id 
                          ? `0 0 12px var(--timeline-selected-glow)` 
                          : "0 2px 4px rgba(0,0,0,0.3)",
                        ringColor: "var(--timeline-selected-glow)"
                      }}
                      onClick={() => setSelectedClip(clip.id)}
                      onMouseEnter={() => setHoveredClip(clip.id)}
                      onMouseLeave={() => setHoveredClip(null)}
                    >
                      {/* Resize handle left */}
                      {hoveredClip === clip.id && (
                        <div 
                          className="absolute left-0 top-0 bottom-0 w-2 cursor-ew-resize flex items-center justify-center hover:bg-white/20"
                        >
                          <GripVertical size={10} style={{ color: "var(--timeline-text)" }} />
                        </div>
                      )}

                      {/* Clip content */}
                      <div className="flex items-center gap-2 px-2 flex-1 min-w-0">
                        {track.type === "main" && (
                          <div 
                            className="w-10 h-8 rounded flex-shrink-0 flex items-center justify-center"
                            style={{ backgroundColor: "rgba(0,0,0,0.3)" }}
                          >
                            <span className="text-xs">🎥</span>
                          </div>
                        )}
                        {track.type === "bgm" && (
                          <div className="flex-1 h-6 flex items-end gap-px overflow-hidden">
                            {Array.from({ length: Math.floor(clip.duration * pixelsPerSecond / 4) }).map((_, i) => (
                              <div
                                key={i}
                                className="w-1 rounded-t"
                                style={{
                                  height: `${Math.random() * 16 + 8}px`,
                                  backgroundColor: "rgba(255,255,255,0.4)"
                                }}
                              />
                            ))}
                          </div>
                        )}
                        <div className="flex flex-col min-w-0 flex-1">
                          <span 
                            className="text-xs font-medium truncate"
                            style={{ color: "var(--timeline-text)" }}
                          >
                            {clip.name}
                          </span>
                          {track.type === "main" && (
                            <span 
                              className="text-[10px] font-mono"
                              style={{ color: "var(--timeline-text-muted)" }}
                            >
                              {formatRulerTime(clip.duration)}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Resize handle right */}
                      {hoveredClip === clip.id && (
                        <div 
                          className="absolute right-0 top-0 bottom-0 w-2 cursor-ew-resize flex items-center justify-center hover:bg-white/20"
                        >
                          <GripVertical size={10} style={{ color: "var(--timeline-text)" }} />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ))}

              {/* Playhead line */}
              <div
                className="absolute top-0 w-0.5 pointer-events-none z-10"
                style={{
                  left: `${currentTime * pixelsPerSecond}px`,
                  height: `${tracks.length * 64}px`,
                  backgroundColor: "var(--timeline-playhead)"
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Controls */}
      <div 
        className="flex items-center justify-between h-8 px-4 border-t"
        style={{ 
          backgroundColor: "var(--timeline-toolbar)",
          borderColor: "var(--timeline-border)" 
        }}
      >
        {/* Horizontal scrollbar indicator */}
        <div 
          className="flex-1 h-1.5 rounded-full mr-4 overflow-hidden"
          style={{ backgroundColor: "var(--timeline-border)" }}
        >
          <div 
            className="h-full rounded-full transition-all"
            style={{ 
              width: `${(100 / zoom) * 100}%`,
              marginLeft: `${(scrollLeft / (totalDuration * pixelsPerSecond)) * 100}%`,
              backgroundColor: "var(--timeline-text-muted)"
            }}
          />
        </div>

        {/* Zoom slider */}
        <div className="flex items-center gap-2">
          <span 
            className="text-xs font-mono"
            style={{ color: "var(--timeline-text-muted)" }}
          >
            50%
          </span>
          <input
            type="range"
            min={50}
            max={400}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="w-24 h-1 rounded-full appearance-none cursor-pointer"
            style={{ 
              backgroundColor: "var(--timeline-border)",
              accentColor: "var(--timeline-playhead)"
            }}
          />
          <span 
            className="text-xs font-mono"
            style={{ color: "var(--timeline-text-muted)" }}
          >
            400%
          </span>
          <span 
            className="text-xs font-mono ml-2 w-10"
            style={{ color: "var(--timeline-text)" }}
          >
            {zoom}%
          </span>
        </div>
      </div>
    </div>
  )
}
