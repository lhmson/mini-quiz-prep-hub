'use client';

import { create } from 'zustand';
import { QuizSettings, QuizStore } from '@/lib/types/quiz';

const defaultSettings: QuizSettings = {
  numberOfQuestions: 10,
  timeLimit: 30,
  maxWrongAnswers: 5,
  categories: [],
};

export const useQuizStore = create<QuizStore>((set, get) => ({
  questions: [],
  currentQuestion: null,
  currentQuestionIndex: 0,
  totalQuestions: 0,
  score: 0,
  wrongAnswers: 0,
  answers: {},
  settings: defaultSettings,
  isActive: false,
  startTime: undefined,
  endTime: undefined,
  navigateToResults: () => {},

  startQuiz: (settings: QuizSettings) => {
    set((state) => {
      return {
        settings,
        questions: state.questions,
        currentQuestionIndex: 0,
        totalQuestions: state.questions.length,
        currentQuestion: state.questions[0] || null,
        score: 0,
        wrongAnswers: 0,
        answers: {},
        isActive: true,
        startTime: new Date(),
        endTime: undefined,
      };
    });
  },

  submitAnswer: (answerIndex: number) => {
    const state = get();
    const currentQuestion = state.currentQuestion;

    if (!currentQuestion) return;

    const isCorrect = answerIndex === currentQuestion.correctAnswer;
    const newAnswers = {
      ...state.answers,
      [currentQuestion.id]: answerIndex,
    };

    set((state) => {
      const nextQuestion =
        state.questions[state.currentQuestionIndex + 1] || null;
      const isLastQuestion = !nextQuestion;
      const newWrongAnswers = isCorrect
        ? state.wrongAnswers
        : state.wrongAnswers + 1;

      // Check if we've exceeded the maximum wrong answers
      if (newWrongAnswers > state.settings.maxWrongAnswers) {
        state.navigateToResults();
        return {
          score: state.score,
          wrongAnswers: newWrongAnswers,
          answers: newAnswers,
          currentQuestionIndex: state.currentQuestionIndex,
          currentQuestion: state.currentQuestion,
          isActive: false,
          endTime: new Date(),
        };
      }

      return {
        score: isCorrect ? state.score + 1 : state.score,
        wrongAnswers: newWrongAnswers,
        answers: newAnswers,
        currentQuestionIndex: state.currentQuestionIndex + 1,
        currentQuestion: nextQuestion,
        isActive: !isLastQuestion,
        endTime: isLastQuestion ? new Date() : state.endTime,
      };
    });
  },

  resetQuiz: () => {
    set({
      currentQuestionIndex: 0,
      currentQuestion: null,
      score: 0,
      wrongAnswers: 0,
      answers: {},
      settings: defaultSettings,
      isActive: false,
      startTime: undefined,
      endTime: undefined,
    });
  },
}));
