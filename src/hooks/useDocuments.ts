import { useMemo, useCallback } from 'react';
import { Document as DocType } from '../types';
import { useAppContext } from '../context/AppContext';

type DocTypeFilter = DocType['type'] | 'All';

interface UseDocumentsOptions {
  filterType?: DocTypeFilter;
}

export function useDocuments(options: UseDocumentsOptions = {}) {
  const {
    documents,
    addDocument,
    uploadDocument,
    updateDocument,
    deleteDocument,
    loading,
  } = useAppContext();

  const { filterType = 'All' } = options;

  const filtered = useMemo(() => {
    if (filterType === 'All') return documents;
    return documents.filter((d) => d.type === filterType);
  }, [documents, filterType]);

  const getById = useCallback(
    (id: string): DocType | undefined => documents.find((d) => d.id === id),
    [documents]
  );

  const getByType = useCallback(
    (type: DocType['type']): DocType[] => documents.filter((d) => d.type === type),
    [documents]
  );

  const getVersions = useCallback(
    (baseDocumentId: string): DocType[] =>
      documents
        .filter((d) => d.baseDocumentId === baseDocumentId || d.id === baseDocumentId)
        .sort((a, b) => a.version - b.version),
    [documents]
  );

  return {
    documents: filtered,
    allDocuments: documents,
    loading,
    addDocument,
    uploadDocument,
    updateDocument,
    deleteDocument,
    getById,
    getByType,
    getVersions,
    total: documents.length,
    filteredCount: filtered.length,
  };
}
