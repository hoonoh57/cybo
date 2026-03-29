import React from 'react';
import styles from './EditorShell.module.css';

export interface EditorShellProps {
  // Add props here
  children?: React.ReactNode;
}

export const EditorShell: React.FC<EditorShellProps> = ({ children }) => {
  return (
    <div className={styles.root}>
      EditorShell (Block Container)
      {children}
    </div>
  );
};
