import React from 'react';
import styles from './SectionTitle.module.css';

export interface SectionTitleProps {
    title: string;
    actionLabel?: string;
    onAction?: () => void;
}

export const SectionTitle: React.FC<SectionTitleProps> = ({
    title,
    actionLabel = '모두 보기 →',
    onAction,
}) => {
    return (
        <div className={styles.root}>
            <h3 className={styles.title}>{title}</h3>
            {actionLabel && (
                <span className={styles.action} onClick={onAction}>
                    {actionLabel}
                </span>
            )}
        </div>
    );
};
