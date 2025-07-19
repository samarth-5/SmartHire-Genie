// interface Feedback {
//   id: string;
//   interviewId: string;
//   totalScore: number;
//   categoryScores: Array<{
//     name: string;
//     score: number;
//     comment: string;
//   }>;
//   strengths: string[];
//   areasForImprovement: string[];
//   finalAssessment: string;
//   createdAt: string;
// }
export interface Feedback {
  interviewId: string;
  userId: string;
  totalScore: number;
  categoryScores: CategoryScore[];
  strengths: string[];
  areasForImprovement: string[];
  finalAssessment: string;
  createdAt: string; // ISO string
}

export interface CategoryScore {
  name: string;
  score: number;
  comment: string;
}

interface CreateFeedbackParams {
  interviewId: string;
  userId: string;
  transcript: { role: string; content: string }[];
  feedbackId?: string;
}

interface AgentProps {
  userName: string;
  userId?: string;
  interviewId?: string;
  feedbackId?: string;
  type: "generate" | "interview";
  questions?: string[];
}

interface RouteParams {
  params: Promise<Record<string, string>>;
  searchParams: Promise<Record<string, string>>;
}

interface GetFeedbackByInterviewIdParams {
  interviewId: string;
  userId: string;
}

interface Interview {
  id: String;
  role: string;
  level: string;
  questions: string[];
  techstack: string[];
  createdAt: string;
  userId: string;
  type: string;
  finalized: boolean;
  taken: boolean;
  coverImage?: {
    src: string;
    height?: number;
    width?: number;
    blurDataURL?: string | null;
    blurHeight?: number;
    blurWidth?: number;
  };
}

interface InterviewCardProps {
  interviewId?: string;
  userId?: string;
  company: string;
  role: string;
  type: string;
  techstack: string[];
  coverImage?: {
    src: string;
    height?: number;
    width?: number;
    blurDataURL?: string | null;
    blurHeight?: number;
    blurWidth?: number;
  };
  taken: boolean
}