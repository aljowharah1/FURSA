export interface Document {
  id: string;
  type: 'CV' | 'Cover_Letter' | 'Portfolio' | 'Transcript' | 'Other';
  name: string;
  fileName?: string;
  fileSize: number;
  mimeType: string;
  content?: string;
  version: number;
  baseDocumentId?: string;
  customizedFor?: string;
  isAIGenerated: boolean;
  isAICustomized: boolean;
  aiCustomizations: string[];
  targetRole?: string;
  targetIndustry?: string;
  usedInApplications: string[];
  lastUsed?: string;
  createdDate: string;
  lastModified: string;
}
