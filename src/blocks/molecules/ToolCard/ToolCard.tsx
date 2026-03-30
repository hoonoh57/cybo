import React, { useState } from 'react';
import styles from './ToolCard.module.css';

export interface ToolCardProps {
    icon: string;
    label: string;
    onClick?: () => void;
}

export const ToolCard: React.FC<ToolCardProps> = ({ icon, label, onClick }) => {
    const [hovered, setHovered] = useState(false);

    return (
        <div
            className={`${styles.root} ${hovered ? styles.hovered : ''}`}
            onClick={onClick}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <span className={styles.icon}>{icon}</span>
            <span className={styles.label}>{label}</span>
        </div>
    );
};
