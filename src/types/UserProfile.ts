export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  university: string;
  major: string;
  graduationYear: number;
  gpa?: number;
  photoUrl?: string;
  preferredLocations: string[];
  preferredIndustries: string[];
  preferredRoleTypes: string[];
  minimumSalary?: number;
  skills: string[];
  experience: Experience[];
  education: Education[];
  projects: Project[];
  certifications: Certification[];
  languages: Language[];
  linkedInUrl?: string;
  githubUrl?: string;
  portfolioUrl?: string;
  masterCVId?: string;
  swipeHistory: SwipeHistory[];
  applicationHistory: string[];
  successPatterns: { acceptedCompanies: string[]; successfulKeywords: string[]; winningCVFeatures: string[]; };
  totalApplications: number;
  autoAppliedCount: number;
  interviewsScheduled: number;
  offersReceived: number;
  notificationsEnabled: boolean;
  aiSuggestionsEnabled: boolean;
  autoApplyEnabled: boolean;
  language: 'en' | 'ar';
  darkMode: boolean;
  createdDate: string;
  lastLogin: string;
}

export interface Experience {
  id: string;
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  description: string;
  achievements: string[];
}

export interface Education {
  id: string;
  degree: string;
  institution: string;
  major: string;
  startDate: string;
  endDate?: string;
  gpa?: number;
  honors?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  role: string;
  startDate: string;
  endDate?: string;
  link?: string;
  achievements: string[];
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  dateIssued: string;
  expiryDate?: string;
  credentialId?: string;
  url?: string;
}

export interface Language {
  language: string;
  proficiency: 'Native' | 'Fluent' | 'Professional' | 'Intermediate' | 'Basic';
}

export interface SwipeHistory {
  internshipId: string;
  direction: 'left' | 'right';
  timestamp: string;
  matchScore: number;
}
