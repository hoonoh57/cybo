import React from 'react';
import styles from './TopBar.module.css';

export interface TopBarProps {
  // Add props here
  children?: React.ReactNode;
}

export const TopBar: React.FC<TopBarProps> = ({ children }) => {
  return (
    <div className={styles.root}>
      TopBar 
      {children}
    </div>
  );
};
