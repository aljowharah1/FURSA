import type { Internship, Application, Document, UserProfile } from '../../types';
import { getItem, setItem } from './localStorage';
import { STORAGE_KEYS } from '../../utils/constants';
import { generateId } from '../../utils/helpers';

// ---------- Mock seed data ----------

const MOCK_INTERNSHIPS: Internship[] = [
  {
    id: 'int-001',
    title: 'Software Engineering Intern',
    company: 'Saudi Aramco',
    companyLogo: '',
    location: 'Dhahran',
    type: 'Technical',
    duration: '3 months',
    salary: 'SAR 8,000/mo',
    deadline: new Date(Date.now() + 30 * 86400000).toISOString(),
    status: 'Open',
    description: 'Join our digital transformation team to build cloud-native applications that power the world\'s largest energy company.',
    requirements: ['Python', 'React', 'Cloud Computing', 'GPA 3.5+'],
    perks: ['Housing allowance', 'Transportation', 'Mentorship program'],
    applicationLink: 'https://careers.aramco.com',
    matchScore: 87,
    matchReasons: ['Strong Python skills', 'React experience matches requirement', 'Location preference matched'],
    aiRecommendation: 'Strong match. Your cloud computing coursework and React projects align well. Highlight your capstone project.',
    missingRequirements: ['Cloud Computing certification'],
    dateAdded: new Date(Date.now() - 5 * 86400000).toISOString(),
    source: 'AI_Discovered',
    tags: ['tech', 'oil-gas', 'top-employer'],
  },
  {
    id: 'int-002',
    title: 'Data Analyst Intern',
    company: 'STC',
    companyLogo: '',
    location: 'Riyadh',
    type: 'Technical',
    duration: '6 months',
    salary: 'SAR 6,500/mo',
    deadline: new Date(Date.now() + 14 * 86400000).toISOString(),
    status: 'Closing Soon',
    description: 'Analyze telecom data to uncover customer insights and support strategic decision-making.',
    requirements: ['SQL', 'Python', 'Data Visualization', 'Statistics'],
    perks: ['Flexible hours', 'Training budget', 'Team events'],
    applicationLink: 'https://careers.stc.com',
    matchScore: 72,
    matchReasons: ['Python proficiency', 'Located in preferred city'],
    aiRecommendation: 'Good match. Consider completing a quick SQL course to strengthen your application.',
    missingRequirements: ['Advanced SQL', 'Tableau or Power BI experience'],
    dateAdded: new Date(Date.now() - 2 * 86400000).toISOString(),
    source: 'AI_Discovered',
    tags: ['data', 'telecom'],
  },
  {
    id: 'int-003',
    title: 'Business Development Intern',
    company: 'NEOM',
    companyLogo: '',
    location: 'Riyadh',
    type: 'Business',
    duration: '4 months',
    salary: 'SAR 7,000/mo',
    deadline: new Date(Date.now() + 45 * 86400000).toISOString(),
    status: 'Open',
    description: 'Support NEOM\'s business development team in evaluating partnerships and market opportunities for the future city.',
    requirements: ['Business Analysis', 'Communication', 'Research', 'Presentation Skills'],
    perks: ['Exposure to mega-projects', 'Networking opportunities', 'Certificate of completion'],
    applicationLink: 'https://careers.neom.com',
    matchScore: 65,
    matchReasons: ['Strong communication skills', 'Interest in consulting'],
    aiRecommendation: 'Moderate match. This role leans business-heavy. Emphasize any project management or research experience.',
    missingRequirements: ['Business Analysis experience', 'Market research background'],
    dateAdded: new Date(Date.now() - 7 * 86400000).toISOString(),
    source: 'AI_Discovered',
    tags: ['business', 'mega-project', 'vision-2030'],
  },
  {
    id: 'int-004',
    title: 'Cybersecurity Intern',
    company: 'SADAIA',
    companyLogo: '',
    location: 'Riyadh',
    type: 'Government',
    duration: '3 months',
    deadline: new Date(Date.now() + 20 * 86400000).toISOString(),
    status: 'Open',
    description: 'Work with the national data and AI authority on cybersecurity initiatives protecting critical infrastructure.',
    requirements: ['Networking', 'Linux', 'Security Fundamentals', 'Python'],
    perks: ['Government experience', 'Security clearance pathway', 'Professional development'],
    applicationLink: 'https://sdaia.gov.sa/careers',
    matchScore: 58,
    matchReasons: ['Python proficiency', 'Government sector interest'],
    aiRecommendation: 'Fair match. If you are interested in cybersecurity, take the CompTIA Security+ practice test to demonstrate readiness.',
    missingRequirements: ['Networking knowledge', 'Linux proficiency', 'Security certification'],
    dateAdded: new Date(Date.now() - 1 * 86400000).toISOString(),
    source: 'AI_Discovered',
    tags: ['security', 'government', 'AI'],
  },
  {
    id: 'int-005',
    title: 'UX Research Intern',
    company: 'Noon',
    companyLogo: '',
    location: 'Riyadh',
    type: 'Technical',
    duration: '3 months',
    salary: 'SAR 5,500/mo',
    deadline: new Date(Date.now() + 10 * 86400000).toISOString(),
    status: 'Closing Soon',
    description: 'Conduct user research and usability testing to improve the Noon e-commerce platform experience.',
    requirements: ['UX Research', 'User Interviews', 'Figma', 'Data Analysis'],
    perks: ['Product discount', 'Flexible schedule', 'Portfolio building'],
    applicationLink: 'https://careers.noon.com',
    matchScore: 45,
    matchReasons: ['Data analysis background'],
    aiRecommendation: 'Low match for your technical profile, but could broaden your skillset if UX interests you.',
    missingRequirements: ['UX Research methods', 'Figma proficiency', 'User interview experience'],
    dateAdded: new Date(Date.now() - 3 * 86400000).toISOString(),
    source: 'AI_Discovered',
    tags: ['ux', 'e-commerce', 'design'],
  },
];

