import type { Application } from '../../types';
import { formatDate } from '../../utils/dateHelpers';
import styles from './ApplicationTimeline.module.css';

interface ApplicationTimelineProps {
  application: Application;
}

interface TimelineEvent {
  label: string;
  date?: string;
  description?: string;
  status: 'completed' | 'active' | 'pending';
}

function buildTimeline(app: Application): TimelineEvent[] {
  const events: TimelineEvent[] = [];
  const s = app.status;

  // Saved
  events.push({
    label: 'Saved',
    date: app.savedDate || app.createdDate,
    description: 'Application saved to tracking list',
    status: 'completed',
  });

  // Applied
  const applied =
    s !== 'Saved' && s !== 'Needs_Manual_Action';
  events.push({
    label: app.autoApplied ? 'Auto-Applied' : 'Applied',
    date: app.appliedDate,
    description: app.autoApplied
      ? `Automatically submitted with ${app.cvVersion}`
      : `Submitted with ${app.cvVersion}`,
    status: applied ? 'completed' : s === 'Needs_Manual_Action' ? 'active' : 'pending',
  });

  // Under Review
  const reviewed = [
    'Under_Review', 'Interview_Scheduled', 'Offer_Received',
    'Accepted', 'Rejected', 'Withdrawn',
  ].includes(s);
  events.push({
    label: 'Under Review',
    date: reviewed ? app.lastUpdated : undefined,
    description: reviewed ? 'Application reviewed by the company' : undefined,
    status: reviewed ? 'completed' : s === 'Submitted' || s === 'Auto_Applied' ? 'active' : 'pending',
  });

  // Interview (only if scheduled or later)
  if (app.interviewDate || ['Interview_Scheduled', 'Offer_Received', 'Accepted'].includes(s)) {
    events.push({
      label: 'Interview',
      date: app.interviewDate,
      description: app.interviewType
        ? `${app.interviewType} interview${app.interviewerName ? ` with ${app.interviewerName}` : ''}`
        : 'Interview scheduled',
      status:
        s === 'Interview_Scheduled'
          ? 'active'
          : ['Offer_Received', 'Accepted'].includes(s)
          ? 'completed'
          : 'pending',
    });
  }

  // Result
  if (['Offer_Received', 'Accepted', 'Rejected'].includes(s)) {
    events.push({
      label: s === 'Rejected' ? 'Rejected' : s === 'Accepted' ? 'Accepted' : 'Offer Received',
      date: app.responseDate,
      description:
        s === 'Rejected'
          ? app.rejectionReason || 'Application was not selected'
          : s === 'Accepted'
          ? `Offer accepted${app.offerSalary ? ` - ${app.offerSalary}` : ''}`
          : 'Offer received from the company',
      status: 'completed',
    });
  }

  return events;
}

export default function ApplicationTimeline({ application }: ApplicationTimelineProps) {
  const events = buildTimeline(application);

  return (
    <div className={styles.timeline}>
      {events.map((event, i) => (
        <div
          key={i}
          className={`${styles.event} ${event.status === 'pending' ? styles.eventPending : ''}`}
        >
          <div
            className={`${styles.dot} ${
              event.status === 'completed'
                ? styles.dotCompleted
                : event.status === 'active'
                ? styles.dotActive
                : ''
            }`}
          />
          <div className={styles.eventLabel}>{event.label}</div>
          {event.date && (
            <div className={styles.eventDate}>{formatDate(event.date)}</div>
          )}
          {event.description && (
            <div className={styles.eventDescription}>{event.description}</div>
          )}
        </div>
      ))}
    </div>
  );
}
