import React, { useEffect } from 'react';
import { Internship } from '../../types';
import MatchScore from './MatchScore';
import styles from './InternshipDetail.module.css';

interface InternshipDetailProps {
  internship: Internship;
  onClose: () => void;
  onApply: (internship: Internship) => void;
  onPass: (internship: Internship) => void;
}

const STATUS_CLASS: Record<string, string> = {
  Open: styles.statusOpen,
  'Closing Soon': styles.statusClosing,
  Closed: styles.statusClosed,
};

function companyColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const h = Math.abs(hash) % 360;
  return `hsl(${h}, 55%, 48%)`;
}

export default function InternshipDetail({
  internship,
  onClose,
  onApply,
  onPass,
}: InternshipDetailProps) {
  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  // Determine matched vs missing requirements
  const matchedReqs = internship.requirements.filter(
    (r) => !internship.missingRequirements.includes(r)
  );

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.logo} style={{ background: companyColor(internship.company) }}>
            {internship.company.charAt(0)}
          </div>
          <div className={styles.headerInfo}>
            <p className={styles.company}>{internship.company}</p>
            <h2 className={styles.title}>{internship.title}</h2>
          </div>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
            &#x2715;
          </button>
        </div>

        {/* Meta */}
        <div className={styles.meta}>
          <span className={styles.metaItem}>&#x1F4CD; {internship.location}</span>
          <span className={styles.metaItem}>&#x1F4C5; {internship.duration}</span>
          {internship.salary && (
            <span className={styles.metaItem}>&#x1F4B0; {internship.salary}</span>
          )}
          <span className={styles.metaItem}>&#x23F3; {internship.deadline}</span>
          <span className={`${styles.statusBadge} ${STATUS_CLASS[internship.status] || ''}`}>
            {internship.status}
          </span>
        </div>

        {/* Match score */}
        <div className={styles.matchSection}>
          <MatchScore score={internship.matchScore} size="md" />
          <div>
            <p className={styles.matchLabel}>Match Score</p>
            <p className={styles.matchSub}>
              {internship.matchReasons.slice(0, 2).join(' / ')}
            </p>
          </div>
        </div>

        {/* Description */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Description</h3>
          <p className={styles.description}>{internship.description}</p>
        </div>

        {/* Requirements */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Requirements</h3>
          <ul className={styles.list}>
            {matchedReqs.map((r) => (
              <li key={r} className={styles.listItem}>
                <span className={`${styles.listIcon} ${styles.matched}`}>&#10003;</span>
                {r}
              </li>
            ))}
            {internship.missingRequirements.map((r) => (
              <li key={r} className={styles.listItem}>
                <span className={`${styles.listIcon} ${styles.missing}`}>&#9888;</span>
                {r}
              </li>
            ))}
          </ul>
        </div>

        {/* Perks */}
        {internship.perks.length > 0 && (
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Perks</h3>
            <ul className={styles.list}>
              {internship.perks.map((p) => (
                <li key={p} className={styles.listItem}>
                  <span className={`${styles.listIcon} ${styles.perkIcon}`}>&#9733;</span>
                  {p}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* AI Recommendation */}
        {internship.aiRecommendation && (
          <div className={styles.section}>
            <div className={styles.aiBox}>
              <p className={styles.aiLabel}>&#x2728; AI Recommendation</p>
              <p className={styles.aiText}>{internship.aiRecommendation}</p>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className={styles.footer}>
          <button className={styles.btnPass} onClick={() => onPass(internship)}>
            Pass
          </button>
          <button className={styles.btnApply} onClick={() => onApply(internship)}>
            Apply Now
          </button>
        </div>
      </div>
    </div>
  );
}
