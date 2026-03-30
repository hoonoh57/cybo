import React, { useState } from 'react';
import styles from './ActionCard.module.css';

export interface ActionCardProps {
    icon: string;
    title: string;
    subtitle: string;
    variant?: 'gradient' | 'surface';
    onClick?: () => void;
}

export const ActionCard: React.FC<ActionCardProps> = ({
    icon,
    title,
    subtitle,
    variant = 'surface',
    onClick,
}) => {
    const [hovered, setHovered] = useState(false);

    const rootClass = [
        styles.root,
        styles[variant],
        hovered ? styles.hovered : '',
    ].join(' ');

    return (
        <div
            className={rootClass}
            onClick={onClick}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <div className={styles.decorCircle1} />
            <div className={styles.decorCircle2} />
            <span className={styles.icon}>{icon}</span>
            <h2 className={styles.title}>{title}</h2>
            <p className={styles.subtitle}>{subtitle}</p>
        </div>
    );
};
