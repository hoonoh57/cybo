import React from 'react';
import styles from './TrackLane.module.css';

export interface TrackLaneProps {
  trackType: 'main' | 'subtitle' | 'bgm' | 'effect' | 'overlay';
  widthPx: number;
  children?: React.ReactNode;
}

export const TrackLane: React.FC<TrackLaneProps> = ({ trackType, widthPx, children }) => (
  <div
    className={`${styles.root} ${trackType === 'main' ? styles.main : styles.sub}`}
    style={{ width: `${widthPx}px` }}
  >
    {children}
  </div>
);