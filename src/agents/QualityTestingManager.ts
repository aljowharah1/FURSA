// src/agents/QualityTestingManager.ts
// Agent 4 — reviews every output before it reaches the student.
// Can approve, request revision, or auto-fix.

import { BaseAgent } from "./BaseAgent";
import type { StudentProfile, OpportunityCard } from "./types";

export interface QAResult {
  approved: boolean;
  score: number;        // 1-10
  issues: string[];
  fixedOutput: string;  // always provides improved version
  summary: string;
}

export class QualityTestingManager extends BaseAgent {
  constructor() {
    super(
      "QualityTestingManager",
      `You are the Quality & Testing Manager at FURSA, a career platform for university students.

You review ALL outputs before they reach the student. You are the last gate.

You evaluate on:
1. ACCURACY — does the content match the student's actual profile?
2. RELEVANCE — does it address the specific opportunity/request?
3. TONE — professional, appropriate for career context?
4. COMPLETENESS — all required elements present?
5. QUALITY — good enough to help the student succeed?

Always respond with ONLY valid JSON:
{
  "approved": true/false,
  "score": <1-10>,
  "issues": ["issue1", "issue2"],
  "fixedOutput": "<corrected full output>",
  "summary": "one sentence review"
}

Score >= 7 = approved. Score < 7 = not approved but always provide fixedOutput anyway.
Never return anything outside the JSON.`
    );
  }

  async run(input: string): Promise<string> {
    return this.callLLM(input);
  }

  // ─── Review student profile extraction ─────────────────────

  async reviewProfile(profile: StudentProfile): Promise<{
    approved: boolean;
    missingFields: string[];
    fixedProfile: StudentProfile;
  }> {
    this.log("QualityTestingManager", "Reviewing extracted student profile");

    const missingFields: string[] = [];
    if (!profile.name || profile.name === "Unknown") missingFields.push("name");
    if (!profile.major || profile.major === "Unknown") missingFields.push("major");
    if (profile.skills.length === 0) missingFields.push("skills");
    if (profile.preferredFields.length === 0) missingFields.push("preferredFields");

    // If major fields are missing, ask LLM to infer from rawCV
    if (missingFields.length > 0 && profile.rawCV) {
      this.log("QualityTestingManager", `Profile missing: ${missingFields.join(", ")} — attempting to infer from CV text`);

      const prompt = `A CV was parsed but these fields are missing or empty: ${missingFields.join(", ")}.
Here is the raw CV text:
${profile.rawCV.slice(0, 2000)}

Infer the missing fields and return ONLY JSON:
{
  "name": "inferred or Unknown",
  "major": "inferred or Unknown",
  "skills": ["skill1", ...],
  "preferredFields": ["field1", ...]
}`;

      const raw = await this.callLLM(prompt);
      const inferred = this.parseJSON<Partial<StudentProfile>>(raw, {});

      const fixedProfile: StudentProfile = {
        ...profile,
        name: profile.name === "Unknown" ? (inferred.name ?? "Unknown") : profile.name,
        major: profile.major === "Unknown" ? (inferred.major ?? "Unknown") : profile.major,
        skills: profile.skills.length === 0 ? (inferred.skills ?? []) : profile.skills,
        preferredFields: profile.preferredFields.length === 0 ? (inferred.preferredFields ?? []) : profile.preferredFields,
      };

      this.log("TeamLeader", `Profile reviewed. Fixed fields: ${missingFields.join(", ")}`);
      return { approved: missingFields.length === 0, missingFields, fixedProfile };
    }

    this.log("TeamLeader", "Profile review passed");
    return { approved: true, missingFields, fixedProfile: profile };
  }

  // ─── Review match scores ────────────────────────────────────

  async reviewMatchScores(
    cards: OpportunityCard[],
    profile: StudentProfile
  ): Promise<OpportunityCard[]> {
    this.log("QualityTestingManager", `Reviewing ${cards.length} match scores`);

    const prompt = `Review these internship match scores for accuracy.

STUDENT: ${profile.major}, skills: ${profile.skills.join(", ")}

SCORED OPPORTUNITIES:
${cards.map((c, i) => `[${i}] ${c.opportunity.title} @ ${c.opportunity.company}
  Score: ${c.matchScore}/100
  Reason: ${c.matchReason}
  Requirements: ${c.opportunity.requirements.join(", ")}`).join("\n\n")}

For each, verify the score is accurate. Return JSON array:
[
  {
    "index": 0,
    "approvedScore": <keep or adjusted score>,
    "approved": true/false,
    "note": "why you adjusted or approved"
  }
]
JSON only.`;

    const raw = await this.callLLM(prompt);
    const reviews = this.parseJSON<Array<{
      index: number;
      approvedScore: number;
      approved: boolean;
      note: string;
    }>>(raw, []);

    return cards.map((card, i) => {
      const review = reviews.find((r) => r.index === i);
      if (!review) return { ...card, qualityApproved: true };

      return {
        ...card,
        matchScore: review.approvedScore ?? card.matchScore,
        qualityApproved: review.approved,
        qualityScore: review.approvedScore,
        qualityNotes: review.note,
      };
    }).filter((c) => c.qualityApproved); // remove cards QA rejected as bad matches
  }

  // ─── Review cover letter ────────────────────────────────────

  async reviewCoverLetter(
    coverLetter: string,
    opportunity: OpportunityCard["opportunity"],
    profile: StudentProfile
  ): Promise<QAResult> {
    this.log("QualityTestingManager", `Reviewing cover letter for ${opportunity.title} @ ${opportunity.company}`);

    const prompt = `Review this cover letter:

CONTEXT:
- Student: ${profile.name}, ${profile.major}
- Role: ${opportunity.title} at ${opportunity.company}
- Requirements: ${opportunity.requirements.join(", ")}

COVER LETTER:
${coverLetter}

Evaluate and return JSON review.`;

    const raw = await this.callLLM(prompt);
    const result = this.parseJSON<QAResult>(raw, {
      approved: true,
      score: 7,
      issues: [],
      fixedOutput: coverLetter,
      summary: "Passed (fallback)",
    });

    this.log("TeamLeader", `Cover letter QA: ${result.score}/10 — ${result.approved ? "approved" : "revised"}`);
    return result;
  }

  // ─── Review interview tips ──────────────────────────────────

  async reviewInterviewTips(tips: string, role: string): Promise<QAResult> {
    this.log("QualityTestingManager", `Reviewing interview tips for ${role}`);

    const prompt = `Review these interview preparation tips for a ${role} role:

${tips}

Are they specific, practical, and relevant? Return JSON review.`;

    const raw = await this.callLLM(prompt);
    return this.parseJSON<QAResult>(raw, {
      approved: true,
      score: 7,
      issues: [],
      fixedOutput: tips,
      summary: "Passed (fallback)",
    });
  }
}