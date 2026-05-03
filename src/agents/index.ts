// src/agents/index.ts — barrel export
export { TeamLeaderAgent } from "./TeamLeaderAgent";
export { RecruitingAgent } from "./RecruitingAgent";
export { DevPlanningAgent } from "./DevPlanningAgent";
export { QualityTestingManager } from "./QualityTestingManager";
export type {
  AgentRole, AgentMessage, StudentProfile,
  Opportunity, OpportunityCard, SwipePreference, AgentSystemState,
} from "./types";

// ══════════════════════════════════════════════════════════════
// HOW TO WIRE INTO EXISTING FURSA PAGES
// ══════════════════════════════════════════════════════════════

// ── 1. Wrap App.tsx with AgentProvider ────────────────────────
//
// import { AgentProvider } from './context/AgentContext'
//
// function App() {
//   return (
//     <AgentProvider>
//       <CVUpload />          ← shows until CV is uploaded
//       <Router>...</Router>  ← existing routes unchanged
//     </AgentProvider>
//   )
// }

// ── 2. Discover Page (swipe) ──────────────────────────────────
//
// import { useAgentSystem } from '../context/AgentContext'
//
// export function DiscoverPage() {
//   const { state, swipeRight, swipeLeft } = useAgentSystem()
//   const unseenCards = state.cards.filter(c => c.status === 'unseen')
//   const currentCard = unseenCards[0]
//
//   const handleSwipeRight = async () => {
//     const result = await swipeRight(currentCard)
//     // result.coverLetter → show in modal or Track page
//     // result.interviewTips → show in modal
//   }
//
//   const handleSwipeLeft = async () => {
//     await swipeLeft(currentCard)
//   }
//
//   // Cards come pre-ranked — just render them as before
//   return <YourExistingSwipeUI card={currentCard} onRight={handleSwipeRight} onLeft={handleSwipeLeft} />
// }

// ── 3. Track Page ─────────────────────────────────────────────
//
// import { useAgentSystem } from '../context/AgentContext'
//
// export function TrackPage() {
//   const { state } = useAgentSystem()
//   const likedCards = state.cards.filter(c => c.status === 'liked')
//
//   // Each card has: coverLetter, interviewTips, followUpDate, matchScore
//   // Planning agent already set deadlines and follow-up dates
//   return <YourExistingTracker applications={likedCards} />
// }

// ── 4. Profile Page ───────────────────────────────────────────
//
// import { useAgentSystem } from '../context/AgentContext'
//
// export function ProfilePage() {
//   const { state } = useAgentSystem()
//   const profile = state.profile   // auto-filled from CV
//
//   // No forms needed — profile is fully populated by Dev & Planning Agent
//   return <YourExistingProfile data={profile} />
// }
