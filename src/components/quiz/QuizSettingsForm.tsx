'use client';

import { useState } from 'react';
import { QuizSettings } from '@/lib/types/quiz';
import { useQuizStore } from '@/store/quiz';

interface QuizSettingsFormProps {
  onStart: (settings: QuizSettings) => void;
}

export default function QuizSettingsForm({ onStart }: QuizSettingsFormProps) {
  const [settings, setSettings] = useState<QuizSettings>({
    numberOfQuestions: 10,
    timeLimit: 30,
    maxWrongAnswers: 5,
    categories: ['JavaScript'],
    musicType: 'none',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onStart(settings);
  };

  const handleNumberChange = (
    field: 'numberOfQuestions' | 'timeLimit' | 'maxWrongAnswers',
    value: string
  ) => {
    const numValue = value === '' ? 0 : parseInt(value);

    // If changing numberOfQuestions, update maxWrongAnswers if needed
    if (field === 'numberOfQuestions' && numValue < settings.maxWrongAnswers) {
      setSettings({
        ...settings,
        [field]: numValue,
        maxWrongAnswers: numValue,
      });
    } else {
      setSettings({
        ...settings,
        [field]: numValue,
      });
    }
  };

  const handleMaxWrongAnswersChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = parseInt(e.target.value);
    if (value >= 0 && value <= settings.numberOfQuestions) {
      setSettings({
        ...settings,
        maxWrongAnswers: value,
      });
    }
  };

  const handleMusicTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newMusicType = e.target.value as
      | 'none'
      | 'mild'
      | 'medium'
      | 'energetic';
    setSettings({
      ...settings,
      musicType: newMusicType,
    });
    // Update store settings immediately
    useQuizStore.getState().updateSettings({ musicType: newMusicType });
  };

  return (
    <form onSubmit={handleSubmit} className='max-w-md mx-auto space-y-6'>
      <div>
        <label className='block text-sm font-medium mb-2'>
          Number of Questions
        </label>
        <input
          type='number'
          min='1'
          max='50'
          value={settings.numberOfQuestions || ''}
          onChange={(e) =>
            handleNumberChange('numberOfQuestions', e.target.value)
          }
          className='w-full px-3 py-2 border rounded-md'
          required
        />
      </div>

      <div>
        <label className='block text-sm font-medium mb-2'>
          Time Limit (minutes)
        </label>
        <input
          type='number'
          min='1'
          value={settings.timeLimit || ''}
          onChange={(e) => handleNumberChange('timeLimit', e.target.value)}
          className='w-full px-3 py-2 border rounded-md'
          required
        />
      </div>

      <div>
        <label className='block text-sm font-medium mb-2'>
          Maximum Wrong Answers
        </label>
        <input
          type='number'
          min='1'
          max={settings.numberOfQuestions}
          value={settings.maxWrongAnswers || ''}
          onChange={handleMaxWrongAnswersChange}
          className='w-full px-3 py-2 border rounded-md'
          required
        />
        <p className='text-sm text-gray-500 mt-1'>
          Must be less than or equal to number of questions
        </p>
      </div>

      <div>
        <label className='block text-sm font-medium mb-2'>
          Background Music
        </label>
        <select
          value={settings.musicType}
          onChange={handleMusicTypeChange}
          className='w-full px-3 py-2 border rounded-md'
          required
        >
          <option value='none'>No Music</option>
          <option value='mild'>Mild (Lo-fi)</option>
          <option value='medium'>Medium (Ambient)</option>
          <option value='energetic'>Energetic (Upbeat)</option>
        </select>
      </div>

      <button
        type='submit'
        className='w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors'
      >
        Start Quiz
      </button>
    </form>
  );
}
