import React from 'react';
import styles from './Button.module.css';

export interface ButtonProps {
  label: string;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  label, 
  variant = 'primary', 
  size = 'md', 
  onClick, 
  disabled = false 
}) => {
  const className = [
    styles.root,
    styles[variant],
    styles[size],
  ].join(' ');

  return (
    <button className={className} onClick={onClick} disabled={disabled}>
      {label}
    </button>
  );
};
