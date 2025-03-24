const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || '';

export async function saveQuizProgress(questionId: string, isCorrect: boolean) {
  try {
    const response = await fetch(`${BASE_URL}/api/progress/save`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ questionId, isCorrect }),
    });

    if (!response.ok) {
      throw new Error('Failed to save progress');
    }
  } catch (error) {
    console.error('Error saving progress:', error);
    throw error;
  }
}

export async function getQuizProgress() {
  try {
    const response = await fetch(`${BASE_URL}/api/progress`);
    if (!response.ok) {
      throw new Error('Failed to fetch progress');
    }
    return response.json();
  } catch (error) {
    console.error('Error getting quiz progress:', error);
    throw error;
  }
}

interface QuestionStats {
  total: number;
  correct: number;
  incorrect: number;
  percentage: number;
}

export async function getQuestionStats(
  questionId: string
): Promise<QuestionStats> {
  try {
    const response = await fetch(
      `${BASE_URL}/api/progress/stats?questionId=${questionId}`
    );
    if (!response.ok) {
      throw new Error('Failed to fetch question stats');
    }
    return response.json();
  } catch (error) {
    console.error('Error getting question stats:', error);
    throw error;
  }
}
