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