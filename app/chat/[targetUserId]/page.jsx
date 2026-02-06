'use client';

import { use } from 'react';
import MainLayout from '@/components/layouts/MainLayout';
import Chat from '@/components/Chat';

export default function ChatPage({ params }) {
  const { targetUserId } = use(params);
  return (
    <MainLayout>
      <Chat targetUserId={targetUserId} />
    </MainLayout>
  );
}

