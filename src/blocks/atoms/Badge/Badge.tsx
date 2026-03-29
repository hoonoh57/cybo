import React from 'react';
import styles from './Badge.module.css';

export interface BadgeProps {
  // Add props here
  children?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({ children }) => {
  return (
    <div className={styles.root}>
      Badge 
      {children}
    </div>
  );
};
