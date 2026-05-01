import { api } from './client';
import type { Document } from '../../types';

interface DocumentsResponse {
  documents: Document[];
}

interface DocumentResponse {
  document: Document;
}

export const documentApi = {
  // Get all documents for the current user
  getAll() {
    return api.get<DocumentsResponse>('/documents');
  },

  // Get a single document by ID
  getById(id: string) {
    return api.get<DocumentResponse>(`/documents/${id}`);
  },

  // Upload a document file
  upload(file: File, name: string, type: string) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('name', name);
    formData.append('type', type);
    return api.upload<DocumentResponse>('/documents/upload', formData);
  },

  // Update document metadata
  update(id: string, data: Partial<Document>) {
    return api.put<DocumentResponse>(`/documents/${id}`, data);
  },

  // Delete a document
  delete(id: string) {
    return api.delete(`/documents/${id}`);
  },

  // Get download URL for a document
  getDownloadUrl(id: string) {
    const token = localStorage.getItem('cm_token');
    const base = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    return `${base}/documents/${id}/download?token=${token}`;
  },
};
