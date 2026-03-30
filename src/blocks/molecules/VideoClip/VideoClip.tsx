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
      <div className={styles.thumbnail}>?렏</div>
      <div className={styles.info}>
        <span className={styles.name}>{name}</span>
        <span className={styles.time}>{formatTime(duration)}</span>
      </div>
      {hovered && <div className={styles.resizeHandle} data-side="right" />}
    </div>
  );
};