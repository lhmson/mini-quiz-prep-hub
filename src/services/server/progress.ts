import { prisma } from '@/lib/prisma';
import { getQuestion } from './questions';

export async function getQuizProgress(userId: string) {
  try {
    const progress = await prisma.quizProgress.findMany({
      where: {
        userId,
      },
      orderBy: {
        timestamp: 'desc',
      },
    });

    // Fetch questions for each progress item
    const progressWithQuestions = await Promise.all(
      progress.map(async (item) => {
        const question = await getQuestion(item.questionId);
        return {
          ...item,
          question: question || {
            id: item.questionId,
            question: 'Question not found',
            options: [],
            correctAnswer: 0,
            explanation: 'This question is no longer available.',
            category: 'Unknown',
            difficulty: 'Unknown',
          },
        };
      })
    );

    return progressWithQuestions;
  } catch (error) {
    console.error('Error getting quiz progress:', error);
    throw error;
  }
}

export async function saveQuizProgress(
  userId: string,
  questionId: string,
  isCorrect: boolean
) {
  try {
    await prisma.quizProgress.upsert({
      where: {
        userId_questionId: {
          userId,
          questionId,
        },
      },
      update: {
        isCorrect,
        timestamp: new Date(),
      },
      create: {
        userId,
        questionId,
        isCorrect,
      },
    });
  } catch (error) {
    console.error('Error saving quiz progress:', error);
    throw error;
  }
}
