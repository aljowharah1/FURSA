import React from 'react';
import clsx from 'clsx';
import styles from './Checkbox.module.css';

interface CheckboxProps {
  label: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  disabled?: boolean;
}

export default function Checkbox({
  label,
  checked,
  onChange,
  className,
  disabled = false,
}: CheckboxProps) {
  return (
    <label className={clsx(styles.wrapper, disabled && styles.disabled, className)}>
      <input
        type="checkbox"
        className={styles.input}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
      />
      <span className={clsx(styles.box, checked && styles.checked)}>
        {checked && (
          <svg className={styles.check} viewBox="0 0 12 10" fill="none">
            <path
              d="M1 5L4.5 8.5L11 1.5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </span>
      <span className={styles.label}>{label}</span>
    </label>
  );
}
