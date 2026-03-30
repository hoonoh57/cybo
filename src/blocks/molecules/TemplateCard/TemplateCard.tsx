import React, { useState } from 'react';
import styles from './TemplateCard.module.css';

export interface TemplateCardProps {
    icon: string;
    label: string;
    accentColor?: string;
    onClick?: () => void;
}

export const TemplateCard: React.FC<TemplateCardProps> = ({
    icon,
    label,
    accentColor = 'var(--cybo-accent)',
    onClick,
}) => {
    const [hovered, setHovered] = useState(false);

    return (
        <div
            className={`${styles.root} ${hovered ? styles.hovered : ''}`}
            onClick={onClick}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <div
                className={styles.topAccent}
                style={{
                    background: accentColor,
                    opacity: hovered ? 1 : 0,
                }}
            />
            <span className={styles.icon}>{icon}</span>
            <span className={styles.label}>{label}</span>
        </div>
    );
};
