'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <main className='min-h-screen bg-gradient-to-b from-blue-50 to-white'>
      <div className='container mx-auto px-4 py-16'>
        <div className='max-w-3xl mx-auto text-center'>
          <h1 className='text-4xl md:text-5xl font-bold text-gray-900 mb-6'>
            Mini Quiz Prep Hub
          </h1>
          <p className='text-xl text-gray-600 mb-8'>
            Practice JavaScript interview questions with our interactive quiz
            platform. Test your knowledge, track your progress, and improve your
            skills.
          </p>

          <div className='space-y-4'>
            <Link
              href='/quiz'
              className='inline-block px-8 py-4 bg-blue-500 text-white rounded-lg text-lg font-semibold hover:bg-blue-600 transition-colors'
            >
              Start Quiz
            </Link>
          </div>

          <div className='mt-16 grid grid-cols-1 md:grid-cols-3 gap-8'>
            <div className='p-6 bg-white rounded-lg shadow-md'>
              <h3 className='text-xl font-semibold mb-3'>Random Questions</h3>
              <p className='text-gray-600'>
                Get a mix of questions in random order to test your knowledge
                thoroughly.
              </p>
            </div>
            <div className='p-6 bg-white rounded-lg shadow-md'>
              <h3 className='text-xl font-semibold mb-3'>
                Detailed Explanations
              </h3>
              <p className='text-gray-600'>
                Learn from comprehensive explanations for each question to
                understand the concepts better.
              </p>
            </div>
            <div className='p-6 bg-white rounded-lg shadow-md'>
              <h3 className='text-xl font-semibold mb-3'>Progress Tracking</h3>
              <p className='text-gray-600'>
                Monitor your performance with detailed analytics and track your
                improvement over time.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
