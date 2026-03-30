'use client';

import { useState, useCallback } from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  ChevronsLeft,
  ChevronsRight,
  Volume2,
  VolumeX,
  Repeat,
  ChevronDown,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface TransportBarProps {
  currentTime?: number;
  totalDuration?: number;
  isPlaying?: boolean;
  speed?: number;
  volume?: number;
  isMuted?: boolean;
  loopA?: number | null;
  loopB?: number | null;
  isLooping?: boolean;
  onPlay?: () => void;
  onPause?: () => void;
  onSeek?: (time: number) => void;
  onSpeedChange?: (speed: number) => void;
  onVolumeChange?: (volume: number) => void;
  onMuteToggle?: () => void;
  onSetLoopA?: () => void;
  onSetLoopB?: () => void;
  onToggleLoop?: () => void;
  onSkipForward?: () => void;
  onSkipBack?: () => void;
  onGoToStart?: () => void;
  onGoToEnd?: () => void;
  className?: string;
}

const SPEEDS = [0.25, 0.5, 1.0, 1.5, 2.0];

function formatTimecode(seconds: number): string {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  const frames = Math.floor((seconds % 1) * 30);
  return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}:${frames.toString().padStart(2, '0')}`;
}

export function TransportBar({
  currentTime = 0,
  totalDuration = 300,
  isPlaying = false,
  speed = 1.0,
  volume = 80,
  isMuted = false,
  loopA = null,
  loopB = null,
  isLooping = false,
  onPlay,
  onPause,
  onSeek,
  onSpeedChange,
  onVolumeChange,
  onMuteToggle,
  onSetLoopA,
  onSetLoopB,
  onToggleLoop,
  onSkipForward,
  onSkipBack,
  onGoToStart,
  onGoToEnd,
  className,
}: TransportBarProps) {
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [localVolume, setLocalVolume] = useState(volume);
  const [localMuted, setLocalMuted] = useState(isMuted);
  const [localPlaying, setLocalPlaying] = useState(isPlaying);
  const [localSpeed, setLocalSpeed] = useState(speed);
  const [localLoopA, setLocalLoopA] = useState(loopA);
  const [localLoopB, setLocalLoopB] = useState(loopB);
  const [localLooping, setLocalLooping] = useState(isLooping);

  const handlePlayPause = useCallback(() => {
    setLocalPlaying((prev) => !prev);
    if (localPlaying) {
      onPause?.();
    } else {
      onPlay?.();
    }
  }, [localPlaying, onPlay, onPause]);

  const handleSpeedSelect = useCallback(
    (s: number) => {
      setLocalSpeed(s);
      setShowSpeedMenu(false);
      onSpeedChange?.(s);
    },
    [onSpeedChange]
  );

  const handleVolumeChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = Number(e.target.value);
      setLocalVolume(val);
      onVolumeChange?.(val);
    },
    [onVolumeChange]
  );

  const handleMuteToggle = useCallback(() => {
    setLocalMuted((prev) => !prev);
    onMuteToggle?.();
  }, [onMuteToggle]);

  const handleSetA = useCallback(() => {
    setLocalLoopA(currentTime);
    onSetLoopA?.();
  }, [currentTime, onSetLoopA]);

  const handleSetB = useCallback(() => {
    setLocalLoopB(currentTime);
    onSetLoopB?.();
  }, [currentTime, onSetLoopB]);

  const handleToggleLoop = useCallback(() => {
    setLocalLooping((prev) => !prev);
    onToggleLoop?.();
  }, [onToggleLoop]);

  return (
    <div
      className={cn(
        'w-full h-full flex items-center gap-1 px-3 bg-[#111128] border-b border-[#2a2a4a]',
        className
      )}
    >
      {/* Navigation: Go to start */}
      <button
        onClick={onGoToStart}
        className="w-7 h-7 flex items-center justify-center rounded hover:bg-[#1a1a3a] text-[#808098] hover:text-[#e0e0f0] transition-colors"
        aria-label="Go to start"
      >
        <ChevronsLeft className="w-4 h-4" />
      </button>

      {/* Skip back one frame */}
      <button
        onClick={onSkipBack}
        className="w-7 h-7 flex items-center justify-center rounded hover:bg-[#1a1a3a] text-[#808098] hover:text-[#e0e0f0] transition-colors"
        aria-label="Previous frame"
      >
        <SkipBack className="w-3.5 h-3.5" />
      </button>

      {/* Play / Pause */}
      <button
        onClick={handlePlayPause}
        className="w-9 h-9 rounded-full bg-[#6c63ff] hover:bg-[#5b52ee] flex items-center justify-center transition-colors shrink-0"
        aria-label={localPlaying ? 'Pause' : 'Play'}
      >
        {localPlaying ? (
          <Pause className="w-4 h-4 text-white" />
        ) : (
          <Play className="w-4 h-4 text-white ml-0.5" />
        )}
      </button>

      {/* Skip forward one frame */}
      <button
        onClick={onSkipForward}
        className="w-7 h-7 flex items-center justify-center rounded hover:bg-[#1a1a3a] text-[#808098] hover:text-[#e0e0f0] transition-colors"
        aria-label="Next frame"
      >
        <SkipForward className="w-3.5 h-3.5" />
      </button>

      {/* Go to end */}
      <button
        onClick={onGoToEnd}
        className="w-7 h-7 flex items-center justify-center rounded hover:bg-[#1a1a3a] text-[#808098] hover:text-[#e0e0f0] transition-colors"
        aria-label="Go to end"
      >
        <ChevronsRight className="w-4 h-4" />
      </button>

      {/* Divider */}
      <div className="w-px h-6 bg-[#2a2a4a] mx-1" />

      {/* Timecode */}
      <div className="font-mono text-sm text-[#e0e0f0] tracking-wider tabular-nums min-w-[110px] text-center">
        {formatTimecode(currentTime)}
      </div>
      <span className="text-[#505070] text-xs">/</span>
      <div className="font-mono text-xs text-[#505070] tracking-wider tabular-nums min-w-[110px] text-center">
        {formatTimecode(totalDuration)}
      </div>

      {/* Divider */}
      <div className="w-px h-6 bg-[#2a2a4a] mx-1" />

      {/* Speed selector */}
      <div className="relative">
        <button
          onClick={() => setShowSpeedMenu((prev) => !prev)}
          className="flex items-center gap-1 px-2 h-7 rounded bg-[#1a1a3a] border border-[#2a2a4a] hover:border-[#3a3a5a] text-[#e0e0f0] text-xs font-mono transition-colors"
          aria-label="Playback speed"
        >
          {localSpeed}x
          <ChevronDown className="w-3 h-3 text-[#505070]" />
        </button>
        {showSpeedMenu && (
          <div className="absolute bottom-full left-0 mb-1 py-1 rounded bg-[#12122a] border border-[#2a2a4a] shadow-lg z-50">
            {SPEEDS.map((s) => (
              <button
                key={s}
                onClick={() => handleSpeedSelect(s)}
                className={cn(
                  'w-full px-4 py-1.5 text-xs font-mono text-left hover:bg-[#1a1a3a] transition-colors',
                  s === localSpeed
                    ? 'text-[#6c63ff]'
                    : 'text-[#808098]'
                )}
              >
                {s}x
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="w-px h-6 bg-[#2a2a4a] mx-1" />

      {/* A-B Loop */}
      <div className="flex items-center gap-0.5">
        <button
          onClick={handleSetA}
          className={cn(
            'px-1.5 h-6 rounded text-[10px] font-bold transition-colors',
            localLoopA !== null
              ? 'bg-[#6c63ff]/20 text-[#6c63ff] border border-[#6c63ff]/40'
              : 'bg-[#1a1a3a] text-[#505070] border border-[#2a2a4a] hover:text-[#808098]'
          )}
          aria-label="Set loop start"
        >
          A
        </button>
        <button
          onClick={handleSetB}
          className={cn(
            'px-1.5 h-6 rounded text-[10px] font-bold transition-colors',
            localLoopB !== null
              ? 'bg-[#6c63ff]/20 text-[#6c63ff] border border-[#6c63ff]/40'
              : 'bg-[#1a1a3a] text-[#505070] border border-[#2a2a4a] hover:text-[#808098]'
          )}
          aria-label="Set loop end"
        >
          B
        </button>
        <button
          onClick={handleToggleLoop}
          className={cn(
            'w-6 h-6 flex items-center justify-center rounded transition-colors',
            localLooping
              ? 'bg-[#6c63ff]/20 text-[#6c63ff]'
              : 'text-[#505070] hover:text-[#808098] hover:bg-[#1a1a3a]'
          )}
          aria-label="Toggle loop"
        >
          <Repeat className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Volume */}
      <div className="flex items-center gap-1.5">
        <button
          onClick={handleMuteToggle}
          className="w-7 h-7 flex items-center justify-center rounded hover:bg-[#1a1a3a] transition-colors"
          aria-label={localMuted ? 'Unmute' : 'Mute'}
        >
          {localMuted ? (
            <VolumeX className="w-4 h-4 text-[#ff5252]" />
          ) : (
            <Volume2 className="w-4 h-4 text-[#808098]" />
          )}
        </button>
        <input
          type="range"
          min={0}
          max={100}
          value={localMuted ? 0 : localVolume}
          onChange={handleVolumeChange}
          className="w-20 h-1 appearance-none rounded-full bg-[#2a2a4a] accent-[#6c63ff] cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2.5 [&::-webkit-slider-thumb]:h-2.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#6c63ff]"
          aria-label="Volume"
        />
        <span className="text-[10px] text-[#505070] font-mono w-7 text-right tabular-nums">
          {localMuted ? 0 : localVolume}
        </span>
      </div>
    </div>
  );
}
