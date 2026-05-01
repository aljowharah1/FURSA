import { NavLink } from 'react-router-dom';
import styles from './BottomNav.module.css';

const TABS = [
  { to: '/', label: 'Discover', glyph: '◈', end: true },
  { to: '/track', label: 'Track', glyph: '≡' },
  { to: '/ai-chat', label: 'Mate', glyph: 'M' },
  { to: '/profile', label: 'Profile', glyph: '○' },
];

export default function BottomNav() {
  return (
    <nav className={styles.bottomNav}>
      {TABS.map((tab) => (
        <NavLink
          key={tab.to}
          to={tab.to}
          end={tab.end}
          className={({ isActive }) =>
            `${styles.tab} ${isActive ? styles.active : ''}`
          }
        >
          <span className={styles.glyph}>{tab.glyph}</span>
          <span className={styles.label}>{tab.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
