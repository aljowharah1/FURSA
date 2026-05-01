import styles from './EmptyState.module.css';
import Button from './Button';

interface EmptyStateProps {
  icon: string;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export default function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className={styles.wrapper}>
      <span className={styles.icon}>{icon}</span>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.description}>{description}</p>
      {action && (
        <Button variant="primary" size="md" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  );
}
