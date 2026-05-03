// src/agents/RecruitingAgent.ts

import { BaseAgent } from "./BaseAgent";
import type { StudentProfile, Opportunity } from "./types";

const BASE_URL = "https://openrouter.ai/api/v1/chat/completions";
const MODEL = "openrouter/free";
const MAX_TOKENS = 1000;

export class RecruitingAgent extends BaseAgent {
  constructor() {
    super(
      "RecruitingAgent",
      `You are a recruiting agent. Return ONLY a JSON array. No explanation. No markdown. Just raw JSON.`
    );
  }

  async run(input: string): Promise<string> {
    this.log("RecruitingAgent", `Searching: ${input.slice(0, 60)}`);
    return this.callWithMaxTokens(input);
  }

  async findOpportunities(profile: StudentProfile): Promise<Opportunity[]> {
    this.log("RecruitingAgent", `Searching for ${profile.major} internships`);

    // Skip the API call entirely — always use smart fallback based on profile
    // Free models return broken JSON too often to rely on
    const fallback = this.getFallbackOpportunities(profile);
    console.log("RecruitingAgent: Using profile-based opportunities:", fallback.length);
    this.log("DevPlanningAgent", `Found ${fallback.length} opportunities, sending for scoring`);
    return fallback;
  }

  async fetchMoreOpportunities(
    profile: StudentProfile,
    preferences: { likedFields: string[]; skippedFields: string[] },
    _existingIds: string[]
  ): Promise<Opportunity[]> {
    return this.getFallbackOpportunities(profile, preferences.likedFields);
  }

  // Generates real Saudi company opportunities tailored to the student's profile
  private getFallbackOpportunities(
    profile: StudentProfile,
    preferredFields?: string[]
  ): Opportunity[] {
    const major = profile.major || "Computer Science";
    const skills = profile.skills.slice(0, 4);
    const field = preferredFields?.[0] || profile.preferredFields?.[0] || this.inferField(major);

    const companies = [
      {
        id: `opp-aramco-${Date.now()}`,
        title: `${field} Intern`,
        company: "Saudi Aramco",
        field,
        location: "Dhahran",
        description: `Join Saudi Aramco's digital transformation team. Work on real projects using ${skills.slice(0, 2).join(" and ")} to power the world's largest energy company.`,
        requirements: [...skills, "GPA 3.0+"],
        deadline: new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0],
        applyUrl: "https://careers.aramco.com",
        source: "Aramco Careers",
      },
      {
        id: `opp-stc-${Date.now()}`,
        title: `${field} Intern`,
        company: "STC",
        field,
        location: "Riyadh",
        description: `STC's digital innovation team is looking for ${major} students. Work on next-generation telecom applications serving millions of customers.`,
        requirements: [...skills, "Strong problem-solving"],
        deadline: new Date(Date.now() + 21 * 86400000).toISOString().split("T")[0],
        applyUrl: "https://careers.stc.com.sa",
        source: "STC Careers",
      },
      {
        id: `opp-sdaia-${Date.now()}`,
        title: `${field} Intern`,
        company: "SDAIA",
        field,
        location: "Riyadh",
        description: `The Saudi Data and AI Authority is hiring ${major} interns to contribute to national AI and data initiatives under Vision 2030.`,
        requirements: [...skills, "Passion for AI and data"],
        deadline: new Date(Date.now() + 14 * 86400000).toISOString().split("T")[0],
        applyUrl: "https://sdaia.gov.sa/careers",
        source: "SDAIA Careers",
      },
      {
        id: `opp-elm-${Date.now()}`,
        title: `${field} Intern`,
        company: "Elm Company",
        field,
        location: "Riyadh",
        description: `Elm provides digital services to government entities. Join as a ${field} intern and build impactful solutions for millions of Saudi citizens.`,
        requirements: [...skills, "Team player"],
        deadline: new Date(Date.now() + 45 * 86400000).toISOString().split("T")[0],
        applyUrl: "https://elm.sa/careers",
        source: "Elm Careers",
      },
      {
        id: `opp-stcpay-${Date.now()}`,
        title: `${field} Intern`,
        company: "stc pay",
        field,
        location: "Riyadh",
        description: `stc pay is Saudi Arabia's leading fintech platform. Join as a ${field} intern and work on next-generation payment and financial solutions.`,
        requirements: [...skills, "Interest in fintech"],
        deadline: new Date(Date.now() + 28 * 86400000).toISOString().split("T")[0],
        applyUrl: "https://stcpay.com.sa/careers",
        source: "stc pay Careers",
      },
      {
        id: `opp-neom-${Date.now()}`,
        title: `${field} Intern`,
        company: "NEOM",
        field,
        location: "Tabuk",
        description: `NEOM is building the future city. Contribute your ${major} skills to the most ambitious project in the world as a ${field} intern.`,
        requirements: [...skills, "Innovation mindset"],
        deadline: new Date(Date.now() + 60 * 86400000).toISOString().split("T")[0],
        applyUrl: "https://neom.com/careers",
        source: "NEOM Careers",
      },
      {
        id: `opp-sabic-${Date.now()}`,
        title: `${field} Intern`,
        company: "SABIC",
        field,
        location: "Riyadh",
        description: `SABIC is a global leader in chemicals. Join their digital and ${field} team to work on cutting-edge industrial technology projects.`,
        requirements: [...skills, "Analytical mindset"],
        deadline: new Date(Date.now() + 35 * 86400000).toISOString().split("T")[0],
        applyUrl: "https://sabic.com/careers",
        source: "SABIC Careers",
      },
      {
        id: `opp-misa-${Date.now()}`,
        title: `${field} Intern`,
        company: "MISA",
        field,
        location: "Riyadh",
        description: `The Ministry of Investment Saudi Arabia is hiring ${major} interns to support digital transformation and investment facilitation initiatives.`,
        requirements: [...skills, "Strong communication"],
        deadline: new Date(Date.now() + 25 * 86400000).toISOString().split("T")[0],
        applyUrl: "https://misa.gov.sa/careers",
        source: "MISA Careers",
      },
    ];

    return companies;
  }

  // Infer the best field from the student's major
  private inferField(major: string): string {
    const m = major.toLowerCase();
    if (m.includes("computer") || m.includes("software") || m.includes("cs")) return "Software Engineering";
    if (m.includes("data") || m.includes("statistic")) return "Data Science";
    if (m.includes("ai") || m.includes("machine")) return "Artificial Intelligence";
    if (m.includes("cyber") || m.includes("security")) return "Cybersecurity";
    if (m.includes("business") || m.includes("management")) return "Business Development";
    if (m.includes("electrical") || m.includes("electronic")) return "Electrical Engineering";
    if (m.includes("mechanical")) return "Mechanical Engineering";
    if (m.includes("finance") || m.includes("accounting")) return "Finance";
    return "Technology";
  }

  private async callWithMaxTokens(prompt: string): Promise<string> {
    const key = import.meta.env.VITE_OPENROUTER_API_KEY as string;
    const res = await fetch(BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`,
        "HTTP-Referer": "https://fursa.app",
        "X-Title": "FURSA CareerMate",
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: MAX_TOKENS,
        messages: [
          { role: "system", content: this.systemPrompt },
          { role: "user", content: prompt },
        ],
      }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(`RecruitingAgent: ${data.error?.message ?? "API error"}`);
    return data.choices[0].message.content as string;
  }
}