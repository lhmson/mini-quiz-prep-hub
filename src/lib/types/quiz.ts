export type Difficulty = 'easy' | 'medium' | 'hard';

export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  category: string;
  difficulty: Difficulty;
  codeSnippet?: string;
}

export interface QuizSettings {
  numberOfQuestions: number;
  timeLimit: number; // in minutes
  maxWrongAnswers: number;
  categories: string[];
  musicType: 'none' | 'mild' | 'medium' | 'energetic';
}

export interface QuizState {
  questions: Question[];
  currentQuestion: number;
  score: number;
  wrongAnswers: number;
  settings: QuizSettings;
  isActive: boolean;
  startTime?: Date;
  endTime?: Date;
  answers: Record<string, number>;
}

export interface QuizResult {
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  timeSpent: number; // in seconds
  accuracy: number;
  questions: Question[];
  answers: Record<string, number>;
}

export interface QuizStore {
  questions: Question[];
  currentQuestion: Question | null;
  currentQuestionIndex: number;
  totalQuestions: number;
  score: number;
  wrongAnswers: number;
  answers: Record<string, number>;
  settings: QuizSettings;
  isActive: boolean;
  startTime?: Date;
  endTime?: Date;
  submitAnswer: (answerIndex: number) => void;
  startQuiz: (settings: QuizSettings) => void;
  resetQuiz: () => void;
  navigateToResults: () => void;
  updateSettings: (newSettings: Partial<QuizSettings>) => void;
}
