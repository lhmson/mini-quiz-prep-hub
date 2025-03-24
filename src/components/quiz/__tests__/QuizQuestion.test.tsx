import '@testing-library/jest-dom';
import { render, fireEvent, screen } from '@testing-library/react';
import QuizQuestion from '../QuizQuestion';

// Mock react-markdown
jest.mock('react-markdown', () => ({
  __esModule: true,
  default: ({ children }: { children: string }) => (
    <div data-testid='markdown'>{children}</div>
  ),
}));

// Mock quiz store
jest.mock('@/store/quiz', () => ({
  useQuizStore: jest.fn(() => ({
    currentQuestion: {
      id: 'q1',
      question: 'Test question?',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 1,
      explanation: 'Test explanation',
      category: 'JavaScript',
      difficulty: 'medium',
      codeSnippet: '',
    },
    currentQuestionIndex: 0,
    totalQuestions: 4,
    submitAnswer: jest.fn(),
    resetQuiz: jest.fn(),
  })),
}));

describe('QuizQuestion', () => {
  const mockOnFinish = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders question and options', () => {
    const { getByText } = render(<QuizQuestion onFinish={mockOnFinish} />);

    expect(getByText('Test question?')).toBeInTheDocument();
    expect(getByText('A')).toBeInTheDocument();
    expect(getByText('B')).toBeInTheDocument();
    expect(getByText('C')).toBeInTheDocument();
    expect(getByText('D')).toBeInTheDocument();
  });

  it('shows explanation after selecting an answer', () => {
    const { getByText, queryByText } = render(
      <QuizQuestion onFinish={mockOnFinish} />
    );

    expect(queryByText('Test explanation')).not.toBeInTheDocument();

    fireEvent.click(getByText('B'));

    expect(getByText('Test explanation')).toBeInTheDocument();
  });

  it('disables options after selection', () => {
    const { getByText } = render(<QuizQuestion onFinish={mockOnFinish} />);

    fireEvent.click(getByText('B'));

    const buttons = screen
      .getAllByRole('button')
      .filter((button) =>
        ['A', 'B', 'C', 'D'].includes(button.textContent || '')
      );

    buttons.forEach((button) => {
      expect(button).toBeDisabled();
    });
  });

  it('shows correct/incorrect styling', () => {
    const { getByText } = render(<QuizQuestion onFinish={mockOnFinish} />);

    fireEvent.click(getByText('A')); // Wrong answer

    const wrongButton = getByText('A').closest('button');
    const correctButton = getByText('B').closest('button');

    expect(wrongButton).toHaveClass('bg-red-100');
    expect(correctButton).toHaveClass('bg-green-100');
  });
});
