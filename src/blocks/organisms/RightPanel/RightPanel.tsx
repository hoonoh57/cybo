import React from 'react';
import styles from './RightPanel.module.css';

export interface RightPanelProps {
  // Add props here
  children?: React.ReactNode;
}

export const RightPanel: React.FC<RightPanelProps> = ({ children }) => {
  return (
    <div className={styles.root}>
      RightPanel (Block Container)
      {children}
    </div>
  );
};
