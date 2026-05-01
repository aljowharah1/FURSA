import { useState, useRef, useCallback } from 'react';
import styles from './DocumentUpload.module.css';

interface DocumentUploadProps {
  onUpload: (file: File) => void;
}

const ACCEPTED_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];
const ACCEPTED_EXT = '.pdf,.doc,.docx';

export default function DocumentUpload({ onUpload }: DocumentUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((file: File) => {
    if (ACCEPTED_TYPES.includes(file.type) || /\.(pdf|docx?|doc)$/i.test(file.name)) {
      setSelectedFile(file);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragActive(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile],
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(true);
  };

  const handleDragLeave = () => {
    setIsDragActive(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleUpload = () => {
    if (selectedFile) {
      onUpload(selectedFile);
      setSelectedFile(null);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  return (
    <div className={styles.wrapper}>
      <div
        className={`${styles.dropzone} ${isDragActive ? styles.dropzoneActive : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => inputRef.current?.click()}
      >
        <div className={styles.dropIcon}>{'\u{1F4C1}'}</div>
        <div className={styles.dropText}>
          Drag and drop a file here, or <strong>browse</strong>
        </div>
        <div className={styles.hint}>PDF, DOC, DOCX accepted</div>
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED_EXT}
          onChange={handleInputChange}
          className={styles.hiddenInput}
        />
      </div>

      {selectedFile && (
        <div className={styles.selectedFile}>
          <span className={styles.selectedIcon}>{'\u{1F4C4}'}</span>
          <span className={styles.selectedName}>{selectedFile.name}</span>
          <button
            className={styles.removeBtn}
            onClick={() => setSelectedFile(null)}
            aria-label="Remove file"
          >
            {'\u2715'}
          </button>
        </div>
      )}

      <button
        className={styles.uploadBtn}
        onClick={handleUpload}
        disabled={!selectedFile}
      >
        Upload Document
      </button>
    </div>
  );
}
