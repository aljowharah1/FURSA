export const APP_NAME = 'CareerMate';
export const APP_VERSION = '1.0.0';

export const STORAGE_KEYS = {
  INTERNSHIPS: 'cm_internships',
  APPLICATIONS: 'cm_applications',
  DOCUMENTS: 'cm_documents',
  PROFILE: 'cm_profile',
} as const;

export const STATUS_OPTIONS = [
  { value: 'Saved', label: 'Saved' },
  { value: 'Needs_Manual_Action', label: 'Needs Manual Action' },
  { value: 'Auto_Applied', label: 'Auto Applied' },
  { value: 'Submitted', label: 'Submitted' },
  { value: 'Under_Review', label: 'Under Review' },
  { value: 'Interview_Scheduled', label: 'Interview Scheduled' },
  { value: 'Offer_Received', label: 'Offer Received' },
  { value: 'Accepted', label: 'Accepted' },
  { value: 'Rejected', label: 'Rejected' },
  { value: 'Withdrawn', label: 'Withdrawn' },
] as const;

export const INTERNSHIP_STATUS_OPTIONS = [
  { value: 'Open', label: 'Open' },
  { value: 'Closing Soon', label: 'Closing Soon' },
  { value: 'Closed', label: 'Closed' },
] as const;

export const LOCATION_OPTIONS = [
  'Riyadh',
  'Jeddah',
  'Dammam',
  'Khobar',
  'Mecca',
  'Medina',
  'Remote',
  'Hybrid',
] as const;

export const INDUSTRY_OPTIONS = [
  'Technology',
  'Finance',
  'Healthcare',
  'Oil & Gas',
  'Consulting',
  'Government',
  'Education',
  'Retail',
  'Telecommunications',
  'Construction',
  'Media',
  'Legal',
] as const;

export const ROLE_TYPE_OPTIONS = [
  { value: 'Technical', label: 'Technical' },
  { value: 'Business', label: 'Business' },
  { value: 'Research', label: 'Research' },
  { value: 'Government', label: 'Government' },
] as const;

export const DOCUMENT_TYPE_OPTIONS = [
  { value: 'CV', label: 'CV / Resume' },
  { value: 'Cover_Letter', label: 'Cover Letter' },
  { value: 'Portfolio', label: 'Portfolio' },
  { value: 'Transcript', label: 'Transcript' },
  { value: 'Other', label: 'Other' },
] as const;

export const INTERVIEW_TYPE_OPTIONS = [
  { value: 'Phone', label: 'Phone' },
  { value: 'Video', label: 'Video' },
  { value: 'In-Person', label: 'In-Person' },
  { value: 'Technical', label: 'Technical' },
  { value: 'HR', label: 'HR' },
] as const;

export const LANGUAGE_PROFICIENCY_OPTIONS = [
  'Native',
  'Fluent',
  'Professional',
  'Intermediate',
  'Basic',
] as const;

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const SUPPORTED_FILE_TYPES = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
export const DEFAULT_PAGE_SIZE = 10;
