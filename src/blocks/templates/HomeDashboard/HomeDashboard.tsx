import React from 'react';
import styles from './HomeDashboard.module.css';

export interface HomeDashboardProps {
  // Add props here
  children?: React.ReactNode;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({ children }) => {
  return (
    <div className={styles.root}>
      HomeDashboard (Block Container)
      {children}
    </div>
  );
};
