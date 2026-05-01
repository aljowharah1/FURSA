import clsx from 'clsx';
import styles from './Avatar.module.css';

type AvatarSize = 'sm' | 'md' | 'lg';

interface AvatarProps {
  src?: string;
  name?: string;
  size?: AvatarSize;
  className?: string;
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export default function Avatar({ src, name, size = 'md', className }: AvatarProps) {
  return (
    <div className={clsx(styles.avatar, styles[size], className)} title={name}>
      {src ? (
        <img className={styles.image} src={src} alt={name || 'Avatar'} />
      ) : (
        <span className={styles.initials}>
          {name ? getInitials(name) : '?'}
        </span>
      )}
    </div>
  );
}
