import React from 'react';
import styles from './TabItem.module.css';

export interface TabItemProps {
  // Add props here
  children?: React.ReactNode;
}

export const TabItem: React.FC<TabItemProps> = ({ children }) => {
  return (
    <div className={styles.root}>
      TabItem 
      {children}
    </div>
  );
};
