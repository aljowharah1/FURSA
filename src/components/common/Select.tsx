import React from 'react';
import clsx from 'clsx';
import styles from './Select.module.css';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  label?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: SelectOption[];
  placeholder?: string;
  className?: string;
  required?: boolean;
  disabled?: boolean;
}

export default function Select({
  label,
  value,
  onChange,
  options,
  placeholder,
  className,
  required = false,
  disabled = false,
}: SelectProps) {
  return (
    <div className={clsx(styles.wrapper, className)}>
      {label && (
        <label className={styles.label}>
          {label}
          {required && <span className={styles.required}>*</span>}
        </label>
      )}
      <div className={styles.selectWrap}>
        <select
          className={styles.select}
          value={value}
          onChange={onChange}
          required={required}
          disabled={disabled}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <span className={styles.arrow}>&#9662;</span>
      </div>
    </div>
  );
}
