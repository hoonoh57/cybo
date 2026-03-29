import React from 'react';
import styles from './ClipCard.module.css';

export interface ClipCardProps {
  // Add props here
  children?: React.ReactNode;
}

export const ClipCard: React.FC<ClipCardProps> = ({ children }) => {
  return (
    <div className={styles.root}>
      ClipCard 
      {children}
    </div>
  );
};
