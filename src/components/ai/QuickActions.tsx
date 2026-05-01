import React from 'react';
import styles from './QuickActions.module.css';

interface QuickActionsProps {
  onAction: (actionType: string) => void;
}

const ACTIONS = [
  { type: 'optimize_cv', label: 'Optimize my CV', icon: '\u{1F4C4}' },
  { type: 'review_applications', label: 'Review my applications', icon: '\u{1F4CB}' },
  { type: 'find_roles', label: 'Find specific roles', icon: '\u{1F50D}' },
  { type: 'analytics', label: 'Application analytics', icon: '\u{1F4CA}' },
  { type: 'interview_prep', label: 'Interview prep tips', icon: '\u{1F3AF}' },
];

export default function QuickActions({ onAction }: QuickActionsProps) {
  return (
    <div className={styles.container}>
      <div className={styles.scrollRow}>
        {ACTIONS.map((action) => (
          <button
            key={action.type}
            className={styles.chip}
            onClick={() => onAction(action.type)}
          >
            <span className={styles.chipIcon}>{action.icon}</span>
            <span className={styles.chipLabel}>{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
