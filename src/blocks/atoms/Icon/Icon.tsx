import React from 'react';
import styles from './Icon.module.css';

export interface IconProps {
  // Add props here
  children?: React.ReactNode;
}

export const Icon: React.FC<IconProps> = ({ children }) => {
  return (
    <div className={styles.root}>
      Icon 
      {children}
    </div>
  );
};
