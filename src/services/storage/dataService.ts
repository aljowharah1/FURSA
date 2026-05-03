import type { Internship, Application, Document, UserProfile } from '../../types';
import { getItem, setItem, removeItem } from './localStorage';
import { STORAGE_KEYS } from '../../utils/constants';
import { generateId } from '../../utils/helpers';

// ---------- Mock seed data ----------
// Only profile and documents are seeded.
// Internships and applications come from agents after CV upload.

const MOCK_DOCUMENTS: Document[] = [
  {
    id: 'doc-001',
    type: 'CV',
    name: 'Master CV',
    fileName: 'master-cv.pdf',
    fileSize: 245000,
    mimeType: 'application/pdf',
    content: '',
    version: 1,
    isAIGenerated: false,
    isAICustomized: false,
    aiCustomizations: [],
    usedInApplications: [],
    createdDate: new Date(Date.now() - 30 * 86400000).toISOString(),
    lastModified: new Date(Date.now() - 7 * 86400000).toISOString(),
  },
];

const MOCK_PROFILE: UserProfile = {
  id: 'user-001',
  name: '',
  email: '',
  phone: '',
  university: '',
  major: '',
  graduationYear: new Date().getFullYear() + 1,
  gpa: undefined,
  photoUrl: '',
  preferredLocations: ['Riyadh', 'Saudi Arabia'],
  preferredIndustries: [],
  preferredRoleTypes: [],
  minimumSalary: 0,
  skills: [],
  experience: [],
  education: [],
  projects: [],
  certifications: [],
  languages: [],
  linkedInUrl: '',
  githubUrl: '',
  masterCVId: 'doc-001',
  swipeHistory: [],          // always empty — no old swipes
  applicationHistory: [],
  successPatterns: {
    acceptedCompanies: [],
    successfulKeywords: [],
    winningCVFeatures: [],
  },
  totalApplications: 0,
  autoAppliedCount: 0,
  interviewsScheduled: 0,
  offersReceived: 0,
  notificationsEnabled: true,
  aiSuggestionsEnabled: true,
  autoApplyEnabled: false,
  language: 'en',
  darkMode: false,
  createdDate: new Date().toISOString(),
  lastLogin: new Date().toISOString(),
};

// ---------- Init / Seed ----------

export function initializeData(): void {
  // Always wipe internships — agents provide real ones from CV
  setItem(STORAGE_KEYS.INTERNSHIPS, []);

  // Always wipe applications — populated on swipe right
  setItem(STORAGE_KEYS.APPLICATIONS, []);

  // Seed one placeholder document if none exist
  if (getItem<Document[]>(STORAGE_KEYS.DOCUMENTS, []).length === 0) {
    setItem(STORAGE_KEYS.DOCUMENTS, MOCK_DOCUMENTS);
  }

  // Seed empty profile — agents overwrite with real CV data
  // Always reset swipeHistory to empty so deck is never blocked
  const existingProfile = getItem<UserProfile | null>(STORAGE_KEYS.PROFILE, null);
  if (!existingProfile) {
    setItem(STORAGE_KEYS.PROFILE, MOCK_PROFILE);
  } else {
    // Keep profile data but always clear swipe history on init
    setItem(STORAGE_KEYS.PROFILE, {
      ...existingProfile,
      swipeHistory: [],
      applicationHistory: [],
    });
  }
}

// ---------- Internships ----------

export function getAllInternships(): Internship[] {
  return getItem<Internship[]>(STORAGE_KEYS.INTERNSHIPS, []);
}

export function getInternshipById(id: string): Internship | undefined {
  return getAllInternships().find((i) => i.id === id);
}

export function createInternship(data: Omit<Internship, 'id' | 'dateAdded'>): Internship {
  const internship: Internship = {
    ...data,
    id: generateId(),
    dateAdded: new Date().toISOString(),
  };
  const all = getAllInternships();
  all.push(internship);
  setItem(STORAGE_KEYS.INTERNSHIPS, all);
  return internship;
}

