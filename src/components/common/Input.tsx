import React from 'react';
import clsx from 'clsx';
import styles from './Input.module.css';

interface InputProps {
  label?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
  error?: string;
  required?: boolean;
  icon?: React.ReactNode;
  className?: string;
  name?: string;
  disabled?: boolean;
}

export default function Input({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  error,
  required = false,
  icon,
  className,
  name,
  disabled = false,
}: InputProps) {
  return (
    <div className={clsx(styles.wrapper, className)}>
      {label && (
        <label className={styles.label}>
          {label}
          {required && <span className={styles.required}>*</span>}
        </label>
      )}
      <div className={clsx(styles.inputWrap, error && styles.hasError)}>
        {icon && <span className={styles.icon}>{icon}</span>}
        <input
          className={styles.input}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          name={name}
          disabled={disabled}
        />
      </div>
      {error && <span className={styles.error}>{error}</span>}
    </div>
  );
}
