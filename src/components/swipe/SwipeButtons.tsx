import React from 'react';
import styles from './SwipeButtons.module.css';

interface SwipeButtonsProps {
  onPass: () => void;
  onInfo: () => void;
  onApply: () => void;
  disabled?: boolean;
}

export default function SwipeButtons({ onPass, onInfo, onApply, disabled = false }: SwipeButtonsProps) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.buttons}>
        <button className={`${styles.btn} ${styles.pass}`} onClick={onPass} disabled={disabled} aria-label="Pass">
          <span className={styles.btnIcon}>✕</span>
          <span className={styles.btnLabel}>Pass</span>
        </button>
        <button className={`${styles.btn} ${styles.info}`} onClick={onInfo} disabled={disabled} aria-label="Details">
          <span className={styles.btnIcon}>i</span>
          <span className={styles.btnLabel}>Info</span>
        </button>
        <button className={`${styles.btn} ${styles.apply}`} onClick={onApply} disabled={disabled} aria-label="Apply">
          <span className={styles.btnIcon}>✓</span>
          <span className={styles.btnLabel}>Apply</span>
        </button>
      </div>
    </div>
  );
}
