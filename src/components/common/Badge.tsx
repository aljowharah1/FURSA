import clsx from 'clsx';
import styles from './Badge.module.css';

type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info' | 'purple';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  className?: string;
}

export default function Badge({ label, variant = 'default', className }: BadgeProps) {
  return (
    <span className={clsx(styles.badge, styles[variant], className)}>
      {label}
    </span>
  );
}
