'use client';

import { create } from 'zustand';
import { QuizSettings, QuizStore } from '@/lib/types/quiz';
import {
  fetchQuestions,
  filterQuestions,
  saveQuestion,
} from '@/services/questions';
import { saveQuizProgress } from '@/services/progress';

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
      const questions = await fetchQuestions();
      const filteredQuestions = filterQuestions(questions, {
        categories: settings.categories,
        limit: settings.numberOfQuestions,
      });

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
  submitAnswer: async (answerIndex: number, userId?: string) => {
    const state = get();
    const currentQuestion = state.questions[state.currentQuestionIndex];
    const isCorrect = answerIndex === currentQuestion.correctAnswer;
    const newWrongAnswers = isCorrect
      ? state.wrongAnswers
      : state.wrongAnswers + 1;

    // Save progress if user is logged in
    if (userId) {
      try {
        // Save the question first
        await saveQuestion(currentQuestion);
        // Then save the progress
        await saveQuizProgress(currentQuestion.id, isCorrect);
      } catch (error) {
        console.error('Error saving progress:', error);
      }
    }

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
