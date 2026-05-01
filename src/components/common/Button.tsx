import React from 'react';
import clsx from 'clsx';
import styles from './Button.module.css';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost' | 'icon';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  icon?: React.ReactNode;
}

export default function Button({
  variant = 'primary',
  size = 'md',
  children,
  onClick,
  disabled = false,
  className,
  type = 'button',
  icon,
}: ButtonProps) {
  return (
    <button
      type={type}
      className={clsx(
        styles.button,
        styles[variant],
        styles[size],
        disabled && styles.disabled,
        className
      )}
      onClick={onClick}
      disabled={disabled}
    >
      {icon && <span className={styles.icon}>{icon}</span>}
      {variant !== 'icon' && children}
    </button>
  );
}
