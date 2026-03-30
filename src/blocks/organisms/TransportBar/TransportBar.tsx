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
        {isPlaying ? 'II' : '>'}
      </button>
      <div className={styles.right}>
        <span className={styles.duration}>{formatTimecode(totalDuration)}</span>
        <div className={styles.speedWrap}>
          <button className={styles.speedBtn} onClick={() => setShowDropdown(!showDropdown)}>
            {speed} v
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
