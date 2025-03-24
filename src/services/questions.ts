import { Question } from '@/lib/types/quiz';

const GITHUB_RAW_URL =
  'https://raw.githubusercontent.com/lydiahallie/javascript-questions/master/README.md';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || '';

// Cache for questions
let questionsCache: Question[] | null = null;

export async function saveQuestion(question: Question) {
  try {
    const response = await fetch(`${BASE_URL}/api/questions/save`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(question),
    });

    if (!response.ok) {
      throw new Error('Failed to save question');
    }
  } catch (error) {
    console.error('Error saving question:', error);
    throw error;
  }
}

export async function fetchQuestions(): Promise<Question[]> {
  try {
    // Return cached questions if available
    if (questionsCache) {
      return questionsCache;
    }

    const response = await fetch(GITHUB_RAW_URL);
    const markdown = await response.text();
    const parsedQuestions = parseQuestions(markdown);

    // Cache the questions
    questionsCache = parsedQuestions;

    return parsedQuestions;
  } catch (error) {
    console.error('Error fetching questions:', error);
    return [];
  }
}

function parseQuestions(markdown: string): Question[] {
  const questions: Question[] = [];
  // Split by question number pattern (e.g., "###### 1.", "###### 2.", etc.)
  const questionBlocks = markdown.split(/\n(?=######\s+\d+\.)/).slice(1);

  questionBlocks.forEach((block, index) => {
    const lines = block.trim().split('\n');
    const questionText = lines[0].replace(/^######\s+\d+\.\s*/, '').trim();
    const options: string[] = [];
    let correctAnswer = -1;
    let explanation = '';
    let codeSnippet = '';

    let inExplanation = false;
    let inCodeBlock = false;

    lines.forEach((line) => {
      const trimmedLine = line.trim();

      if (
        trimmedLine.startsWith('```javascript') ||
        trimmedLine.startsWith('```html')
      ) {
        inCodeBlock = true;
        return;
      }

      if (trimmedLine.startsWith('```')) {
        inCodeBlock = false;
        return;
      }

      if (inCodeBlock) {
        codeSnippet += line + '\n';
        return;
      }

      if (trimmedLine.startsWith('-')) {
        // Parse options, only take A-D options
        const optionMatch = trimmedLine.match(/^-\s*([A-D]):\s*(.+)$/);
        if (optionMatch) {
          const optionText = optionMatch[2].trim();
          options.push(optionText);
        }
      } else if (trimmedLine.includes('#### Answer:')) {
        const answerLetter = trimmedLine.replace('#### Answer:', '').trim();
        correctAnswer = answerLetter.charCodeAt(0) - 65; // Convert A,B,C,D to 0,1,2,3
        inExplanation = true;
      } else if (inExplanation && trimmedLine) {
        // Remove HTML tags and clean up the explanation
        const cleanLine = trimmedLine
          .replace(/<\/?[^>]+(>|$)/g, '') // Remove HTML tags
          .replace(/<details>/g, '') // Remove <details> tag
          .replace(/<\/details>/g, '') // Remove </details> tag
          .replace(/^Explanation\s*/, '') // Remove "Explanation" text
          .trim();
        if (cleanLine) {
          explanation += cleanLine + '\n';
        }
      }
    });

    if (questionText && options.length > 0 && correctAnswer !== -1) {
      questions.push({
        id: `q${index + 1}`,
        question: questionText,
        options,
        correctAnswer,
        explanation: explanation.trim(),
        category: 'JavaScript',
        difficulty: 'medium',
        codeSnippet: codeSnippet.trim(),
      });
    }
  });

  return questions;
}

export function shuffleQuestions(questions: Question[]): Question[] {
  const shuffled = [...questions];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function filterQuestions(
  questions: Question[],
  settings: {
    categories?: string[];
    limit?: number;
  }
): Question[] {
  // Create a new array and shuffle it multiple times
  let filtered = [...questions];
  for (let i = 0; i < 3; i++) {
    filtered = shuffleQuestions(filtered);
  }

  if (settings.categories?.length) {
    filtered = filtered.filter((q) =>
      settings.categories?.includes(q.category)
    );
    // Shuffle again after filtering
    filtered = shuffleQuestions(filtered);
  }

  if (settings.limit) {
    filtered = filtered.slice(0, settings.limit);
  }

  return filtered;
}

export { parseQuestions };