export function updateInternship(id: string, data: Partial<Internship>): Internship | undefined {
  const all = getAllInternships();
  const idx = all.findIndex((i) => i.id === id);
  if (idx === -1) return undefined;
  all[idx] = { ...all[idx], ...data };
  setItem(STORAGE_KEYS.INTERNSHIPS, all);
  return all[idx];
}

export function deleteInternship(id: string): boolean {
  const all = getAllInternships();
  const filtered = all.filter((i) => i.id !== id);
  if (filtered.length === all.length) return false;
  setItem(STORAGE_KEYS.INTERNSHIPS, filtered);
  return true;
}

// ---------- Applications ----------

export function getAllApplications(): Application[] {
  return getItem<Application[]>(STORAGE_KEYS.APPLICATIONS, []);
}

export function getApplicationById(id: string): Application | undefined {
  return getAllApplications().find((a) => a.id === id);
}

export function createApplication(
  data: Omit<Application, 'id' | 'createdDate' | 'lastUpdated'>
): Application {
  const application: Application = {
    ...data,
    id: generateId(),
    createdDate: new Date().toISOString(),
    lastUpdated: new Date().toISOString(),
  };
  const all = getAllApplications();
  all.push(application);
  setItem(STORAGE_KEYS.APPLICATIONS, all);
  return application;
}

export function updateApplication(
  id: string,
  data: Partial<Application>
): Application | undefined {
  const all = getAllApplications();
  const idx = all.findIndex((a) => a.id === id);
  if (idx === -1) return undefined;
  all[idx] = { ...all[idx], ...data, lastUpdated: new Date().toISOString() };
  setItem(STORAGE_KEYS.APPLICATIONS, all);
  return all[idx];
}

export function deleteApplication(id: string): boolean {
  const all = getAllApplications();
  const filtered = all.filter((a) => a.id !== id);
  if (filtered.length === all.length) return false;
  setItem(STORAGE_KEYS.APPLICATIONS, filtered);
  return true;
}

// ---------- Documents ----------

export function getAllDocuments(): Document[] {
  return getItem<Document[]>(STORAGE_KEYS.DOCUMENTS, []);
}

export function getDocumentById(id: string): Document | undefined {
  return getAllDocuments().find((d) => d.id === id);
}

export function createDocument(
  data: Omit<Document, 'id' | 'createdDate' | 'lastModified'>
): Document {
  const doc: Document = {
    ...data,
    id: generateId(),
    createdDate: new Date().toISOString(),
    lastModified: new Date().toISOString(),
  };
  const all = getAllDocuments();
  all.push(doc);
  setItem(STORAGE_KEYS.DOCUMENTS, all);
  return doc;
}

export function updateDocument(id: string, data: Partial<Document>): Document | undefined {
  const all = getAllDocuments();
  const idx = all.findIndex((d) => d.id === id);
  if (idx === -1) return undefined;
  all[idx] = { ...all[idx], ...data, lastModified: new Date().toISOString() };
  setItem(STORAGE_KEYS.DOCUMENTS, all);
  return all[idx];
}

export function deleteDocument(id: string): boolean {
  const all = getAllDocuments();
  const filtered = all.filter((d) => d.id !== id);
  if (filtered.length === all.length) return false;
  setItem(STORAGE_KEYS.DOCUMENTS, filtered);
  return true;
}

// ---------- Profile ----------

export function getProfile(): UserProfile | null {
  return getItem<UserProfile | null>(STORAGE_KEYS.PROFILE, null);
}

export function updateProfile(data: Partial<UserProfile>): UserProfile | null {
  const profile = getProfile();
  if (!profile) return null;
  const updated = { ...profile, ...data, lastLogin: new Date().toISOString() };
  setItem(STORAGE_KEYS.PROFILE, updated);
  return updated;
}