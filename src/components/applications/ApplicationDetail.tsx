import { useState } from 'react';
import type { Application } from '../../types';
import { formatDate } from '../../utils/dateHelpers';
import StatusBadge from './StatusBadge';
import ApplicationTimeline from './ApplicationTimeline';
import styles from './ApplicationDetail.module.css';

interface ApplicationDetailProps {
  application: Application;
  onUpdate: (id: string, data: Partial<Application>) => void;
  onDelete: (id: string) => void;
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

const ALL_STATUSES: Application['status'][] = [
  'Saved', 'Needs_Manual_Action', 'Auto_Applied', 'Submitted',
  'Under_Review', 'Interview_Scheduled', 'Offer_Received',
  'Accepted', 'Rejected', 'Withdrawn',
];

export default function ApplicationDetail({
  application,
  onUpdate,
  onDelete,
}: ApplicationDetailProps) {
  const [notes, setNotes] = useState(application.notes);
  const { internship } = application;

  const allDocs = [
    application.cvVersion && { name: application.cvVersion, type: 'CV' },
    application.coverLetter && { name: application.coverLetter, type: 'Cover Letter' },
    ...application.additionalDocs.map((d) => ({ name: d, type: 'Document' })),
  ].filter(Boolean) as { name: string; type: string }[];

  const handleSaveNotes = () => {
    onUpdate(application.id, { notes, lastUpdated: new Date().toISOString() });
  };

  const handleStatusChange = (newStatus: Application['status']) => {
    onUpdate(application.id, { status: newStatus, lastUpdated: new Date().toISOString() });
  };

  const handleWithdraw = () => {
    onUpdate(application.id, { status: 'Withdrawn', lastUpdated: new Date().toISOString() });
  };

  return (
    <div className={styles.wrapper}>
      {/* Header */}
      <div className={styles.header}>
        <div
          className={styles.companyIcon}
          style={{ background: getCompanyColor(internship.company) }}
        >
          {internship.company.charAt(0).toUpperCase()}
        </div>
        <div className={styles.headerInfo}>
          <div className={styles.company}>{internship.company}</div>
          <h2 className={styles.title}>{internship.title}</h2>
          <div className={styles.headerMeta}>
            <StatusBadge status={application.status} />
            {application.appliedDate && (
              <span>Applied {formatDate(application.appliedDate)}</span>
            )}
            <span>{internship.location}</span>
          </div>
        </div>
      </div>

      {/* Documents */}
      {allDocs.length > 0 && (
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>
            <span className={styles.sectionIcon}>&#128196;</span>
            Attached Documents
          </h3>
          <div className={styles.docList}>
            {allDocs.map((doc, i) => (
              <div key={i} className={styles.docItem}>
                <span className={styles.docIcon}>&#128196;</span>
                <span className={styles.docName}>{doc.name}</span>
                <div className={styles.docActions}>
                  <button className={styles.smallBtn}>View</button>
                  <button className={styles.smallBtn}>Download</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Timeline */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>
          <span className={styles.sectionIcon}>&#128337;</span>
          Application Timeline
        </h3>
        <ApplicationTimeline application={application} />
      </div>

      {/* AI Insights */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>
          <span className={styles.sectionIcon}>&#129302;</span>
          AI Insights
        </h3>
        <div className={styles.insightsGrid}>
          <div className={styles.insightCard}>
            <div className={styles.insightLabel}>Match Score</div>
            <div className={styles.insightValue}>{application.confidenceScore}%</div>
          </div>
          <div className={styles.insightCard}>
            <div className={styles.insightLabel}>Match Reasons</div>
            <ul className={styles.matchReasons}>
              {internship.matchReasons.slice(0, 4).map((reason, i) => (
                <li key={i} className={styles.matchReason}>{reason}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* AI Suggestions */}
      {application.aiSuggestions.length > 0 && (
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>
            <span className={styles.sectionIcon}>&#128161;</span>
            AI Suggestions
          </h3>
          <ul className={styles.suggestionsList}>
            {application.aiSuggestions.map((suggestion, i) => (
              <li key={i} className={styles.suggestion}>
                <span className={styles.suggestionIcon}>&#10148;</span>
                {suggestion}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Notes */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>
          <span className={styles.sectionIcon}>&#128221;</span>
          Notes
        </h3>
        <textarea
          className={styles.notesTextarea}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add your notes here..."
        />
        <button className={styles.saveNotesBtn} onClick={handleSaveNotes}>
          Save Notes
        </button>
      </div>

      {/* Actions */}
      <div className={styles.actions}>
        <select
          className={styles.statusSelect}
          value={application.status}
          onChange={(e) => handleStatusChange(e.target.value as Application['status'])}
        >
          {ALL_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s.replace(/_/g, ' ')}
            </option>
          ))}
        </select>

        {application.status !== 'Withdrawn' && application.status !== 'Rejected' && (
          <button className={styles.secondaryBtn} onClick={handleWithdraw}>
            Withdraw
          </button>
        )}

        <button className={styles.dangerBtn} onClick={() => onDelete(application.id)}>
          Delete Application
        </button>
      </div>
    </div>
  );
}
