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