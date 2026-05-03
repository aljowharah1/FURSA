// src/agents/agentBridge.ts
// Converts agent types → existing FURSA types
// so ALL existing components (CardStack, SwipeCard, TrackPage etc.)
// keep working without any changes.

import type { Internship, Application, UserProfile } from '../types';
import type { OpportunityCard, StudentProfile } from './types';
import { generateId } from '../utils/helpers';

// ── OpportunityCard → Internship ─────────────────────────────
// This is the key mapping. Every field the UI needs is filled.

export function cardToInternship(card: OpportunityCard): Internship {
  const o = card.opportunity;
  const now = new Date().toISOString();

  // Infer type from field
  const type: Internship['type'] =
    o.field.toLowerCase().includes('business') || o.field.toLowerCase().includes('marketing')
      ? 'Business'
      : o.field.toLowerCase().includes('research')
      ? 'Research'
      : o.field.toLowerCase().includes('government') || o.field.toLowerCase().includes('public')
      ? 'Government'
      : 'Technical';

  // Determine status from deadline
  const deadlineDate = o.deadline ? new Date(o.deadline) : new Date(Date.now() + 30 * 86400000);
  const daysLeft = (deadlineDate.getTime() - Date.now()) / 86400000;
  const status: Internship['status'] =
    daysLeft < 0 ? 'Closed' : daysLeft < 7 ? 'Closing Soon' : 'Open';

  return {
    id: o.id,
    title: o.title,
    company: o.company,
    companyLogo: '',
    location: o.location ?? 'Saudi Arabia',
    type,
    duration: '3 months',
    salary: undefined,
    deadline: deadlineDate.toISOString(),
    status,
    description: o.description,
    requirements: o.requirements,
    perks: [],
    applicationLink: o.applyUrl ?? '#',
    matchScore: card.matchScore,
    matchReasons: [card.matchReason],
    aiRecommendation: card.matchReason,
    // requirements not in student profile = missing
    missingRequirements: [],
    dateAdded: now,
    source: 'AI_Discovered' as const,
    tags: [o.field],
  };
}

// ── OpportunityCard → Application (after swipe right) ────────

export function cardToApplication(card: OpportunityCard): Omit<Application, 'id'> {
  const internship = cardToInternship(card);
  const now = new Date().toISOString();

  return {
    internshipId: internship.id,
    internship,
    status: 'Needs_Manual_Action',
    savedDate: now,
    appliedDate: undefined,
    deadlineDate: internship.deadline,
    cvVersion: 'default',
    coverLetter: card.coverLetter,
    additionalDocs: [],
    notes: card.interviewTips ? `Interview Tips:\n${card.interviewTips}` : '',
    aiSuggestions: [card.matchReason],
    confidenceScore: card.matchScore,
    createdDate: now,
    lastUpdated: now,
    autoApplied: false,
  };
}

// ── StudentProfile → UserProfile ──────────────────────────────
// Fills in the existing UserContext profile with agent-extracted data

export function studentToUserProfile(student: StudentProfile): Partial<UserProfile> {
  return {
    name: student.name,
    email: student.email ?? '',
    university: student.university ?? '',
    major: student.major,
    skills: student.skills,
    preferredIndustries: student.preferredFields,
    preferredLocations: ['Riyadh', 'Saudi Arabia'],
    preferredRoleTypes: student.preferredFields,
    // Don't map experience — it's raw text, not the UserProfile Experience[] format
    experience: [],
    education: [],
  };
}