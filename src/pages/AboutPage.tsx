import { useNavigate } from 'react-router-dom';
import styles from './AboutPage.module.css';

const TEAM = [
  {
    name: 'Aljowharah Aljubair',
    studentId: '222410187',
    role: 'Project Lead & Full-Stack Developer',
    email: '222410187@psu.edu.sa',
    initial: 'A',
  },
  {
    name: 'Sarah Al-Rashidi',
    studentId: '443200001',
    role: 'Frontend Developer & UI/UX Design',
    email: 'student2@psu.edu.sa',
    initial: 'S',
  },
  {
    name: 'Noura Al-Otaibi',
    studentId: '443200002',
    role: 'AI Integration & Data Management',
    email: 'student3@psu.edu.sa',
    initial: 'N',
  },
];

const TECH_STACK = [
  'React.js 18', 'TypeScript', 'React Router v6',
  'React Spring', 'CSS Modules', 'LocalStorage',
];

const FEATURES = [
  'AI-powered career assistant chatbot',
  'Smart internship matching with swipe interface',
  'Application tracking and management',
  'Document management (CV, cover letters, transcripts)',
  'AI-generated cover letters and interview prep',
  'Application analytics and insights',
  'Profile management with skills tracking',
  'Dark mode support',
  'Fully responsive mobile-first design',
];

export default function AboutPage() {
  const navigate = useNavigate();

  return (
    <div className={styles.page}>
      <button className={styles.backBtn} onClick={() => navigate('/profile')}>← back</button>

      {/* Hero */}
      <div className={styles.hero}>
        <div className={styles.logoMark}>
          <div className={styles.logoTriangle} />
        </div>
        <h1 className={styles.appName}>careermate</h1>
        <div className={styles.tagline}>AI-Powered Co-op Manager</div>
        <div className={styles.courseInfo}>
          Prince Sultan University · SE411 · Spring 2026
        </div>
      </div>

      {/* Team */}
      <div className={styles.sectionTitle}>
        <span className={styles.sectionLabel}>— team</span>
      </div>
      <div className={styles.teamGrid}>
        {TEAM.map((m) => (
          <div key={m.studentId} className={styles.teamCard}>
            <div className={styles.memberAvatar}>{m.initial}</div>
            <div className={styles.memberName}>{m.name}</div>
            <div className={styles.memberId}>{m.studentId}</div>
            <div className={styles.memberRole}>{m.role}</div>
            <a className={styles.memberEmail} href={`mailto:${m.email}`}>{m.email}</a>
          </div>
        ))}
      </div>

      {/* Stack */}
      <div className={styles.sectionTitle}>
        <span className={styles.sectionLabel}>— stack</span>
      </div>
      <div className={styles.stackRow}>
        {TECH_STACK.map((t) => (
          <span key={t} className={styles.stackBadge}>{t}</span>
        ))}
      </div>

      {/* Features */}
      <div className={styles.sectionTitle}>
        <span className={styles.sectionLabel}>— features</span>
      </div>
      <div className={styles.featureList}>
        {FEATURES.map((f) => (
          <div key={f} className={styles.featureItem}>
            <span className={styles.featureBullet}>▸</span>
            <span>{f}</span>
          </div>
        ))}
      </div>

      {/* Contact */}
      <div className={styles.sectionTitle}>
        <span className={styles.sectionLabel}>— contact</span>
      </div>
      <div className={styles.contactBlock}>
        <div className={styles.contactRow}>
          <span className={styles.contactKey}>email</span>
          <a className={styles.contactVal} href="mailto:careermate@psu.edu.sa">careermate@psu.edu.sa</a>
        </div>
        <div className={styles.contactRow}>
          <span className={styles.contactKey}>location</span>
          <span className={styles.contactVal}>Prince Sultan University, Riyadh</span>
        </div>
      </div>

      {/* Footer */}
      <div className={styles.footer}>
        <div className={styles.footerText}>© 2026 PSU Software Engineering Group Project</div>
        <div className={styles.footerVersion}>careermate v1.0 · se411 · 2026</div>
      </div>
    </div>
  );
}
