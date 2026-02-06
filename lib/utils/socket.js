'use client';

import { io } from 'socket.io-client';

export const createSocketConnection = () => {
  // Connect to the same server (Next.js server with Socket.io)
  // Since there's no external backend, use the same origin (same port)
  const socketUrl = typeof window !== 'undefined'
    ? window.location.origin
    : 'http://localhost:3000';

  return io(socketUrl);
};

