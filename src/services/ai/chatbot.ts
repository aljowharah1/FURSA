import type { ChatMessage, Application, UserProfile, Internship } from '../../types';
import { generateId } from '../../utils/helpers';

interface ChatContext {
  applications: Application[];
  profile: UserProfile | null;
  internships: Internship[];
}

/**
 * Simulates sending a chat message and receiving an AI response.
 * Uses generateResponse internally with an empty context fallback.
 */
export async function sendChatMessage(
  content: string,
  _history: ChatMessage[]
): Promise<ChatMessage> {
  // Simulate network delay for realism
  await new Promise((resolve) => setTimeout(resolve, 800 + Math.random() * 1200));
  return generateResponse(content, { applications: [], profile: null, internships: [] });
}

function createMessage(content: string): ChatMessage {
  return {
    id: generateId(),
    role: 'assistant',
    content,
    timestamp: new Date().toISOString(),
  };
}

export function generateResponse(message: string, context: ChatContext): ChatMessage {
  const input = message.toLowerCase().trim();
  const { applications, profile, internships } = context;
  const name = profile?.name?.split(' ')[0] ?? 'there';

  // --- Greetings ---
  if (/^(hi|hello|hey|salam|good morning|good evening|assalam)/i.test(input)) {
    const activeApps = applications.filter(
      (a) => !['Rejected', 'Withdrawn', 'Accepted'].includes(a.status)
    );
    return createMessage(
      `Hello ${name}! Welcome back to CareerMate. You have ${activeApps.length} active application${activeApps.length !== 1 ? 's' : ''} and ${internships.filter((i) => i.status === 'Open').length} open internships to explore. How can I help you today?`
    );
  }

  // --- Application status queries ---
  if (/application|status|progress|track/i.test(input)) {
    if (applications.length === 0) {
      return createMessage(
        "You haven't submitted any applications yet. Would you like me to help you find internships that match your profile?"
      );
    }
    const statusSummary = applications
      .map(
        (a) =>
          `- **${a.internship.title}** at ${a.internship.company}: ${a.status.replace(/_/g, ' ')}`
      )
      .join('\n');
    const interviews = applications.filter(
      (a) => a.status === 'Interview_Scheduled'
    );
    let extra = '';
    if (interviews.length > 0) {
      extra = `\n\nYou have ${interviews.length} upcoming interview${interviews.length !== 1 ? 's' : ''}. Don't forget to prepare!`;
    }
    return createMessage(
      `Here's a summary of your applications:\n\n${statusSummary}${extra}`
    );
  }

  // --- CV / Resume help ---
  if (/cv|resume|curriculum/i.test(input)) {
    const tips = [
      'Keep your CV to 1-2 pages for internship applications.',
      'Quantify your achievements (e.g., "Improved load time by 40%").',
      'Tailor your CV for each application by matching keywords from the job description.',
      'List your most relevant skills and projects first.',
      'Include links to your GitHub, LinkedIn, or portfolio.',
    ];
    const skillList =
      profile?.skills?.slice(0, 5).join(', ') ?? 'your key skills';
    return createMessage(
      `Here are some tips to strengthen your CV:\n\n${tips.map((t) => `- ${t}`).join('\n')}\n\nBased on your profile, make sure to highlight: **${skillList}**. Would you like me to generate a tailored CV for a specific internship?`
    );
  }

  // --- Interview tips ---
  if (/interview|prepare|preparation/i.test(input)) {
    const scheduled = applications.filter(
      (a) => a.status === 'Interview_Scheduled'
    );
    let interviewInfo = '';
    if (scheduled.length > 0) {
      const next = scheduled[0];
      interviewInfo = `\n\nYour next interview is for **${next.internship.title}** at ${next.internship.company}${next.interviewType ? ` (${next.interviewType})` : ''}. `;
    }
    return createMessage(
      `Here are some interview preparation tips:${interviewInfo}\n\n` +
        '- **Research the company**: Understand their mission, recent news, and culture.\n' +
        '- **Practice STAR method**: Situation, Task, Action, Result for behavioral questions.\n' +
        '- **Prepare questions**: Have 2-3 thoughtful questions ready for the interviewer.\n' +
        '- **Technical prep**: Review data structures, algorithms, and relevant technologies.\n' +
        '- **Test your setup**: For video interviews, check your camera, mic, and internet.\n' +
        '- **Follow up**: Send a thank-you email within 24 hours after the interview.'
    );
  }

  // --- Job search / Recommendations ---
  if (/find|search|recommend|suggest|internship|job|opportunity/i.test(input)) {
    const open = internships.filter((i) => i.status !== 'Closed');
    if (open.length === 0) {
      return createMessage(
        "No open internships available right now. I'll notify you when new opportunities matching your profile come up!"
      );
    }
    const top = [...open]
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 3);
    const list = top
      .map(
        (i) =>
          `- **${i.title}** at ${i.company} (${i.matchScore}% match) — ${i.location}, ${i.duration}`
      )
      .join('\n');
    return createMessage(
      `Based on your profile, here are the top internship matches:\n\n${list}\n\nWould you like more details on any of these, or should I search with different criteria?`
    );
  }

  // --- Salary / Compensation ---
  if (/salary|pay|compensation|money/i.test(input)) {
    const withSalary = internships.filter((i) => i.salary);
    if (withSalary.length === 0) {
      return createMessage(
        "Salary information isn't available for the current listings. In Saudi Arabia, tech internships typically range from SAR 3,000 to SAR 10,000/month depending on the company and role."
      );
    }
    const list = withSalary
      .map((i) => `- ${i.company}: ${i.salary}`)
      .join('\n');
    return createMessage(
      `Here's the salary information for available internships:\n\n${list}\n\nKeep in mind that benefits like housing, transportation, and training can add significant value beyond base compensation.`
    );
  }

  // --- Skills / Learning ---
  if (/skill|learn|improve|develop|course|certification/i.test(input)) {
    const allMissing = internships.flatMap((i) => i.missingRequirements);
    const unique = [...new Set(allMissing)].slice(0, 5);
    return createMessage(
      `Based on the internships you're interested in, here are skills to develop:\n\n${unique.map((s) => `- **${s}**`).join('\n')}\n\nI recommend platforms like Coursera, Udemy, or LinkedIn Learning for structured courses. Certifications from AWS, Google, or Microsoft can also boost your applications significantly.`
    );
  }

  // --- Deadline reminders ---
  if (/deadline|due|urgent|closing/i.test(input)) {
    const closing = internships
      .filter((i) => i.status === 'Closing Soon' || i.status === 'Open')
      .sort(
        (a, b) =>
          new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
      )
      .slice(0, 5);
    if (closing.length === 0) {
      return createMessage(
        "No upcoming deadlines at the moment. I'll alert you when new opportunities appear!"
      );
    }
    const list = closing
      .map((i) => {
        const days = Math.ceil(
          (new Date(i.deadline).getTime() - Date.now()) / 86400000
        );
        return `- **${i.title}** at ${i.company}: ${days > 0 ? `${days} days left` : 'Past deadline'}`;
      })
      .join('\n');
    return createMessage(
      `Here are upcoming deadlines:\n\n${list}\n\nDon't wait until the last minute — early applications often get more attention!`
    );
  }

  // --- Thank you / Positive ---
  if (/thank|thanks|great|awesome|perfect/i.test(input)) {
    return createMessage(
      `You're welcome, ${name}! I'm here whenever you need help with your career journey. Good luck with your applications!`
    );
  }

  // --- General career advice fallback ---
  return createMessage(
    `Great question! Here's some general career advice:\n\n` +
      '- Stay organized by tracking all your applications and deadlines.\n' +
      '- Network actively through LinkedIn and university career events.\n' +
      '- Tailor every application — generic submissions rarely stand out.\n' +
      '- Build a portfolio of projects to demonstrate practical skills.\n' +
      "- Don't be discouraged by rejections — they're a normal part of the process.\n\n" +
      'You can ask me about specific topics like **CV tips**, **interview prep**, **application status**, or **internship recommendations**. How can I help?'
  );
}
