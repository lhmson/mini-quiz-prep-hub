'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { Question } from '@/lib/types/quiz';
import { getQuizProgress } from '@/services/progress';
import ReactMarkdown from 'react-markdown';
import Image from 'next/image';

interface ProgressItem {
  questionId: string;
  isCorrect: boolean;
  timestamp: Date;
  question?: Question;
}

export default function ProfilePage() {
  const { data: session } = useSession();
  const [progress, setProgress] = useState<ProgressItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  useEffect(() => {
    const loadProgress = async () => {
      if (session?.user?.id) {
        try {
          const data = await getQuizProgress();
          setProgress(data);
        } catch (err) {
          console.error('Error loading progress:', err);
          setError('Failed to load progress. Please try again later.');
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadProgress();
  }, [session?.user?.id]);

  const toggleItem = (questionId: string) => {
    setExpandedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(questionId)) {
        newSet.delete(questionId);
      } else {
        newSet.add(questionId);
      }
      return newSet;
    });
  };

  if (!session) {
    return (
      <div className='container mx-auto px-4 py-8'>
        <div className='max-w-2xl mx-auto text-center'>
          <h1 className='text-2xl font-bold mb-4'>
            Please sign in to view your progress
          </h1>
          <p className='text-gray-600'>
            Sign in with your Google account to track your quiz progress and
            view your history.
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className='container mx-auto px-4 py-8'>
        <div className='max-w-2xl mx-auto text-center'>
          <div className='text-xl'>Loading your progress...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='container mx-auto px-4 py-8'>
        <div className='max-w-2xl mx-auto text-center'>
          <div className='text-xl text-red-600'>{error}</div>
        </div>
      </div>
    );
  }

  const correctAnswers = progress.filter((p) => p.isCorrect).length;
  const totalAnswers = progress.length;
  const accuracy = totalAnswers > 0 ? (correctAnswers / totalAnswers) * 100 : 0;

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='max-w-2xl mx-auto'>
        <div className='bg-white rounded-lg shadow-lg p-6 mb-6'>
          <div className='flex items-center space-x-4 mb-6'>
            {session.user?.image && (
              <div className='relative w-16 h-16'>
                <Image
                  src={session.user.image}
                  alt={session.user.name || 'Profile'}
                  fill
                  className='rounded-full object-cover'
                />
              </div>
            )}
            <div>
              <h1 className='text-2xl font-bold'>{session.user?.name}</h1>
              <p className='text-gray-600'>{session.user?.email}</p>
            </div>
          </div>

          <div className='grid grid-cols-3 gap-4 mb-6'>
            <div className='text-center'>
              <div className='text-2xl font-bold text-green-600'>
                {correctAnswers}
              </div>
              <div className='text-gray-600'>Correct Answers</div>
            </div>
            <div className='text-center'>
              <div className='text-2xl font-bold text-red-600'>
                {totalAnswers - correctAnswers}
              </div>
              <div className='text-gray-600'>Wrong Answers</div>
            </div>
            <div className='text-center'>
              <div className='text-2xl font-bold text-blue-600'>
                {accuracy.toFixed(1)}%
              </div>
              <div className='text-gray-600'>Accuracy</div>
            </div>
          </div>
        </div>

        <div className='bg-white rounded-lg shadow-lg p-6'>
          <h2 className='text-xl font-bold mb-4'>Quiz History</h2>
          <div className='space-y-4'>
            {progress.length === 0 ? (
              <p className='text-gray-600 text-center'>No quiz history yet</p>
            ) : (
              progress.map((item) => (
                <div
                  key={item.questionId}
                  className='bg-gray-50 rounded-lg overflow-hidden'
                >
                  <button
                    onClick={() => toggleItem(item.questionId)}
                    className='w-full flex items-center justify-between p-4 hover:bg-gray-100 transition-colors'
                  >
                    <div className='flex-1 text-left'>
                      <div className='font-medium'>
                        {item.question?.question || 'Question not found'}
                      </div>
                      <div className='text-sm text-gray-500'>
                        {new Date(item.timestamp).toLocaleString()}
                      </div>
                    </div>
                    <div
                      className={`px-3 py-1 rounded-full text-sm font-medium ml-4 ${
                        item.isCorrect
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {item.isCorrect ? 'Correct' : 'Incorrect'}
                    </div>
                  </button>

                  {expandedItems.has(item.questionId) && item.question && (
                    <div className='p-4 border-t border-gray-200'>
                      <div className='space-y-4'>
                        <div>
                          <h3 className='font-medium mb-2'>Question:</h3>
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
                                return (
                                  <p className='text-gray-700'>{children}</p>
                                );
                              },
                            }}
                          >
                            {`${item.question.question}${
                              item.question.codeSnippet
                                ? `\n\`\`\`\n${item.question.codeSnippet}\n\`\`\``
                                : ''
                            }`}
                          </ReactMarkdown>
                        </div>

                        <div>
                          <h3 className='font-medium mb-2'>Options:</h3>
                          <div className='space-y-2'>
                            {item.question.options.map((option, index) => (
                              <div
                                key={index}
                                className={`p-2 rounded ${
                                  index === item.question?.correctAnswer
                                    ? 'bg-green-50 border border-green-200'
                                    : 'bg-gray-50 border border-gray-200'
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
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h3 className='font-medium mb-2'>Explanation:</h3>
                          <div className='bg-gray-50 p-4 rounded-lg'>
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
                              {item.question.explanation}
                            </ReactMarkdown>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
