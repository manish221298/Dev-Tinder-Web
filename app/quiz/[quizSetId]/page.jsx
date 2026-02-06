'use client';

import { use } from 'react';
import MainLayout from '@/components/layouts/MainLayout';
import Quiz from '@/components/Quiz';

export default function QuizSetPage({ params }) {
  const { quizSetId } = use(params);
  return (
    <MainLayout>
      <Quiz quizSetId={quizSetId} />
    </MainLayout>
  );
}

