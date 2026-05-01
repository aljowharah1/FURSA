import type { UserProfile } from '../../types';
import styles from './ProfileHeader.module.css';

interface ProfileHeaderProps {
  profile: UserProfile;
  onEdit: () => void;
}

export default function ProfileHeader({ profile, onEdit }: ProfileHeaderProps) {
  const initials = profile.name
    ? profile.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : '?';

  return (
    <div className={styles.header}>
      <div className={styles.avatar}>
        {profile.photoUrl ? (
          <img src={profile.photoUrl} alt={profile.name} />
        ) : (
          initials
        )}
      </div>
      <div className={styles.info}>
        <h2 className={styles.name}>{profile.name || 'Your Name'}</h2>
        <div className={styles.detail}>
          {profile.university || 'University'} - {profile.major || 'Major'}
        </div>
        <div className={styles.email}>{profile.email || 'email@example.com'}</div>
      </div>
      <button className={styles.editBtn} onClick={onEdit}>
        Edit Profile
      </button>
    </div>
  );
}
