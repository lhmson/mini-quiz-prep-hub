'use client';

import { create } from 'zustand';
import { QuizSettings, QuizStore } from '@/lib/types/quiz';
import { parseQuestions } from '@/services/questions';

const defaultSettings: QuizSettings = {
  categories: [],
  numberOfQuestions: 10,
  timeLimit: 30,
  maxWrongAnswers: 3,
  musicType: 'none',
};

export const useQuizStore = create<QuizStore>((set, get) => ({
  questions: [],
  currentQuestion: null,
  currentQuestionIndex: 0,
  totalQuestions: 0,
  score: 0,
  wrongAnswers: 0,
  answers: {},
  isActive: false,
  startTime: undefined,
  endTime: undefined,
  settings: defaultSettings,
  navigateToResults: () => {},
  startQuiz: async (settings: QuizSettings) => {
    try {
      const response = await fetch(
        'https://raw.githubusercontent.com/lydiahallie/javascript-questions/master/README.md'
      );
      const markdown = await response.text();
      const questions = parseQuestions(markdown);
      const filteredQuestions = questions
        .filter((q) => settings.categories.includes(q.category))
        .slice(0, settings.numberOfQuestions);

      set({
        questions: filteredQuestions,
        currentQuestion: filteredQuestions[0],
        currentQuestionIndex: 0,
        totalQuestions: filteredQuestions.length,
        score: 0,
        wrongAnswers: 0,
        answers: {},
        isActive: true,
        startTime: new Date(),
        settings,
      });
    } catch (error) {
      console.error('Error starting quiz:', error);
    }
  },
  submitAnswer: (answerIndex: number) => {
    const state = get();
    const currentQuestion = state.questions[state.currentQuestionIndex];
    const isCorrect = answerIndex === currentQuestion.correctAnswer;
    const newWrongAnswers = isCorrect
      ? state.wrongAnswers
      : state.wrongAnswers + 1;

    if (newWrongAnswers > state.settings.maxWrongAnswers) {
      set({
        isActive: false,
        endTime: new Date(),
      });
      state.navigateToResults();
      return;
    }

    set({
      score: isCorrect ? state.score + 1 : state.score,
      wrongAnswers: newWrongAnswers,
      answers: {
        ...state.answers,
        [currentQuestion.id]: answerIndex,
      },
      currentQuestionIndex: state.currentQuestionIndex + 1,
      currentQuestion:
        state.currentQuestionIndex + 1 < state.questions.length
          ? state.questions[state.currentQuestionIndex + 1]
          : null,
    });
  },
  resetQuiz: () => {
    set({
      questions: [],
      currentQuestion: null,
      currentQuestionIndex: 0,
      totalQuestions: 0,
      score: 0,
      wrongAnswers: 0,
      answers: {},
      isActive: false,
      startTime: undefined,
      endTime: undefined,
      settings: defaultSettings,
    });
  },
  updateSettings: (newSettings: Partial<QuizSettings>) => {
    set((state) => ({
      settings: {
        ...state.settings,
        ...newSettings,
      },
    }));
  },
}));
