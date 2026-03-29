import React from 'react';
import styles from './Timeline.module.css';

export interface TimelineProps {
  // Add props here
  children?: React.ReactNode;
}

export const Timeline: React.FC<TimelineProps> = ({ children }) => {
  return (
    <div className={styles.root}>
      Timeline (Block Container)
      {children}
    </div>
  );
};
