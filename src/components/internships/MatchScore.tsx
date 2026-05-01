import React from 'react';
import styles from './MatchScore.module.css';

interface MatchScoreProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
}

const SIZES: Record<string, number> = { sm: 40, md: 64, lg: 96 };
const RADIUS = 18; // fits inside a 0-40 viewBox
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function MatchScore({ score, size = 'md' }: MatchScoreProps) {
  const clamped = Math.max(0, Math.min(100, score));
  const offset = CIRCUMFERENCE - (clamped / 100) * CIRCUMFERENCE;

  const colorClass =
    clamped >= 80 ? styles.green : clamped >= 60 ? styles.orange : styles.red;

  const dim = SIZES[size];

  return (
    <div className={`${styles.wrapper} ${styles[size]}`} style={{ width: dim, height: dim }}>
      <svg className={styles.svg} viewBox="0 0 40 40">
        <circle className={styles.trackCircle} cx="20" cy="20" r={RADIUS} />
        <circle
          className={`${styles.progressCircle} ${colorClass}`}
          cx="20"
          cy="20"
          r={RADIUS}
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={offset}
        />
      </svg>
      <span className={`${styles.label} ${styles[size]}`}>{clamped}</span>
    </div>
  );
}
