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