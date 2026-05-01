import { api } from './client';
import type { Application } from '../../types';

interface ApplicationsResponse {
  applications: Application[];
}

interface ApplicationResponse {
  application: Application;
}

export const applicationApi = {
  // Get all applications for the current user
  getAll() {
    return api.get<ApplicationsResponse>('/applications');
  },

  // Get a single application by ID
  getById(id: string) {
    return api.get<ApplicationResponse>(`/applications/${id}`);
  },

  // Create a new application
  create(data: {
    internshipId: string;
    status?: string;
    deadlineDate: string;
    cvVersion?: string;
    coverLetter?: string;
    notes?: string;
    confidenceScore?: number;
    autoApplied?: boolean;
  }) {
    return api.post<ApplicationResponse>('/applications', data);
  },

  // Update an application
  update(id: string, data: Partial<Application>) {
    return api.put<ApplicationResponse>(`/applications/${id}`, data);
  },

  // Delete an application
  delete(id: string) {
    return api.delete(`/applications/${id}`);
  },
};
