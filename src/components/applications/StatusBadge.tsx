import type { Application } from '../../types';
import { getStatusLabel } from '../../utils/formatters';
import styles from './StatusBadge.module.css';

interface StatusBadgeProps {
  status: Application['status'];
}

const statusClassMap: Record<Application['status'], string> = {
  Saved: styles.saved,
  Needs_Manual_Action: styles.needsManualAction,
  Auto_Applied: styles.autoApplied,
  Submitted: styles.submitted,
  Under_Review: styles.underReview,
  Interview_Scheduled: styles.interviewScheduled,
  Offer_Received: styles.offerReceived,
  Accepted: styles.accepted,
  Rejected: styles.rejected,
  Withdrawn: styles.withdrawn,
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span className={`${styles.badge} ${statusClassMap[status] || styles.saved}`}>
      <span className={styles.dot} />
      {getStatusLabel(status)}
    </span>
  );
}
