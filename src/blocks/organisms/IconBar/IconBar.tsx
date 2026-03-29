import React from 'react';
import styles from './IconBar.module.css';

export interface IconBarProps {
  // Add props here
  children?: React.ReactNode;
}

export const IconBar: React.FC<IconBarProps> = ({ children }) => {
  return (
    <div className={styles.root}>
      IconBar 
      {children}
    </div>
  );
};
