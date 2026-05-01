import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Internship, Application, Document as DocType } from '../types';
import * as ds from '../services/storage/dataService';
import { generateId } from '../utils/helpers';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

interface AppContextType {
  internships: Internship[];
  applications: Application[];
  documents: DocType[];
  loading: boolean;
  toasts: Toast[];
  addInternship: (i: Omit<Internship, 'id'>) => Promise<Internship>;
  updateInternship: (id: string, data: Partial<Internship>) => Promise<void>;
  deleteInternship: (id: string) => Promise<void>;
  addApplication: (a: Omit<Application, 'id'>) => Promise<Application>;
  updateApplication: (id: string, data: Partial<Application>) => Promise<void>;
  deleteApplication: (id: string) => Promise<void>;
  addDocument: (d: Omit<DocType, 'id'>) => Promise<DocType>;
  uploadDocument: (file: File, name: string, type: string) => Promise<DocType>;
  updateDocument: (id: string, data: Partial<DocType>) => Promise<void>;
  deleteDocument: (id: string) => Promise<void>;
  refreshData: () => void;
  showToast: (message: string, type: Toast['type']) => void;
  removeToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [internships, setInternships] = useState<Internship[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [documents, setDocuments] = useState<DocType[]>([]);
  const [loading, setLoading] = useState(true);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const loadData = useCallback(() => {
    setLoading(true);
    ds.initializeData();
    setInternships(ds.getAllInternships());
    setApplications(ds.getAllApplications());
    setDocuments(ds.getAllDocuments());
    setLoading(false);
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const showToast = useCallback((message: string, type: Toast['type']) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addInternship = useCallback(async (data: Omit<Internship, 'id'>): Promise<Internship> => {
    const internship = ds.createInternship(data as any);
    setInternships((prev) => [internship, ...prev]);
    showToast('Internship added', 'success');
    return internship;
  }, [showToast]);

  const updateInternship = useCallback(async (id: string, data: Partial<Internship>) => {
    const updated = ds.updateInternship(id, data);
    if (updated) setInternships((prev) => prev.map((i) => (i.id === id ? updated : i)));
    showToast('Internship updated', 'info');
  }, [showToast]);

  const deleteInternship = useCallback(async (id: string) => {
    ds.deleteInternship(id);
    setInternships((prev) => prev.filter((i) => i.id !== id));
    showToast('Internship deleted', 'success');
  }, [showToast]);

  const addApplication = useCallback(async (data: Omit<Application, 'id'>): Promise<Application> => {
    const application = ds.createApplication(data);
    setApplications((prev) => [application, ...prev]);
    showToast('Application created', 'success');
    return application;
  }, [showToast]);

  const updateApplication = useCallback(async (id: string, data: Partial<Application>) => {
    const updated = ds.updateApplication(id, data);
    if (updated) setApplications((prev) => prev.map((a) => (a.id === id ? updated : a)));
    showToast('Application updated', 'info');
  }, [showToast]);

  const deleteApplication = useCallback(async (id: string) => {
    ds.deleteApplication(id);
    setApplications((prev) => prev.filter((a) => a.id !== id));
    showToast('Application deleted', 'success');
  }, [showToast]);

  const addDocument = useCallback(async (data: Omit<DocType, 'id'>): Promise<DocType> => {
    const doc = ds.createDocument(data);
    setDocuments((prev) => [doc, ...prev]);
    showToast('Document added', 'success');
    return doc;
  }, [showToast]);

  const uploadDocument = useCallback(async (file: File, name: string, type: string): Promise<DocType> => {
    const doc = ds.createDocument({
      name,
      type: type as DocType['type'],
      fileName: file.name,
      fileSize: file.size,
      mimeType: file.type || 'application/octet-stream',
      content: '',
      version: 1,
      isAIGenerated: false,
      isAICustomized: false,
      aiCustomizations: [],
      usedInApplications: [],
      uploadedAt: new Date().toISOString(),
    } as any);
    setDocuments((prev) => [doc, ...prev]);
    showToast('Document uploaded', 'success');
    return doc;
  }, [showToast]);

  const updateDocument = useCallback(async (id: string, data: Partial<DocType>) => {
    const updated = ds.updateDocument(id, data);
    if (updated) setDocuments((prev) => prev.map((d) => (d.id === id ? updated : d)));
    showToast('Document updated', 'info');
  }, [showToast]);

  const deleteDocument = useCallback(async (id: string) => {
    ds.deleteDocument(id);
    setDocuments((prev) => prev.filter((d) => d.id !== id));
    showToast('Document deleted', 'success');
  }, [showToast]);

  const refreshData = useCallback(() => { loadData(); }, [loadData]);

  return (
    <AppContext.Provider value={{
      internships, applications, documents, loading, toasts,
      addInternship, updateInternship, deleteInternship,
      addApplication, updateApplication, deleteApplication,
      addDocument, uploadDocument, updateDocument, deleteDocument,
      refreshData, showToast, removeToast,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext(): AppContextType {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within an AppProvider');
  return context;
}
