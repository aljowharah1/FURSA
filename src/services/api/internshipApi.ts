import { api } from './client';
import type { Internship } from '../../types';

interface InternshipsResponse {
  internships: Internship[];
}

interface InternshipResponse {
  internship: Internship;
}

export const internshipApi = {
  // Get all internships (with match scores for the current user)
  getAll() {
    return api.get<InternshipsResponse>('/internships');
  },

  // Get a single internship by ID
  getById(id: string) {
    return api.get<InternshipResponse>(`/internships/${id}`);
  },

  // Create a new internship
  create(data: Omit<Internship, 'id' | 'matchScore' | 'matchReasons' | 'aiRecommendation' | 'missingRequirements' | 'dateAdded'>) {
    return api.post<InternshipResponse>('/internships', data);
  },

  // Update an internship
  update(id: string, data: Partial<Internship>) {
    return api.put<InternshipResponse>(`/internships/${id}`, data);
  },

  // Delete an internship
  delete(id: string) {
    return api.delete(`/internships/${id}`);
  },
};
