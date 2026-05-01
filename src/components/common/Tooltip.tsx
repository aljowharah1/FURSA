import React, { useState } from 'react';
import styles from './Tooltip.module.css';

interface TooltipProps {
  content: string;
  children: React.ReactNode;
}

export default function Tooltip({ content, children }: TooltipProps) {
  const [visible, setVisible] = useState(false);

  return (
    <span
      className={styles.wrapper}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onFocus={() => setVisible(true)}
      onBlur={() => setVisible(false)}
    >
      {children}
      {visible && (
        <span className={styles.tooltip} role="tooltip">
          {content}
          <span className={styles.arrow} />
        </span>
      )}
    </span>
  );
}
