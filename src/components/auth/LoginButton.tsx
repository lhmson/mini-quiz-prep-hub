'use client';

import { signIn, signOut, useSession } from 'next-auth/react';

export default function LoginButton() {
  const { data: session } = useSession();

  if (session) {
    return (
      <div className='flex items-center gap-4'>
        <span className='text-sm text-gray-600'>
          {session.user?.name || session.user?.email}
        </span>
        <button
          onClick={() => signOut()}
          className='px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors'
        >
          Sign Out
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => signIn('google')}
      className='px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors'
    >
      Sign In with Google
    </button>
  );
}
