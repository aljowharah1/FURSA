import type { Internship, UserProfile } from '../../types';

export interface MatchResult {
  score: number;
  reasons: string[];
  missingReqs: string[];
  recommendation: string;
}

export function calculateMatchScore(internship: Internship, profile: UserProfile): MatchResult {
  const reasons: string[] = [];
  const missingReqs: string[] = [];
  let score = 0;
  let maxScore = 0;

  // --- Skill matching (up to 40 points) ---
  const profileSkillsLower = profile.skills.map((s) => s.toLowerCase());
  const matchedSkills: string[] = [];
  for (const req of internship.requirements) {
    maxScore += 10;
    const reqLower = req.toLowerCase();
    const found = profileSkillsLower.some(
      (s) => reqLower.includes(s) || s.includes(reqLower)
    );
    if (found) {
      score += 10;
      matchedSkills.push(req);
    } else {
      missingReqs.push(req);
    }
  }
  if (matchedSkills.length > 0) {
    reasons.push(`Skills match: ${matchedSkills.join(', ')}`);
  }

  // --- Location preference (up to 15 points) ---
  maxScore += 15;
  const locationMatch = profile.preferredLocations.some(
    (loc) =>
      internship.location.toLowerCase().includes(loc.toLowerCase()) ||
      loc.toLowerCase().includes(internship.location.toLowerCase())
  );
  if (locationMatch) {
    score += 15;
    reasons.push(`Location "${internship.location}" matches your preferences`);
  }

  // --- Role type preference (up to 15 points) ---
  maxScore += 15;
  if (profile.preferredRoleTypes.includes(internship.type)) {
    score += 15;
    reasons.push(`Role type "${internship.type}" is in your preferred categories`);
  }

  // --- Industry preference (up to 10 points) ---
  maxScore += 10;
  const tagLower = internship.tags.map((t) => t.toLowerCase());
  const industryMatch = profile.preferredIndustries.some((ind) =>
    tagLower.some(
      (tag) => tag.includes(ind.toLowerCase()) || ind.toLowerCase().includes(tag)
    )
  );
  if (industryMatch) {
    score += 10;
    reasons.push('Industry aligns with your interests');
  }

  // --- Experience relevance (up to 10 points) ---
  maxScore += 10;
  const hasRelevantExp = profile.experience.some((exp) => {
    const combined = `${exp.title} ${exp.description}`.toLowerCase();
    return internship.requirements.some((req) =>
      combined.includes(req.toLowerCase())
    );
  });
  if (hasRelevantExp) {
    score += 10;
    reasons.push('Your past experience is relevant to this role');
  }

  // --- GPA bonus (up to 5 points) ---
  maxScore += 5;
  if (profile.gpa && profile.gpa >= 3.5) {
    score += 5;
    reasons.push(`Strong GPA (${profile.gpa}) meets typical requirements`);
  } else if (profile.gpa && profile.gpa >= 3.0) {
    score += 3;
    reasons.push('GPA meets minimum threshold');
  }

  // --- Salary alignment (up to 5 points) ---
  maxScore += 5;
  if (internship.salary && profile.minimumSalary) {
    const salaryNum = parseFloat(internship.salary.replace(/[^0-9.]/g, ''));
    if (!isNaN(salaryNum) && salaryNum >= profile.minimumSalary) {
      score += 5;
      reasons.push('Salary meets your minimum requirement');
    }
  } else {
    score += 2; // neutral if not specified
  }

  // Normalize to 0-100
  const normalized = maxScore > 0 ? Math.round((score / maxScore) * 100) : 50;

  // Generate recommendation
  let recommendation: string;
  if (normalized >= 80) {
    recommendation = `Excellent match! You meet most requirements for "${internship.title}" at ${internship.company}. Apply with confidence and highlight your matching skills.`;
  } else if (normalized >= 60) {
    recommendation = `Good match for "${internship.title}" at ${internship.company}. Consider addressing missing skills in your cover letter and emphasize transferable experience.`;
  } else if (normalized >= 40) {
    recommendation = `Moderate match. You may need to develop some skills before applying to "${internship.title}" at ${internship.company}. Consider this a stretch opportunity.`;
  } else {
    recommendation = `This role at ${internship.company} may not be the best fit right now. Focus on building the required skills or explore closer matches.`;
  }

  return { score: normalized, reasons, missingReqs, recommendation };
}
