import React from 'react';
import styles from './ExportShell.module.css';

export interface ExportShellProps {
  // Add props here
  children?: React.ReactNode;
}

export const ExportShell: React.FC<ExportShellProps> = ({ children }) => {
  return (
    <div className={styles.root}>
      ExportShell (Block Container)
      {children}
    </div>
  );
};
