import React, { useState } from 'react';
import styles from './ProjectCard.module.css';

export interface ProjectCardProps {
    name: string;
    date: string;
    progress: number;
    thumbnail: string;
    duration?: string;
    onClick?: () => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
    name,
    date,
    progress,
    thumbnail,
    duration = '03:24',
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
            <div className={styles.thumbWrap}>
                <img
                    className={`${styles.thumb} ${hovered ? styles.thumbZoom : ''}`}
                    src={thumbnail}
                    alt={name}
                />
                <span className={styles.duration}>{duration}</span>
            </div>
            <div className={styles.info}>
                <h4 className={styles.name}>{name}</h4>
                <p className={styles.date}>{date}</p>
                <div className={styles.progressTrack}>
                    <div
                        className={`${styles.progressBar} ${progress === 100 ? styles.complete : ''}`}
                        style={{ width: `${progress}%` }}
                    />
                </div>
                <p className={styles.progressLabel}>
                    {progress === 100 ? '완료' : `${progress}%`}
                </p>
            </div>
        </div>
    );
};
