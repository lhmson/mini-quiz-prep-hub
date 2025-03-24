'use client';

import { useQuizStore } from '@/store/quiz';

export default function QuizProgress() {
  const { questions, currentQuestionIndex, answers } = useQuizStore();

  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  const answeredQuestions = Object.keys(answers).length;

  return (
    <div className='w-full max-w-md'>
      <div className='flex justify-between text-sm text-gray-600 mb-2'>
        <span>Progress: {Math.round(progress)}%</span>
        <span>
          Answered: {answeredQuestions}/{questions.length}
        </span>
      </div>
      <div className='w-full h-2 bg-gray-200 rounded-full overflow-hidden'>
        <div
          className='h-full bg-blue-500 transition-all duration-300'
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className='flex justify-between mt-2'>
        {questions.map((_, index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full ${
              index === currentQuestionIndex
                ? 'bg-blue-500'
                : answers[questions[index].id] !== undefined
                  ? 'bg-green-500'
                  : 'bg-gray-300'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
