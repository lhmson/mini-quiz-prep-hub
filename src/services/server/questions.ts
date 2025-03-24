import { prisma } from '@/lib/prisma';
import { Question } from '@/lib/types/quiz';

export async function saveQuestion(question: Question) {
  try {
    return await prisma.question.upsert({
      where: {
        id: question.id,
      },
      update: {
        question: question.question,
        options: JSON.stringify(question.options),
        correctAnswer: question.correctAnswer,
        explanation: question.explanation,
        category: question.category,
        difficulty: question.difficulty,
        codeSnippet: question.codeSnippet,
      },
      create: {
        id: question.id,
        question: question.question,
        options: JSON.stringify(question.options),
        correctAnswer: question.correctAnswer,
        explanation: question.explanation,
        category: question.category,
        difficulty: question.difficulty,
        codeSnippet: question.codeSnippet,
      },
    });
  } catch (error) {
    console.error('Error saving question:', error);
    throw error;
  }
}

export async function getQuestion(id: string) {
  try {
    const question = await prisma.question.findUnique({
      where: {
        id,
      },
    });
    if (!question) return null;

    return {
      ...question,
      options: JSON.parse(question.options),
    };
  } catch (error) {
    console.error('Error getting question:', error);
    throw error;
  }
}
