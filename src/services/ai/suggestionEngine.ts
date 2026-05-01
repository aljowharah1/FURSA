import type { Application, UserProfile } from '../../types';

export function getApplicationSuggestions(application: Application): string[] {
  const suggestions: string[] = [];
  const { status, internship, confidenceScore } = application;

  switch (status) {
    case 'Saved':
      suggestions.push(`Deadline for ${internship.company} is approaching — don't wait too long to apply.`);
      suggestions.push('Customize your CV to match the job requirements before submitting.');
      if (confidenceScore < 60) {
        suggestions.push('Your match score is moderate. Consider strengthening your application with a strong cover letter.');
      }
      suggestions.push('Review the requirements and address any gaps in your cover letter.');
      break;

    case 'Needs_Manual_Action':
      suggestions.push('This application requires manual steps on the company portal.');
      suggestions.push('Complete all required fields and double-check for accuracy before submitting.');
      suggestions.push('Save a copy of your submitted application for your records.');
      break;

    case 'Auto_Applied':
    case 'Submitted':
      suggestions.push('Your application has been submitted. Follow up in 1-2 weeks if you don\'t hear back.');
      suggestions.push(`Connect with ${internship.company} employees on LinkedIn to increase visibility.`);
      suggestions.push('Continue applying to other positions while waiting for a response.');
      break;

    case 'Under_Review':
      suggestions.push('Your application is being reviewed — this is a positive sign!');
      suggestions.push('Start preparing for potential interview questions about your experience.');
      suggestions.push(`Research ${internship.company}'s recent news and projects.`);
      break;

    case 'Interview_Scheduled':
      suggestions.push('Congratulations on the interview! Practice your introduction and key talking points.');
      if (application.interviewType === 'Technical') {
        suggestions.push('Review data structures, algorithms, and coding fundamentals.');
        suggestions.push('Practice whiteboard/coding problems on LeetCode or HackerRank.');
      } else if (application.interviewType === 'HR') {
        suggestions.push('Prepare answers for behavioral questions using the STAR method.');
        suggestions.push('Have questions ready about company culture and growth opportunities.');
      }
      suggestions.push('Test your equipment if it\'s a video interview (camera, mic, internet).');
      suggestions.push('Prepare a 60-second elevator pitch about yourself.');
      break;

    case 'Offer_Received':
      suggestions.push('Congratulations on the offer! Take time to review all terms carefully.');
      suggestions.push('Consider salary, benefits, learning opportunities, and career growth.');
      suggestions.push('It\'s okay to negotiate — research market rates for similar positions.');
      if (application.offerDeadline) {
        suggestions.push(`Remember to respond before the offer deadline.`);
      }
      break;

    case 'Rejected':
      suggestions.push('Don\'t be discouraged — rejection is a normal part of the process.');
      suggestions.push('Request feedback from the recruiter to improve future applications.');
      suggestions.push('Review what you could strengthen and apply to similar roles.');
      if (application.aiLearnings && application.aiLearnings.length > 0) {
        suggestions.push(`Key learning: ${application.aiLearnings[0]}`);
      }
      break;

    case 'Accepted':
      suggestions.push('Congratulations! Prepare for your first day by researching the team and company.');
      suggestions.push('Set clear goals for what you want to learn during the internship.');
      suggestions.push('Connect with your future team on LinkedIn before your start date.');
      break;

    default:
      suggestions.push('Keep your application materials updated and ready for new opportunities.');
  }

  return suggestions;
}

export function getInterviewTips(application: Application): string[] {
  const tips: string[] = [];
  const { internship, interviewType } = application;

  // General tips
  tips.push(`Research ${internship.company}: Understand their mission, products, and recent news.`);
  tips.push('Arrive 10 minutes early (or join the video call 5 minutes early).');
  tips.push('Bring copies of your CV, a notepad, and a pen.');

  // Type-specific tips
  switch (interviewType) {
    case 'Phone':
      tips.push('Find a quiet location with good phone reception.');
      tips.push('Have your CV and notes in front of you for reference.');
      tips.push('Speak clearly and at a moderate pace.');
      break;
    case 'Video':
      tips.push('Test your camera, microphone, and internet connection beforehand.');
      tips.push('Choose a clean, well-lit background.');
      tips.push('Dress professionally from head to toe — you might need to stand up.');
      tips.push('Look at the camera (not the screen) to maintain eye contact.');
      break;
    case 'In-Person':
      tips.push('Plan your route and account for traffic or delays.');
      tips.push('Dress formally and maintain good posture throughout.');
      tips.push('Greet everyone you meet with a firm handshake and a smile.');
      break;
    case 'Technical':
      tips.push('Review fundamentals: data structures, algorithms, and system design basics.');
      tips.push('Practice coding problems for 30-60 minutes daily leading up to the interview.');
      tips.push('Think out loud during problem-solving to show your reasoning process.');
      tips.push(`Review technologies in the job posting: ${internship.requirements.slice(0, 3).join(', ')}.`);
      break;
    case 'HR':
      tips.push('Prepare STAR method responses for common behavioral questions.');
      tips.push('Have a clear answer for "Tell me about yourself" and "Why this company?"');
      tips.push('Research the company culture and values to show alignment.');
      break;
  }

  // Role-specific
  if (internship.type === 'Technical') {
    tips.push('Be ready to discuss your technical projects in detail.');
  } else if (internship.type === 'Business') {
    tips.push('Prepare a brief case study or example of business analysis you\'ve done.');
  }

  tips.push('Prepare 2-3 thoughtful questions to ask the interviewer.');
  tips.push('Send a thank-you email within 24 hours after the interview.');

  return tips;
}

