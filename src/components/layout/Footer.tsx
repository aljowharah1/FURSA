import { Link } from 'react-router-dom';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <span className={styles.copy}>
          &copy; 2026 PSU Software Engineering Group Project
        </span>
        <Link to="/about" className={styles.link}>
          About
        </Link>
      </div>
    </footer>
  );
}
