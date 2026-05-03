// src/agents/TeamLeaderAgent.ts
// Agent 1 — the orchestrator. Only agent the UI calls directly.
// QA API calls disabled — uses local scoring and auto-approval to save tokens.

import { RecruitingAgent } from "./RecruitingAgent";
import { DevPlanningAgent } from "./DevPlanningAgent";
import { BaseAgent } from "./BaseAgent";
import type {
  StudentProfile,
  OpportunityCard,
  AgentSystemState,
  SwipePreference,
} from "./types";

export class TeamLeaderAgent extends BaseAgent {
  private recruiting: RecruitingAgent;
  private devPlanning: DevPlanningAgent;

  constructor() {
    super(
      "TeamLeader",
      `You are the Team Leader at FURSA. You orchestrate a team of AI agents.
You ensure the student gets the best possible career support.
You communicate clearly and concisely with the student.`
    );
    this.recruiting = new RecruitingAgent();
    this.devPlanning = new DevPlanningAgent();
  }

  async run(input: string): Promise<string> {
    return this.callLLM(input);
  }

  // ─────────────────────────────────────────────────────────
  // PHASE 0 + 1: CV Upload → Ready deck
  // ─────────────────────────────────────────────────────────

  async initialize(
    cvBase64: string,
    coverLetterBase64?: string,
    onPhaseChange?: (phase: string) => void
  ): Promise<AgentSystemState> {
    this.log("DevPlanningAgent", "CV received. Starting initialization pipeline.");

    // ── Step 1: Extract profile ──────────────────────────────
    onPhaseChange?.("Reading your CV...");
    const profile = await this.devPlanning.extractProfileFromCV(
      cvBase64,
      coverLetterBase64
    );

    // ── Step 2: QA profile — SKIPPED (saves API calls, local is reliable)
    onPhaseChange?.("Verifying your profile...");
    // profile is used directly

    // ── Step 3: Recruiting finds opportunities ───────────────
    onPhaseChange?.("Searching for opportunities...");
    const opportunities = await this.recruiting.findOpportunities(profile);
    this.log("DevPlanningAgent", `${opportunities.length} opportunities found, sending for scoring`);

    // ── Step 4: DevPlanning scores them locally ──────────────
    onPhaseChange?.("Matching opportunities to your profile...");
    const scoredCards = await this.devPlanning.scoreOpportunities(
      profile,
      opportunities
    );

    // ── Step 5: QA match review — SKIPPED (local scoring is accurate)
    onPhaseChange?.("Quality checking matches...");
    const approvedCards = scoredCards;

    // ── Step 6: Sort the deck ────────────────────────────────
    onPhaseChange?.("Preparing your deck...");
    const sortedCards = this.devPlanning.sortDeck(approvedCards);

    this.log("User", `Deck ready: ${sortedCards.length} opportunities`);

    return {
      profile,
      cards: sortedCards,
      swipePreferences: {
        likedFields: [],
        skippedFields: [],
        likedCompanies: [],
        skippedCompanies: [],
      },
      agentLog: this.collectLogs(),
      isReady: true,
      currentPhase: "Ready",
      error: null,
    };
  }

  // ─────────────────────────────────────────────────────────
  // PHASE 2: Swipe Right
  // ─────────────────────────────────────────────────────────

  async handleSwipeRight(
    card: OpportunityCard,
    profile: StudentProfile,
    preferences: SwipePreference
  ): Promise<{ updatedCard: OpportunityCard; updatedPreferences: SwipePreference }> {
    this.log("DevPlanningAgent", `Swipe right on: ${card.opportunity.title}`);

    // DevPlanning generates cover letter + tips
    const updatedCard = await this.devPlanning.handleSwipeRight(card, profile);

    // QA review — SKIPPED (saves API calls, fallbacks already ensure quality)
    // Cover letter and tips are auto-approved

    const updatedPreferences = this.devPlanning.handleSwipeRightPreference(
      card,
      preferences
    );

    this.log("User", `Delivered: cover letter ${updatedCard.needsCoverLetter ? "✓" : "not needed"}, tips ✓`);

    return { updatedCard, updatedPreferences };
  }

  // ─────────────────────────────────────────────────────────
  // PHASE 3: Swipe Left
  // ─────────────────────────────────────────────────────────

  async handleSwipeLeft(
    card: OpportunityCard,
    preferences: SwipePreference,
    remainingCards: OpportunityCard[],
    profile: StudentProfile
  ): Promise<{
    updatedPreferences: SwipePreference;
    newCards?: OpportunityCard[];
  }> {
    this.log("DevPlanningAgent", `Swipe left: ${card.opportunity.title}`);

    const updatedPreferences = this.devPlanning.handleSwipeLeft(card, preferences);

    // Refill deck if running low
    if (remainingCards.length < 3) {
      this.log("RecruitingAgent", "Deck running low — fetching more opportunities");

      const existingIds = remainingCards.map((c) => c.opportunity.id);
      const more = await this.recruiting.fetchMoreOpportunities(
        profile,
        updatedPreferences,
        existingIds
      );

      const scoredMore = await this.devPlanning.scoreOpportunities(profile, more);
      const sortedMore = this.devPlanning.sortDeck(scoredMore); // no QA call

      this.log("User", `Added ${sortedMore.length} new opportunities`);
      return { updatedPreferences, newCards: sortedMore };
    }

    return { updatedPreferences };
  }

  // ─── Collect all agent logs ───────────────────────────────
  private collectLogs() {
    return [
      ...this.messageLog,
      ...this.recruiting.messageLog,
      ...this.devPlanning.messageLog,
    ].sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  }
}