import React from 'react';
import styles from './TrackHeader.module.css';

export interface TrackHeaderProps {
  // Add props here
  children?: React.ReactNode;
}

export const TrackHeader: React.FC<TrackHeaderProps> = ({ children }) => {
  return (
    <div className={styles.root}>
      TrackHeader 
      {children}
    </div>
  );
};
