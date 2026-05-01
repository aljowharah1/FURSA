import React from 'react';
import type { ChatMessage as ChatMessageType } from '../../types';
import styles from './ChatMessage.module.css';

interface ChatMessageProps {
  message: ChatMessageType;
}

function formatTime(timestamp: string): string {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';

  return (
    <div className={`${styles.wrapper} ${isUser ? styles.user : styles.assistant}`}>
      {/* Avatar */}
      <div className={`${styles.avatar} ${isUser ? styles.avatarUser : styles.avatarAI}`}>
        {isUser ? (
          <span className={styles.avatarInitial}>U</span>
        ) : (
          <svg className={styles.robotIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="11" width="18" height="10" rx="2" />
            <circle cx="12" cy="5" r="3" />
            <line x1="12" y1="8" x2="12" y2="11" />
            <circle cx="8" cy="16" r="1.5" fill="currentColor" />
            <circle cx="16" cy="16" r="1.5" fill="currentColor" />
          </svg>
        )}
      </div>

      <div className={styles.content}>
        {/* Bubble */}
        <div className={`${styles.bubble} ${isUser ? styles.bubbleUser : styles.bubbleAssistant}`}>
          <p className={styles.text}>{message.content}</p>
        </div>

        {/* Action buttons */}
        {message.actions && message.actions.length > 0 && (
          <div className={styles.actions}>
            {message.actions.map((action) => (
              <button key={action.id} className={styles.actionBtn}>
                {action.icon && <span className={styles.actionIcon}>{action.icon}</span>}
                {action.label}
              </button>
            ))}
          </div>
        )}

        {/* Timestamp */}
        <span className={`${styles.timestamp} ${isUser ? styles.timestampUser : ''}`}>
          {formatTime(message.timestamp)}
        </span>
      </div>
    </div>
  );
}
