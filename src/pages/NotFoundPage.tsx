import { useLocation, useNavigate } from 'react-router-dom';
import styles from './NotFoundPage.module.css';

export default function NotFoundPage() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className={styles.page}>
      <div className={styles.content}>
        <div className={styles.code}>404</div>
        <h1 className={styles.heading}>Nothing here.</h1>
        <p className={styles.description}>
          The page you're looking for doesn't exist or has been moved.
        </p>
        <button className={styles.btn} onClick={() => navigate('/')}>
          ← Back to Discover
        </button>
        <div className={styles.path}>{location.pathname}</div>
      </div>
    </div>
  );
}
