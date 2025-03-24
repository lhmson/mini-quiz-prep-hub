import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { saveQuestion } from '@/services/server/questions';
import { Question } from '@/lib/types/quiz';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const question: Question = await request.json();
    await saveQuestion(question);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving question:', error);
    return NextResponse.json(
      { error: 'Failed to save question' },
      { status: 500 }
    );
  }
}
