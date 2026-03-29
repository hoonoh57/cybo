import React from 'react';
import styles from './AICreatorShell.module.css';

export interface AICreatorShellProps {
  // Add props here
  children?: React.ReactNode;
}

export const AICreatorShell: React.FC<AICreatorShellProps> = ({ children }) => {
  return (
    <div className={styles.root}>
      AICreatorShell (Block Container)
      {children}
    </div>
  );
};
