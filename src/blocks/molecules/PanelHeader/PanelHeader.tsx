import React from 'react';
import styles from './PanelHeader.module.css';

export interface PanelHeaderProps {
  // Add props here
  children?: React.ReactNode;
}

export const PanelHeader: React.FC<PanelHeaderProps> = ({ children }) => {
  return (
    <div className={styles.root}>
      PanelHeader 
      {children}
    </div>
  );
};
