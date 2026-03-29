import React from 'react';
import styles from './StatusBar.module.css';

export interface StatusBarProps {
  // Add props here
  children?: React.ReactNode;
}

export const StatusBar: React.FC<StatusBarProps> = ({ children }) => {
  return (
    <div className={styles.root}>
      StatusBar 
      {children}
    </div>
  );
};
