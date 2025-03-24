'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuizStore } from '@/store/quiz';

export default function QuizResults() {
  const router = useRouter();
  const {
    questions,
    score,
    wrongAnswers,
    startTime,
    endTime,
    answers,
    resetQuiz,
  } = useQuizStore();

  useEffect(() => {
    if (!endTime) {
      router.push('/quiz');
    }
  }, [endTime, router]);

  if (!endTime) return null;

  const timeSpent = Math.floor(
    (endTime.getTime() - (startTime?.getTime() || 0)) / 1000
  );
  const accuracy = (score / questions.length) * 100;

  const handleNewQuiz = () => {
    resetQuiz();
    router.push('/quiz');
  };

  return (
    <div className='container mx-auto px-4 py-8'>
      <h1 className='text-3xl font-bold text-center mb-8'>Quiz Results</h1>

      <div className='max-w-2xl mx-auto space-y-6'>
        <div className='bg-white p-6 rounded-lg shadow-md'>
          <div className='grid grid-cols-2 gap-4 mb-6'>
            <div className='text-center'>
              <div className='text-2xl font-bold text-green-600'>{score}</div>
              <div className='text-gray-600'>Correct Answers</div>
            </div>
            <div className='text-center'>
              <div className='text-2xl font-bold text-red-600'>
                {wrongAnswers}
              </div>
              <div className='text-gray-600'>Wrong Answers</div>
            </div>
          </div>

          <div className='space-y-4'>
            <div>
              <div className='text-lg font-semibold'>Accuracy</div>
              <div className='w-full bg-gray-200 rounded-full h-2.5'>
                <div
                  className='bg-blue-500 h-2.5 rounded-full'
                  style={{ width: `${accuracy}%` }}
                />
              </div>
              <div className='text-right text-sm text-gray-600'>
                {accuracy.toFixed(1)}%
              </div>
            </div>

            <div>
              <div className='text-lg font-semibold'>Time Spent</div>
              <div className='text-gray-600'>
                {Math.floor(timeSpent / 60)} minutes {timeSpent % 60} seconds
              </div>
            </div>
          </div>
        </div>

        <div className='bg-white p-6 rounded-lg shadow-md'>
          <h2 className='text-xl font-semibold mb-4'>Question Review</h2>
          <div className='space-y-6'>
            {questions.map((question, index) => {
              const userAnswer = answers[question.id];
              const isCorrect = userAnswer === question.correctAnswer;

              return (
                <div key={question.id} className='border-b pb-4 last:border-0'>
                  <div className='flex items-center gap-2 mb-2'>
                    <span className='text-sm text-gray-500'>
                      Question {index + 1}
                    </span>
                    {isCorrect ? (
                      <span className='text-green-500'>✓</span>
                    ) : (
                      <span className='text-red-500'>✗</span>
                    )}
                  </div>
                  <p className='font-medium mb-2'>{question.question}</p>
                  {question.codeSnippet && (
                    <pre className='mb-2 p-3 bg-gray-100 rounded-lg overflow-x-auto'>
                      <code className='text-sm'>{question.codeSnippet}</code>
                    </pre>
                  )}
                  <div className='space-y-2'>
                    {question.options.map((option, optIndex) => (
                      <div
                        key={optIndex}
                        className={`p-2 rounded ${
                          optIndex === question.correctAnswer
                            ? 'bg-green-100'
                            : optIndex === userAnswer
                              ? 'bg-red-100'
                              : 'bg-gray-50'
                        }`}
                      >
                        {option}
                      </div>
                    ))}
                  </div>
                  <div className='mt-2 text-sm text-gray-600'>
                    {question.explanation}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className='flex justify-center'>
          <button
            onClick={handleNewQuiz}
            className='px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors'
          >
            Start New Quiz
          </button>
        </div>
      </div>
    </div>
  );
}