export interface ProfileAssessment {
  score: number;
  strengths: string[];
  suggestions: string[];
}

export function getProfileImprovements(profile: UserProfile): ProfileAssessment {
  const strengths: string[] = [];
  const suggestions: string[] = [];
  let score = 0;

  // Name and contact (10 pts)
  if (profile.name && profile.email) {
    score += 10;
    strengths.push('Contact information is complete.');
  } else {
    suggestions.push('Complete your name and email to enable applications.');
  }

  // Education (10 pts)
  if (profile.education.length > 0) {
    score += 10;
    strengths.push('Education details are filled in.');
  } else {
    suggestions.push('Add your education details — this is essential for internship applications.');
  }

  // GPA (5 pts)
  if (profile.gpa && profile.gpa >= 3.0) {
    score += 5;
    strengths.push(`GPA of ${profile.gpa} is competitive for internships.`);
  } else if (profile.gpa) {
    score += 2;
    suggestions.push('Consider highlighting other strengths to compensate for GPA.');
  } else {
    suggestions.push('Adding your GPA can strengthen applications (if 3.0+).');
  }

  // Skills (15 pts)
  if (profile.skills.length >= 8) {
    score += 15;
    strengths.push(`Strong skill set with ${profile.skills.length} listed skills.`);
  } else if (profile.skills.length >= 4) {
    score += 10;
    suggestions.push('Add more skills to improve matching accuracy. Aim for 8-12 relevant skills.');
  } else {
    score += 3;
    suggestions.push('Your skills list is thin. Add technical and soft skills relevant to your target roles.');
  }

  // Experience (15 pts)
  if (profile.experience.length >= 2) {
    score += 15;
    strengths.push('Multiple experiences demonstrate well-rounded background.');
  } else if (profile.experience.length === 1) {
    score += 10;
    suggestions.push('Add more experience entries — include volunteer work, freelance, or campus roles.');
  } else {
    suggestions.push('Add at least one experience entry. Even academic or volunteer work counts.');
  }

  // Projects (15 pts)
  if (profile.projects.length >= 2) {
    score += 15;
    strengths.push('Portfolio of projects showcases practical skills.');
  } else if (profile.projects.length === 1) {
    score += 8;
    suggestions.push('Add more projects to demonstrate breadth of skills.');
  } else {
    suggestions.push('Add projects to your profile — they are crucial for technical internship applications.');
  }

  // Certifications (10 pts)
  if (profile.certifications.length > 0) {
    score += 10;
    strengths.push(`${profile.certifications.length} certification${profile.certifications.length > 1 ? 's' : ''} added — great for standing out.`);
  } else {
    suggestions.push('Earn a certification (e.g., AWS, Google, or Microsoft) to boost your profile.');
  }

  // Online presence (10 pts)
  let presenceScore = 0;
  if (profile.linkedInUrl) presenceScore += 4;
  else suggestions.push('Add your LinkedIn URL for professional networking visibility.');
  if (profile.githubUrl) presenceScore += 3;
  else suggestions.push('Add your GitHub URL to showcase your code.');
  if (profile.portfolioUrl) presenceScore += 3;
  else suggestions.push('Consider creating a portfolio website to stand out.');
  score += presenceScore;
  if (presenceScore >= 7) {
    strengths.push('Strong online presence with multiple profile links.');
  }

  // Preferences (5 pts)
  if (profile.preferredLocations.length > 0 && profile.preferredIndustries.length > 0) {
    score += 5;
    strengths.push('Job preferences are configured for accurate matching.');
  } else {
    suggestions.push('Set your location and industry preferences to get better internship matches.');
  }

  // Languages (5 pts)
  if (profile.languages.length >= 2) {
    score += 5;
    strengths.push('Bilingual/multilingual profile is a strong asset.');
  } else if (profile.languages.length === 1) {
    score += 2;
    suggestions.push('Add additional languages to broaden your opportunities.');
  }

  return { score: Math.min(score, 100), strengths, suggestions };
}
