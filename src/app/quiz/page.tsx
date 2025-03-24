'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuizStore } from '@/store/quiz';
import { fetchQuestions, filterQuestions } from '@/services/questions';
import { QuizSettings, Question } from '@/lib/types/quiz';
import QuizSettingsForm from '@/components/quiz/QuizSettingsForm';
import QuizQuestion from '@/components/quiz/QuizQuestion';
import QuizProgress from '@/components/quiz/QuizProgress';
import QuizTimer from '@/components/quiz/QuizTimer';

export default function QuizPage() {
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isActive, startQuiz } = useQuizStore();

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const fetchedQuestions = await fetchQuestions();
        setQuestions(fetchedQuestions);
      } catch (error) {
        console.error('Error loading questions:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadQuestions();
  }, []);

  useEffect(() => {
    // Set up the navigation function in the store
    useQuizStore.setState({
      navigateToResults: () => router.push('/quiz/results'),
    });
  }, [router]);

  const handleStartQuiz = (quizSettings: QuizSettings) => {
    console.log('Starting quiz with settings:', quizSettings); // Debug log
    console.log('Available questions:', questions.length); // Debug log

    // Filter questions based on settings
    const filteredQuestions = filterQuestions(questions, {
      categories: quizSettings.categories,
      limit: quizSettings.numberOfQuestions,
    });

    console.log('Filtered questions:', filteredQuestions.length); // Debug log

    if (filteredQuestions.length === 0) {
      alert(
        'No questions found with the selected settings. Please try different settings.'
      );
      return;
    }

    // Set questions in store before starting quiz
    useQuizStore.setState({ questions: filteredQuestions });
    startQuiz(quizSettings);
  };

  const handleFinishQuiz = () => {
    router.push('/quiz/results');
  };

  if (isLoading) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='text-xl'>Loading questions...</div>
      </div>
    );
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      <h1 className='text-3xl font-bold text-center mb-8'>JavaScript Quiz</h1>

      {!isActive ? (
        <QuizSettingsForm onStart={handleStartQuiz} />
      ) : (
        <div className='max-w-2xl mx-auto space-y-6'>
          <div className='flex justify-between items-center'>
            <QuizProgress />
            <QuizTimer onTimeUp={handleFinishQuiz} />
          </div>
          <QuizQuestion onFinish={handleFinishQuiz} />
        </div>
      )}
    </div>
  );
}
