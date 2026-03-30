import React from 'react';
import styles from './TimelineRuler.module.css';

export interface TimelineRulerProps {
  totalDuration: number;
  pixelsPerSecond: number;
  onClick?: (time: number) => void;
}

function formatRulerTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export const TimelineRuler: React.FC<TimelineRulerProps> = ({ totalDuration, pixelsPerSecond, onClick }) => {
  const majorMarks: number[] = [];
  for (let i = 0; i <= totalDuration; i += 30) majorMarks.push(i);

  const tickMarks: number[] = [];
  for (let i = 0; i <= totalDuration; i += 5) tickMarks.push(i);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!onClick) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const time = Math.max(0, Math.min(x / pixelsPerSecond, totalDuration));
    onClick(time);
  };

  return (
    <div className={styles.root} onClick={handleClick} style={{ width: `${totalDuration * pixelsPerSecond}px` }}>
      {tickMarks.map((t) => (
        <div key={`t-${t}`} className={styles.tick} style={{ left: `${t * pixelsPerSecond}px` }} />
      ))}
      {majorMarks.map((t) => (
        <div key={`m-${t}`} className={styles.major} style={{ left: `${t * pixelsPerSecond}px` }}>
          <span className={styles.label}>{formatRulerTime(t)}</span>
          <div className={styles.majorTick} />
        </div>
      ))}
    </div>
  );
};