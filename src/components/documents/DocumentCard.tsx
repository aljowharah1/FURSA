import type { Document } from '../../types';
import { formatFileSize } from '../../utils/formatters';
import { formatDate } from '../../utils/dateHelpers';
import styles from './DocumentCard.module.css';

interface DocumentCardProps {
  document: Document;
  onView: (doc: Document) => void;
  onDelete: (id: string) => void;
}

const TYPE_ICONS: Record<Document['type'], string> = {
  CV: '\u{1F4C4}',
  Cover_Letter: '\u{1F4DD}',
  Portfolio: '\u{1F4BC}',
  Transcript: '\u{1F393}',
  Other: '\u{1F4CE}',
};

const TYPE_CLASS: Record<Document['type'], string> = {
  CV: styles.iconCV,
  Cover_Letter: styles.iconCoverLetter,
  Portfolio: styles.iconPortfolio,
  Transcript: styles.iconTranscript,
  Other: styles.iconOther,
};

export default function DocumentCard({ document: doc, onView, onDelete }: DocumentCardProps) {
  return (
    <div className={styles.card}>
      <div className={`${styles.fileIcon} ${TYPE_CLASS[doc.type] || styles.iconOther}`}>
        {TYPE_ICONS[doc.type] || '\u{1F4CE}'}
      </div>

      <div className={styles.info}>
        <div className={styles.nameRow}>
          <span className={styles.name}>{doc.name}</span>
          <span className={styles.typeBadge}>{doc.type.replace(/_/g, ' ')}</span>
        </div>
        <div className={styles.meta}>
          <span>{formatFileSize(doc.fileSize)}</span>
          <span>Modified {formatDate(doc.lastModified)}</span>
        </div>
      </div>

      <div className={styles.actions}>
        <button className={styles.btn} onClick={() => onView(doc)}>View</button>
        <button className={styles.btn} onClick={() => onView(doc)}>Download</button>
        <button className={`${styles.btn} ${styles.btnDanger}`} onClick={() => onDelete(doc.id)}>
          Delete
        </button>
      </div>
    </div>
  );
}
