import React from 'react';
import styles from './QuickToolbar.module.css';

export interface QuickToolbarProps {
  // Add props here
  children?: React.ReactNode;
}

export const QuickToolbar: React.FC<QuickToolbarProps> = ({ children }) => {
  return (
    <div className={styles.root}>
      QuickToolbar 
      {children}
    </div>
  );
};
