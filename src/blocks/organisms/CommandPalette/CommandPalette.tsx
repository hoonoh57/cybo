import React from 'react';
import styles from './CommandPalette.module.css';

export interface CommandPaletteProps {
  // Add props here
  children?: React.ReactNode;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ children }) => {
  return (
    <div className={styles.root}>
      CommandPalette 
      {children}
    </div>
  );
};
