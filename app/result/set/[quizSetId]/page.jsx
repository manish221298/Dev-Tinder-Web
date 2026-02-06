'use client';

import { use } from 'react';
import MainLayout from '@/components/layouts/MainLayout';
import UserResults from '@/components/UserResults';

export default function UserResultsPage({ params }) {
  const { quizSetId } = use(params);
  return (
    <MainLayout>
      <UserResults quizSetId={quizSetId} />
    </MainLayout>
  );
}

