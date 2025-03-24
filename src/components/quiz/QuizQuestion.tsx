'use client';

import { useState } from 'react';
import { useQuizStore } from '@/store/quiz';
import ReactMarkdown from 'react-markdown';

interface QuizQuestionProps {
  onFinish: () => void;
}

export default function QuizQuestion({ onFinish }: QuizQuestionProps) {
  const {
    currentQuestion,
    currentQuestionIndex,
    totalQuestions,
    submitAnswer,
    resetQuiz,
  } = useQuizStore();
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  if (!currentQuestion) {
    return null;
  }

  const handleAnswerSelect = (index: number) => {
    setSelectedAnswer(index);
    setShowExplanation(true);
  };

  const handleNext = () => {
    if (selectedAnswer !== null) {
      submitAnswer(selectedAnswer);
      if (currentQuestionIndex === totalQuestions - 1) {
        useQuizStore.setState({ endTime: new Date() });
        onFinish();
      } else {
        setSelectedAnswer(null);
        setShowExplanation(false);
      }
    }
  };

  const handleStopQuiz = () => {
    if (
      window.confirm(
        'Are you sure you want to stop the quiz? Your progress will be lost.'
      )
    ) {
      resetQuiz();
      onFinish();
    }
  };

  return (
    <div className='bg-white rounded-lg shadow-lg p-6'>
      <div className='flex justify-between items-center mb-6'>
        <h2 className='text-xl font-semibold'>
          Question {currentQuestionIndex + 1} of {totalQuestions}
        </h2>
        <button
          onClick={handleStopQuiz}
          className='px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors'
        >
          Stop Quiz
        </button>
      </div>

      <div className='mb-6'>
        <ReactMarkdown
          components={{
            code({ className, children, ...props }) {
              return (
                <code
                  className={`${className} bg-gray-100 rounded px-1 py-0.5`}
                  {...props}
                >
                  {children}
                </code>
              );
            },
            pre({ children, ...props }) {
              return (
                <pre
                  className='bg-gray-100 p-4 rounded-lg overflow-x-auto my-2'
                  {...props}
                >
                  {children}
                </pre>
              );
            },
            p({ children }) {
              return <p className='text-gray-700'>{children}</p>;
            },
          }}
        >
          {`${currentQuestion.question}${
            currentQuestion.codeSnippet
              ? `\n\`\`\`\n${currentQuestion.codeSnippet}\n\`\`\``
              : ''
          }`}
        </ReactMarkdown>
      </div>

      <div className='space-y-3'>
        {currentQuestion.options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleAnswerSelect(index)}
            disabled={showExplanation}
            className={`w-full text-left p-3 rounded-lg border transition-colors ${
              showExplanation
                ? index === currentQuestion.correctAnswer
                  ? 'bg-green-100 border-green-500'
                  : selectedAnswer === index
                    ? 'bg-red-100 border-red-500'
                    : 'hover:bg-gray-50 border-gray-200'
                : selectedAnswer === index
                  ? 'bg-blue-100 border-blue-500'
                  : 'hover:bg-gray-50 border-gray-200'
            }`}
          >
            <ReactMarkdown
              components={{
                code({ className, children, ...props }) {
                  return (
                    <code
                      className={`${className} bg-gray-100 rounded px-1 py-0.5 text-sm`}
                      {...props}
                    >
                      {children}
                    </code>
                  );
                },
                pre({ children, ...props }) {
                  return (
                    <pre
                      className='bg-gray-100 p-2 rounded-lg overflow-x-auto my-1 text-sm'
                      {...props}
                    >
                      {children}
                    </pre>
                  );
                },
                p({ children }) {
                  return <span>{children}</span>;
                },
              }}
            >
              {option}
            </ReactMarkdown>
          </button>
        ))}
      </div>

      {showExplanation && (
        <div className='mt-6'>
          <div className='bg-gray-50 p-4 rounded-lg'>
            <div className='text-gray-700'>
              <span className='font-semibold'>Explanation: </span>
              <ReactMarkdown
                components={{
                  code({ className, children, ...props }) {
                    return (
                      <code
                        className={`${className} bg-gray-100 rounded px-1 py-0.5`}
                        {...props}
                      >
                        {children}
                      </code>
                    );
                  },
                  pre({ children, ...props }) {
                    return (
                      <pre
                        className='bg-gray-100 p-4 rounded-lg overflow-x-auto my-2'
                        {...props}
                      >
                        {children}
                      </pre>
                    );
                  },
                  p({ children }) {
                    return <span>{children}</span>;
                  },
                }}
              >
                {currentQuestion.explanation}
              </ReactMarkdown>
            </div>
          </div>
          <button
            onClick={handleNext}
            className='mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors'
          >
            {currentQuestionIndex === totalQuestions - 1
              ? 'Finish Quiz'
              : 'Next Question'}
          </button>
        </div>
      )}
    </div>
  );
}
