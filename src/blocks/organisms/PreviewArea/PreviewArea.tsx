import React from 'react';
import styles from './PreviewArea.module.css';

export interface PreviewAreaProps {
  // Add props here
  children?: React.ReactNode;
}

export const PreviewArea: React.FC<PreviewAreaProps> = ({ children }) => {
  return (
    <div className={styles.root}>
      PreviewArea (Block Container)
      {children}
    </div>
  );
};
