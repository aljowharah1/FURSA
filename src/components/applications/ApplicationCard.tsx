import type { Application } from '../../types';
import { formatDate, formatDateTime, daysUntil } from '../../utils/dateHelpers';
import StatusBadge from './StatusBadge';
import styles from './ApplicationCard.module.css';

interface ApplicationCardProps {
  application: Application;
  onClick: (application: Application) => void;
}

const COMPANY_COLORS = [
  '#6366f1', '#ec4899', '#f59e0b', '#10b981', '#3b82f6',
  '#8b5cf6', '#ef4444', '#14b8a6', '#f97316', '#06b6d4',
];

function getCompanyColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return COMPANY_COLORS[Math.abs(hash) % COMPANY_COLORS.length];
}

export default function ApplicationCard({ application, onClick }: ApplicationCardProps) {
  const { internship, status, confidenceScore } = application;
  const deadlineDays = daysUntil(application.deadlineDate);
  const isMuted = status === 'Rejected' || status === 'Withdrawn';

  return (
    <div
      className={`${styles.card} ${isMuted ? styles.cardMuted : ''}`}
      onClick={() => onClick(application)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter') onClick(application); }}
    >
      <div
        className={styles.companyIcon}
        style={{ background: getCompanyColor(internship.company) }}
      >
        {internship.company.charAt(0).toUpperCase()}
      </div>

      <div className={styles.body}>
        <div className={styles.topRow}>
          <div>
            <div className={styles.company}>{internship.company}</div>
            <div className={styles.title}>{internship.title}</div>
          </div>
          <StatusBadge status={status} />
        </div>

        <div className={styles.meta}>
          {application.appliedDate && (
            <span className={styles.metaItem}>
              <span className={styles.metaIcon}>&#128197;</span>
              Applied {formatDate(application.appliedDate)}
            </span>
          )}
          <span className={styles.metaItem}>
            <span className={styles.metaIcon}>&#9200;</span>
            {deadlineDays > 0 ? `${deadlineDays}d left` : 'Deadline passed'}
          </span>
          <span className={styles.matchScore}>
            <span className={styles.metaIcon}>&#9733;</span>
            {confidenceScore}% match
          </span>
        </div>

        {/* Status-specific extra info */}
        {status === 'Needs_Manual_Action' && (
          <div className={styles.extraInfo}>
            <ul className={styles.missingItems}>
              {!application.coverLetter && (
                <li className={styles.missingItem}>Cover letter required</li>
              )}
              {application.notes && (
                <li className={styles.missingItem}>{application.notes.split('.')[0]}</li>
              )}
            </ul>
            <button
              className={styles.actionBtn}
              onClick={(e) => { e.stopPropagation(); onClick(application); }}
            >
              Complete Application
            </button>
          </div>
        )}

        {status === 'Auto_Applied' && (
          <div className={styles.extraInfo}>
            <span className={styles.aiMessage}>
              Applied automatically on {application.appliedDate ? formatDate(application.appliedDate) : 'N/A'}
            </span>
          </div>
        )}

        {status === 'Interview_Scheduled' && application.interviewDate && (
          <div className={styles.extraInfo}>
            <div className={styles.interviewInfo}>
              <span className={styles.metaItem}>
                <span className={styles.metaIcon}>&#128221;</span>
                {application.interviewType} Interview
              </span>
              <span className={styles.metaItem}>
                <span className={styles.metaIcon}>&#128197;</span>
                {formatDateTime(application.interviewDate)}
              </span>
              {application.interviewLocation && (
                <span className={styles.metaItem}>
                  <span className={styles.metaIcon}>&#128205;</span>
                  {application.interviewLocation.length > 40
                    ? application.interviewLocation.slice(0, 40) + '...'
                    : application.interviewLocation}
                </span>
              )}
            </div>
            <button
              className={styles.prepareBtn}
              onClick={(e) => { e.stopPropagation(); onClick(application); }}
              style={{ marginTop: 10 }}
            >
              Prepare for Interview
            </button>
          </div>
        )}

        {status === 'Accepted' && (
          <div className={styles.extraInfo}>
            <span className={styles.offerDetails}>
              {application.offerSalary && `Offer: ${application.offerSalary}`}
              {application.offerStartDate && ` | Start: ${formatDate(application.offerStartDate)}`}
            </span>
          </div>
        )}

        {status === 'Rejected' && application.rejectionReason && (
          <div className={styles.extraInfo}>
            <span className={styles.rejectionReason}>
              {application.rejectionReason.length > 100
                ? application.rejectionReason.slice(0, 100) + '...'
                : application.rejectionReason}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
