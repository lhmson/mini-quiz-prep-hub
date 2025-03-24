'use client';

import { useEffect, useState } from 'react';
import { useQuizStore } from '@/store/quiz';

interface QuizTimerProps {
  onTimeUp: () => void;
}

export default function QuizTimer({ onTimeUp }: QuizTimerProps) {
  const { settings } = useQuizStore();
  const [timeLeft, setTimeLeft] = useState(
    settings.timeLimit ? settings.timeLimit * 60 : 0
  );

  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeUp();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onTimeUp]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className='text-lg font-semibold'>
      Time Left: {minutes}:{seconds.toString().padStart(2, '0')}
    </div>
  );
}
