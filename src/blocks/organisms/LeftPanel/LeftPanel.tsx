import React from 'react';
import styles from './LeftPanel.module.css';

export interface LeftPanelProps {
  // Add props here
  children?: React.ReactNode;
}

export const LeftPanel: React.FC<LeftPanelProps> = ({ children }) => {
  return (
    <div className={styles.root}>
      LeftPanel (Block Container)
      {children}
    </div>
  );
};
