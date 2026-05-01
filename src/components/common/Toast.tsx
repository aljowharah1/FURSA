import clsx from 'clsx';
import { useAppContext } from '../../context/AppContext';
import styles from './Toast.module.css';

type ToastType = 'success' | 'error' | 'info' | 'warning';

const ICONS: Record<ToastType, string> = {
  success: '\u2705',
  error: '\u274C',
  info: '\u2139\uFE0F',
  warning: '\u26A0\uFE0F',
};

export default function ToastContainer() {
  const { toasts, removeToast } = useAppContext();

  if (toasts.length === 0) return null;

  return (
    <div className={styles.container}>
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={clsx(styles.toast, styles[toast.type])}
          role="alert"
        >
          <span className={styles.icon}>{ICONS[toast.type]}</span>
          <span className={styles.message}>{toast.message}</span>
          <button
            className={styles.close}
            onClick={() => removeToast(toast.id)}
            aria-label="Dismiss"
          >
            &times;
          </button>
          <div className={styles.progress} />
        </div>
      ))}
    </div>
  );
}
