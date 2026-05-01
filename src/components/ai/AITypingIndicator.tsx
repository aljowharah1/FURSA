import React from 'react';
import styles from './AITypingIndicator.module.css';

export default function AITypingIndicator() {
  return (
    <div className={styles.wrapper}>
      {/* AI avatar */}
      <div className={styles.avatar}>
        <svg className={styles.robotIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="11" width="18" height="10" rx="2" />
          <circle cx="12" cy="5" r="3" />
          <line x1="12" y1="8" x2="12" y2="11" />
          <circle cx="8" cy="16" r="1.5" fill="currentColor" />
          <circle cx="16" cy="16" r="1.5" fill="currentColor" />
        </svg>
      </div>

      <div className={styles.content}>
        <div className={styles.bubble}>
          <span className={styles.dot} />
          <span className={styles.dot} />
          <span className={styles.dot} />
        </div>
        <span className={styles.label}>CareerMate AI is thinking...</span>
      </div>
    </div>
  );
}
