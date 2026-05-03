// src/components/CVUpload.tsx

import { useState, useRef } from 'react';
import { useAgentSystem } from '../context/AgentContext';
import styles from './CVUpload.module.css';

export function CVUpload() {
  const { agentState, uploadCV } = useAgentSystem();
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [clFile, setClFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const cvInputRef = useRef<HTMLInputElement>(null);
  const clInputRef = useRef<HTMLInputElement>(null);

  const isLoading =
    !agentState.isReady &&
    agentState.currentPhase !== 'Waiting for CV upload' &&
    !agentState.error;

  if (agentState.isReady) return null;

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file?.type === 'application/pdf') setCvFile(file);
  };

  const handleStart = async () => {
    if (!cvFile) return;
    await uploadCV(cvFile, clFile ?? undefined);
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>

        {/* Logo */}
        <div className={styles.logo}>
          <div className={styles.logoMark}>
            <div className={styles.logoMarkInner} />
          </div>
         <span className={styles.logoText}>FURSA</span>
        </div>

        {/* Heading */}
        <h1 className={styles.heading}>
          find your<br /><em>opportunity.</em>
        </h1>
        <p className={styles.sub}>
          Upload your CV — our agents will match you with real internships automatically.
        </p>

        {/* Agent pipeline */}
        <div className={styles.pipeline}>
          {[
            { icon: '📄', label: 'Read CV', agent: 'Dev & Planning' },
            { icon: '🔍', label: 'Find Jobs', agent: 'Recruiting' },
            { icon: '⚡', label: 'Score', agent: 'Dev & Planning' },
            { icon: '✅', label: 'QA Check', agent: 'QA Manager' },
          ].map((step, i) => (
            <div key={i} className={styles.step}>
              <div className={styles.stepIcon}>{step.icon}</div>
              <div className={styles.stepLabel}>{step.label}</div>
              <div className={styles.stepAgent}>{step.agent}</div>
              {i < 3 && <div className={styles.stepArrow}>→</div>}
            </div>
          ))}
        </div>

        {/* CV Drop Zone */}
        <div
          className={`${styles.dropzone} ${dragging ? styles.dragging : ''} ${cvFile ? styles.filled : ''}`}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => cvInputRef.current?.click()}
        >
          <input
            ref={cvInputRef}
            type="file"
            accept=".pdf"
            hidden
            onChange={(e) => setCvFile(e.target.files?.[0] ?? null)}
          />
          {cvFile ? (
            <div className={styles.fileSelected}>
              <span className={styles.fileIcon}>📄</span>
              <span className={styles.fileName}>{cvFile.name}</span>
              <span className={styles.fileReady}>Ready</span>
            </div>
          ) : (
            <div className={styles.dropPrompt}>
              <span className={styles.dropIcon}>⬆</span>
              <span className={styles.dropText}>Drop your CV here</span>
              <span className={styles.dropHint}>PDF only · click or drag</span>
            </div>
          )}
        </div>

        {/* Optional cover letter */}
        <div className={styles.optionalSection}>
          <p className={styles.optionalLabel}>
            Have an old cover letter? Upload it so agents can match your writing style.
          </p>
          <button className={styles.optionalBtn} onClick={() => clInputRef.current?.click()}>
            <input
              ref={clInputRef}
              type="file"
              accept=".pdf"
              hidden
              onChange={(e) => setClFile(e.target.files?.[0] ?? null)}
            />
            {clFile ? `✓ ${clFile.name}` : '+ Add cover letter (optional)'}
          </button>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className={styles.loadingContainer}>
            <div className={styles.spinner} />
            <p className={styles.phase}>{agentState.currentPhase}</p>
            <div className={styles.agentActivity}>
              {['Team Leader', 'Recruiting Agent', 'Dev & Planning Agent', 'QA Manager'].map((agent) => (
                <div key={agent} className={styles.agentRow}>
                  <div className={styles.agentDot} />
                  <span>{agent}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Error */}
        {agentState.error && (
          <div className={styles.error}>⚠ {agentState.error}</div>
        )}

        {/* Start button */}
        {!isLoading && (
          <button className={styles.startBtn} disabled={!cvFile} onClick={handleStart}>
            {cvFile ? 'Let Agents Find Your Opportunities →' : 'Upload CV to Start'}
          </button>
        )}

        <div className={styles.footer}>
          FURSA · agentic ai · se411 · 2026
        </div>

      </div>
    </div>
  );
}