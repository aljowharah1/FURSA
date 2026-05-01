import React from 'react';
import clsx from 'clsx';
import styles from './PageLayout.module.css';

interface PageLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  className?: string;
}

export default function PageLayout({ children, title, subtitle, className }: PageLayoutProps) {
  return (
    <main className={clsx(styles.page, className)}>
      {(title || subtitle) && (
        <div className={styles.heading}>
          {title && <h1 className={styles.title}>{title}</h1>}
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        </div>
      )}
      {children}
    </main>
  );
}
