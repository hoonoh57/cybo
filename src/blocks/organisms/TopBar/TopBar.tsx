import React from 'react';
import styles from './TopBar.module.css';

export interface TopBarProps {
  appName?: string;
  userInitial?: string;
}

export const TopBar: React.FC<TopBarProps> = ({
  appName = 'AI-Studio',
  userInitial = 'U',
}) => {
  return (
    <header className={styles.root}>
      <div className={styles.brand}>
        <div className={styles.logo}>▶</div>
        <span className={styles.name}>{appName}</span>
      </div>
      <div className={styles.avatar}>{userInitial}</div>
    </header>
  );
};
