'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import LoginButton from '@/components/auth/LoginButton';

export default function Navigation() {
  const pathname = usePathname();
  const isQuizPage = pathname.startsWith('/quiz');
  const isProfilePage = pathname === '/profile';

  return (
    <nav className='bg-white shadow-sm'>
      <div className='container mx-auto px-4'>
        <div className='flex items-center justify-between h-16'>
          <Link
            href='/'
            className='text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors'
          >
            Mini Quiz Prep Hub
          </Link>

          <div className='flex items-center space-x-4'>
            <Link
              href='/'
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                pathname === '/'
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
              }`}
            >
              Home
            </Link>
            <Link
              href='/quiz'
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isQuizPage
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
              }`}
            >
              Quiz
            </Link>
            <Link
              href='/profile'
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isProfilePage
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
              }`}
            >
              Profile
            </Link>
            <LoginButton />
          </div>
        </div>
      </div>
    </nav>
  );
}
