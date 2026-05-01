import React from 'react';
import styles from './AIInsightPanel.module.css';

interface AIInsightPanelProps {
  title: string;
  icon: React.ReactNode;
  content: string | string[];
  action?: { label: string; onClick: () => void };
}

export default function AIInsightPanel({ title, icon, content, action }: AIInsightPanelProps) {
  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <span className={styles.icon}>{icon}</span>
        <h3 className={styles.title}>{title}</h3>
      </div>

      <div className={styles.body}>
        {typeof content === 'string' ? (
          <p className={styles.text}>{content}</p>
        ) : (
          <ul className={styles.list}>
            {content.map((item, i) => (
              <li key={i} className={styles.listItem}>
                {item}
              </li>
            ))}
          </ul>
        )}
      </div>

      {action && (
        <button className={styles.actionBtn} onClick={action.onClick}>
          {action.label}
        </button>
      )}
    </div>
  );
}
