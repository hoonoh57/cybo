import React from 'react';
import styles from './SecurityBadge.module.css';

export interface SecurityBadgeProps {
    label?: string;
}

export const SecurityBadge: React.FC<SecurityBadgeProps> = ({
    label = '🔒 100% Local Processing - No Cloud',
}) => {
    return (
        <div className={styles.wrapper}>
            <div className={styles.badge}>{label}</div>
        </div>
    );
};