const MOCK_APPLICATIONS: Application[] = [
  {
    id: 'app-001',
    internshipId: 'int-001',
    internship: MOCK_INTERNSHIPS[0],
    status: 'Under_Review',
    savedDate: new Date(Date.now() - 10 * 86400000).toISOString(),
    appliedDate: new Date(Date.now() - 7 * 86400000).toISOString(),
    deadlineDate: MOCK_INTERNSHIPS[0].deadline,
    cvVersion: 'v2 - Tailored for Aramco',
    coverLetter: 'Custom cover letter highlighting cloud experience.',
    additionalDocs: [],
    notes: 'Referred by Ahmed from the engineering team.',
    aiSuggestions: [
      'Follow up within 2 weeks if no response',
      'Prepare for a technical coding assessment',
      'Research Aramco\'s digital transformation initiatives',
    ],
    confidenceScore: 78,
    createdDate: new Date(Date.now() - 10 * 86400000).toISOString(),
    lastUpdated: new Date(Date.now() - 1 * 86400000).toISOString(),
    autoApplied: false,
  },
  {
    id: 'app-002',
    internshipId: 'int-002',
    internship: MOCK_INTERNSHIPS[1],
    status: 'Saved',
    savedDate: new Date(Date.now() - 3 * 86400000).toISOString(),
    deadlineDate: MOCK_INTERNSHIPS[1].deadline,
    cvVersion: 'v1 - General',
    additionalDocs: [],
    notes: '',
    aiSuggestions: [
      'Deadline is approaching - apply within 5 days',
      'Add your SQL project to demonstrate data skills',
      'Customize your CV to emphasize analytics coursework',
    ],
    confidenceScore: 62,
    createdDate: new Date(Date.now() - 3 * 86400000).toISOString(),
    lastUpdated: new Date(Date.now() - 3 * 86400000).toISOString(),
    autoApplied: false,
  },
  {
    id: 'app-003',
    internshipId: 'int-003',
    internship: MOCK_INTERNSHIPS[2],
    status: 'Interview_Scheduled',
    savedDate: new Date(Date.now() - 20 * 86400000).toISOString(),
    appliedDate: new Date(Date.now() - 15 * 86400000).toISOString(),
    deadlineDate: MOCK_INTERNSHIPS[2].deadline,
    interviewDate: new Date(Date.now() + 3 * 86400000).toISOString(),
    cvVersion: 'v3 - NEOM Focused',
    coverLetter: 'Tailored letter emphasizing Vision 2030 alignment.',
    additionalDocs: ['portfolio-link'],
    notes: 'Interview with HR, then panel with team leads.',
    aiSuggestions: [
      'Research NEOM\'s latest project announcements',
      'Prepare STAR method answers for behavioral questions',
      'Dress formally - NEOM values professionalism',
    ],
    confidenceScore: 71,
    interviewType: 'Video',
    interviewLocation: 'Microsoft Teams',
    interviewNotes: 'Two rounds: HR screening then team interview',
    interviewerName: 'Sarah Al-Rashid, HR Manager',
    createdDate: new Date(Date.now() - 20 * 86400000).toISOString(),
    lastUpdated: new Date(Date.now() - 1 * 86400000).toISOString(),
    autoApplied: false,
  },
];

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
    usedInApplications: ['app-001'],
    lastUsed: new Date(Date.now() - 7 * 86400000).toISOString(),
    createdDate: new Date(Date.now() - 30 * 86400000).toISOString(),
    lastModified: new Date(Date.now() - 7 * 86400000).toISOString(),
  },
  {
    id: 'doc-002',
    type: 'CV',
    name: 'Aramco Tailored CV',
    fileName: 'cv-aramco-v2.pdf',
    fileSize: 260000,
    mimeType: 'application/pdf',
    content: '',
    version: 2,
    baseDocumentId: 'doc-001',
    customizedFor: 'Saudi Aramco - Software Engineering Intern',
    isAIGenerated: false,
    isAICustomized: true,
    aiCustomizations: [
      'Added cloud computing keywords',
      'Reordered skills to prioritize Python and React',
      'Expanded capstone project description',
    ],
    targetRole: 'Software Engineering',
    targetIndustry: 'Oil & Gas',
    usedInApplications: ['app-001'],
    lastUsed: new Date(Date.now() - 7 * 86400000).toISOString(),
    createdDate: new Date(Date.now() - 10 * 86400000).toISOString(),
    lastModified: new Date(Date.now() - 7 * 86400000).toISOString(),
  },
  {
    id: 'doc-003',
    type: 'Cover_Letter',
    name: 'NEOM Cover Letter',
    fileName: 'cover-letter-neom.pdf',
    fileSize: 98000,
    mimeType: 'application/pdf',
    content: '',
    version: 1,
    customizedFor: 'NEOM - Business Development Intern',
    isAIGenerated: true,
    isAICustomized: true,
    aiCustomizations: [
      'Generated based on job requirements and profile',
      'Highlighted Vision 2030 alignment',
      'Emphasized leadership and research skills',
    ],
    targetRole: 'Business Development',
    targetIndustry: 'Consulting',
    usedInApplications: ['app-003'],
    lastUsed: new Date(Date.now() - 15 * 86400000).toISOString(),
    createdDate: new Date(Date.now() - 15 * 86400000).toISOString(),
    lastModified: new Date(Date.now() - 15 * 86400000).toISOString(),
  },
];

