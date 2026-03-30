import React from 'react';
import styles from './TimelineToolbar.module.css';

export interface TimelineToolbarProps {
  onAction?: (action: string) => void;
}

const tools = [
  { id: 'undo', label: 'Undo', icon: 'U' },
  { id: 'redo', label: 'Redo', icon: 'R' },
  { id: 'split', label: 'Split', icon: 'X' },
  { id: 'delete', label: 'Delete', icon: 'D' },
  { id: 'speed', label: 'Speed', icon: 'S' },
  { id: 'crop', label: 'Crop', icon: 'C' },
  { id: 'zoomfit', label: 'Zoom-fit', icon: 'Z' },
];

export const TimelineToolbar: React.FC<TimelineToolbarProps> = ({ onAction }) => (
  <div className={styles.root}>
    {tools.map((t) => (
      <button key={t.id} className={styles.btn} title={t.label} onClick={() => onAction?.(t.id)}>
        {t.icon}
      </button>
    ))}
  </div>
);
