import type { Internship, UserProfile } from '../../types';

export function generateCoverLetter(internship: Internship, profile: UserProfile): string {
  const name = profile.name;
  const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  const matchedSkills = profile.skills.filter((skill) =>
    internship.requirements.some(
      (req) => req.toLowerCase().includes(skill.toLowerCase()) || skill.toLowerCase().includes(req.toLowerCase())
    )
  );

  const topProject = profile.projects[0];
  const topExperience = profile.experience[0];

  const projectSentence = topProject
    ? `In my recent project, "${topProject.title}", I ${topProject.description.charAt(0).toLowerCase()}${topProject.description.slice(1)}${topProject.achievements.length > 0 ? `, achieving ${topProject.achievements[0].toLowerCase()}` : ''}.`
    : '';

  const experienceSentence = topExperience
    ? `During my time as ${topExperience.title} at ${topExperience.company}, I developed strong professional skills${topExperience.achievements.length > 0 ? `, including ${topExperience.achievements[0].toLowerCase()}` : ''}.`
    : '';

  const skillsList = matchedSkills.length > 0
    ? matchedSkills.slice(0, 4).join(', ')
    : profile.skills.slice(0, 4).join(', ');

  return `${today}

Dear Hiring Manager,

I am writing to express my strong interest in the ${internship.title} position at ${internship.company}. As a ${profile.major} student at ${profile.university} with an expected graduation in ${profile.graduationYear}, I am excited about the opportunity to contribute to your team${internship.location ? ` in ${internship.location}` : ''}.

My academic background and hands-on experience have equipped me with strong skills in ${skillsList}, which directly align with the requirements for this role. ${projectSentence}

${experienceSentence} These experiences have strengthened my ability to work collaboratively, communicate effectively, and deliver results in professional settings.

I am particularly drawn to ${internship.company} because of ${internship.description.length > 100 ? internship.description.slice(0, 100).trimEnd() + '...' : internship.description}. The ${internship.duration} duration of this internship aligns perfectly with my academic schedule, and I am eager to bring my skills and enthusiasm to your team.

${profile.certifications.length > 0 ? `I also hold relevant certifications including ${profile.certifications.map((c) => c.name).join(', ')}, demonstrating my commitment to continuous professional development.\n\n` : ''}Thank you for considering my application. I would welcome the opportunity to discuss how my skills and experiences align with ${internship.company}'s goals. I am available for an interview at your convenience and can be reached at ${profile.email}${profile.phone ? ` or ${profile.phone}` : ''}.

Sincerely,
${name}
${profile.university}
${profile.email}${profile.linkedInUrl ? `\n${profile.linkedInUrl}` : ''}`;
}

export function customizeCV(internship: Internship, profile: UserProfile): string[] {
  const suggestions: string[] = [];

  // Skill gap analysis
  const matchedSkills: string[] = [];
  const missingSkills: string[] = [];
  for (const req of internship.requirements) {
    const found = profile.skills.some(
      (s) => req.toLowerCase().includes(s.toLowerCase()) || s.toLowerCase().includes(req.toLowerCase())
    );
    if (found) {
      matchedSkills.push(req);
    } else {
      missingSkills.push(req);
    }
  }

  if (matchedSkills.length > 0) {
    suggestions.push(`Move these matching skills to the top of your Skills section: ${matchedSkills.join(', ')}`);
  }

  if (missingSkills.length > 0) {
    suggestions.push(`Consider adding related experience or coursework for: ${missingSkills.join(', ')}`);
  }

  // Tailor summary
  suggestions.push(
    `Update your professional summary to mention interest in ${internship.type.toLowerCase()} roles at ${internship.company}`
  );

  // Project relevance
  const relevantProjects = profile.projects.filter((p) =>
    p.technologies.some((tech) =>
      internship.requirements.some((req) => req.toLowerCase().includes(tech.toLowerCase()))
    )
  );
  if (relevantProjects.length > 0) {
    suggestions.push(
      `Highlight project "${relevantProjects[0].title}" prominently — its technologies match the job requirements`
    );
  } else if (profile.projects.length > 0) {
    suggestions.push('Reframe your project descriptions to emphasize transferable skills relevant to this role');
  }

  // Keywords
  suggestions.push(`Include these keywords from the job posting: ${internship.requirements.slice(0, 3).join(', ')}`);

  // Experience ordering
  if (profile.experience.length > 1) {
    suggestions.push('Reorder your experience to place the most relevant role first');
  }

  // Quantify achievements
  suggestions.push('Ensure all achievements use numbers (e.g., "Improved performance by 30%", "Led team of 5")');

  // Format for ATS
  suggestions.push('Use a clean, single-column format to ensure ATS (Applicant Tracking System) compatibility');

  return suggestions;
}
