import { useParams, useNavigate } from 'react-router-dom';
import { useApplications } from '../hooks/useApplications';
import ApplicationDetail from '../components/applications/ApplicationDetail';

export default function ApplicationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getById, updateApplication, deleteApplication } = useApplications();

  const application = id ? getById(id) : undefined;

  const handleDelete = (appId: string) => {
    deleteApplication(appId);
    navigate('/track');
  };

  if (!application) {
    return (
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: '60px 20px', textAlign: 'center', minHeight: '60vh',
      }}>
        <div style={{
          fontFamily: 'var(--font-mono)', fontSize: 80, fontWeight: 700,
          color: 'var(--signal)', letterSpacing: '-0.04em', lineHeight: 1,
        }}>404</div>
        <h2 style={{
          fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 600,
          marginTop: 10, marginBottom: 6, color: 'var(--ink)',
        }}>Application not found.</h2>
        <p style={{
          fontSize: 12, color: 'var(--ink-dim)', maxWidth: 280, marginBottom: 20,
          fontFamily: 'var(--font-body)',
        }}>
          This application doesn't exist or was already deleted.
        </p>
        <button
          onClick={() => navigate('/track')}
          style={{
            padding: '10px 24px', background: 'var(--signal)', color: 'var(--signal-ink)',
            border: 'none', borderRadius: 999, fontSize: 11, fontWeight: 700,
            cursor: 'pointer', letterSpacing: '0.10em', textTransform: 'uppercase',
            fontFamily: 'var(--font-body)',
          }}
        >
          ← Back to Applications
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: '0 0 40px' }}>
      <div style={{ padding: '12px 20px 0' }}>
        <button
          onClick={() => navigate('/track')}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '5px 10px', background: 'transparent',
            border: '1px solid var(--line)', borderRadius: 999,
            color: 'var(--ink-dim)', fontSize: 10, cursor: 'pointer',
            letterSpacing: '0.10em', textTransform: 'uppercase',
            fontFamily: 'var(--font-body)', fontWeight: 600,
          }}
        >
          ← back
        </button>
      </div>
      <ApplicationDetail
        application={application}
        onUpdate={updateApplication}
        onDelete={handleDelete}
      />
    </div>
  );
}