const MOCK_PROFILE: UserProfile = {
  id: 'user-001',
  name: 'Aljowharah Aljubair',
  email: '222410187@psu.edu.sa',
  phone: '+966 55 123 4567',
  university: 'Prince Sultan University',
  major: 'Computer Science',
  graduationYear: 2027,
  gpa: 3.25,
  photoUrl: '',
  preferredLocations: ['Riyadh', 'Dhahran', 'Remote'],
  preferredIndustries: ['Technology', 'Oil & Gas', 'Consulting'],
  preferredRoleTypes: ['Technical', 'Research'],
  minimumSalary: 5000,
  skills: ['Python', 'React', 'TypeScript', 'SQL', 'Git', 'Machine Learning', 'Data Analysis', 'Communication'],
  experience: [
    {
      id: 'exp-001',
      title: 'Teaching Assistant',
      company: 'KFUPM',
      location: 'Dhahran',
      startDate: '2025-01-15',
      endDate: '2025-06-15',
      isCurrent: false,
      description: 'Assisted in Data Structures and Algorithms course.',
      achievements: ['Mentored 40+ students', 'Created practice problem sets'],
    },
  ],
  education: [
    {
      id: 'edu-001',
      degree: 'Bachelor of Science',
      institution: 'King Fahd University of Petroleum & Minerals',
      major: 'Computer Science',
      startDate: '2022-09-01',
      gpa: 3.7,
      honors: 'Dean\'s List',
    },
  ],
  projects: [
    {
      id: 'proj-001',
      title: 'Smart Campus Navigation App',
      description: 'Built a campus navigation app using React Native with real-time indoor positioning.',
      technologies: ['React Native', 'TypeScript', 'Firebase', 'BLE Beacons'],
      role: 'Lead Developer',
      startDate: '2025-02-01',
      endDate: '2025-05-01',
      achievements: ['1000+ downloads', 'Featured in university tech showcase'],
    },
  ],
  certifications: [
    {
      id: 'cert-001',
      name: 'AWS Cloud Practitioner',
      issuer: 'Amazon Web Services',
      dateIssued: '2025-03-01',
      credentialId: 'AWS-CP-12345',
    },
  ],
  languages: [
    { language: 'Arabic', proficiency: 'Native' },
    { language: 'English', proficiency: 'Fluent' },
  ],
  linkedInUrl: 'https://linkedin.com/in/abdullah-alfarsi',
  githubUrl: 'https://github.com/abdullah-alfarsi',
  masterCVId: 'doc-001',
  swipeHistory: [],
  applicationHistory: ['app-001', 'app-002', 'app-003'],
  successPatterns: { acceptedCompanies: [], successfulKeywords: ['Python', 'React'], winningCVFeatures: ['quantified achievements'] },
  totalApplications: 3,
  autoAppliedCount: 0,
  interviewsScheduled: 1,
  offersReceived: 0,
  notificationsEnabled: true,
  aiSuggestionsEnabled: true,
  autoApplyEnabled: false,
  language: 'en',
  darkMode: false,
  createdDate: new Date(Date.now() - 60 * 86400000).toISOString(),
  lastLogin: new Date().toISOString(),
};

