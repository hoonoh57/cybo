import React from 'react';
import styles from './ZoomSlider.module.css';

export interface ZoomSliderProps {
  zoom: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
}

export const ZoomSlider: React.FC<ZoomSliderProps> = ({ zoom, min = 50, max = 400, onChange }) => (
  <div className={styles.root}>
    <span className={styles.label}>{min}%</span>
    <input
      type="range"
      min={min}
      max={max}
      value={zoom}
      onChange={(e) => onChange(Number(e.target.value))}
      className={styles.slider}
    />
    <span className={styles.label}>{max}%</span>
    <span className={styles.value}>{zoom}%</span>
  </div>
);