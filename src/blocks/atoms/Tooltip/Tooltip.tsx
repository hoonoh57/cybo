import React from 'react';
import styles from './Tooltip.module.css';

export interface TooltipProps {
  // Add props here
  children?: React.ReactNode;
}

export const Tooltip: React.FC<TooltipProps> = ({ children }) => {
  return (
    <div className={styles.root}>
      Tooltip 
      {children}
    </div>
  );
};
