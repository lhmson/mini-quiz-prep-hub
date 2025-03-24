import { Question } from '@/lib/types/quiz';

const GITHUB_RAW_URL =
  'https://raw.githubusercontent.com/lydiahallie/javascript-questions/master/README.md';

export async function fetchQuestions(): Promise<Question[]> {
  try {
    const response = await fetch(GITHUB_RAW_URL);
    const markdown = await response.text();
    console.log('Markdown:', markdown);
    return parseQuestions(markdown);
  } catch (error) {
    console.error('Error fetching questions:', error);
    return [];
  }
}

function parseQuestions(markdown: string): Question[] {
  const questions: Question[] = [];
  // Split by question number pattern (e.g., "###### 1.", "###### 2.", etc.)
  const questionBlocks = markdown.split(/\n(?=######\s+\d+\.)/).slice(1);

  console.log('Found question blocks:', questionBlocks.length);

  questionBlocks.forEach((block, index) => {
    const lines = block.trim().split('\n');
    const questionText = lines[0].replace(/^######\s+\d+\.\s*/, '').trim();
    const options: string[] = [];
    let correctAnswer = -1;
    let explanation = '';
    let codeSnippet = '';

    console.log('Processing block:', index + 1);
    console.log('Question text:', questionText);

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

    console.log('Options:', options);
    console.log('Correct answer:', correctAnswer);
    console.log('Explanation:', explanation);
    console.log('Code snippet:', codeSnippet);

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

  console.log('Total parsed questions:', questions.length);
  return questions;
}

export function shuffleQuestions(questions: Question[]): Question[] {
  return [...questions].sort(() => Math.random() - 0.5);
}

export function filterQuestions(
  questions: Question[],
  settings: {
    categories?: string[];
    limit?: number;
  }
): Question[] {
  let filtered = [...questions];

  if (settings.categories?.length) {
    filtered = filtered.filter((q) =>
      settings.categories?.includes(q.category)
    );
  }

  if (settings.limit) {
    filtered = shuffleQuestions(filtered).slice(0, settings.limit);
  }

  console.log('Filtered questions:', filtered.length); // Debug log
  return filtered;
}

export { parseQuestions };
