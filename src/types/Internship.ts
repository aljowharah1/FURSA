export interface Internship {
  id: string;
  title: string;
  company: string;
  companyLogo: string;
  location: string;
  type: 'Technical' | 'Business' | 'Research' | 'Government';
  duration: string;
  salary?: string;
  deadline: string;
  status: 'Open' | 'Closing Soon' | 'Closed';
  description: string;
  requirements: string[];
  perks: string[];
  applicationLink: string;
  matchScore: number;
  matchReasons: string[];
  aiRecommendation: string;
  missingRequirements: string[];
  dateAdded: string;
  source: 'AI_Discovered' | 'User_Added';
  tags: string[];
}