// ---------- Init / Seed ----------

export function initializeData(): void {
  const existingInternships = getItem<Internship[]>(STORAGE_KEYS.INTERNSHIPS, []);
  if (existingInternships.length === 0) {
    setItem(STORAGE_KEYS.INTERNSHIPS, MOCK_INTERNSHIPS);
  }
  const existingApplications = getItem<Application[]>(STORAGE_KEYS.APPLICATIONS, []);
  if (existingApplications.length === 0) {
    setItem(STORAGE_KEYS.APPLICATIONS, MOCK_APPLICATIONS);
  }
  const existingDocuments = getItem<Document[]>(STORAGE_KEYS.DOCUMENTS, []);
  if (existingDocuments.length === 0) {
    setItem(STORAGE_KEYS.DOCUMENTS, MOCK_DOCUMENTS);
  }
  const existingProfile = getItem<UserProfile | null>(STORAGE_KEYS.PROFILE, null);
  if (!existingProfile) {
    setItem(STORAGE_KEYS.PROFILE, MOCK_PROFILE);
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

export function createApplication(data: Omit<Application, 'id' | 'createdDate' | 'lastUpdated'>): Application {
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

export function updateApplication(id: string, data: Partial<Application>): Application | undefined {
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

export function createDocument(data: Omit<Document, 'id' | 'createdDate' | 'lastModified'>): Document {
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
