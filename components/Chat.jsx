'use client';

import React, { useEffect, useState, useRef } from 'react';
import { createSocketConnection } from '@/lib/utils/socket';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { baseUrl, getToken } from '@/lib/utils/constants';
import { messageSendTime } from '@/lib/utils/datetime';

const Chat = ({ targetUserId }) => {
  const loggedInUser = useSelector((store) => store.user);
  const userId = loggedInUser?._id;
  const [newMessage, setNewMessage] = useState('');
  const [message, setMessage] = useState([]);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchChat = async () => {
    try {
      const res = await axios.get(`${baseUrl}/chat/${targetUserId}`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      setMessage(res?.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchChat();
  }, [targetUserId]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [message]);

  useEffect(() => {
    if (!userId) {
      return;
    }

    const socket = createSocketConnection();
    socket.emit('joinChat', { userId, targetUserId });

    socket.on('messageReceived', ({ firstName, text }) => {
      setMessage((prevState) => [...prevState, { firstName, text }]);
    });

    return () => {
      socket.disconnect();
    };
  }, [userId, targetUserId]);

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const socket = createSocketConnection();
    socket.emit('sendMessage', {
      firstName: loggedInUser.firstName,
      userId,
      targetUserId,
      text: newMessage,
    });
    setNewMessage('');
  };


  console.log("message 1" , message);
  console.log("message 2", newMessage);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[70vh] px-4 py-6">
      <div className="bg-white/90 backdrop-blur-md shadow-2xl w-full max-w-4xl border border-gray-200 rounded-lg">
        <div className="p-0">
          <div className="bg-blue-600 p-4 rounded-t-lg">
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              Chat Room
            </h1>
          </div>

          <div className="h-[50vh] sm:h-[60vh] overflow-y-auto space-y-4 p-4 bg-gray-50">
            {message?.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-16 w-16 mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
                <p className="text-lg">No messages yet. Start the conversation!</p>
              </div>
            ) : (
              <>
                {message?.map((message, index) => {
                  const isOwnMessage =
                    message?.firstName === loggedInUser?.firstName;
                  return (
                    <div
                      key={index}
                      className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-xs lg:max-w-md ${isOwnMessage ? 'order-2' : 'order-1'}`}>
                        <div className="text-xs opacity-70 mb-1">
                          {message?.firstName}
                          <time className="text-xs opacity-50 ml-2">
                            {messageSendTime(message.createdAt)}
                          </time>
                        </div>
                        <div
                          className={`rounded-lg px-4 py-2 ${
                            isOwnMessage
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-200 text-gray-800'
                          }`}
                        >
                          {message?.text}
                        </div>
                        <div className="text-xs opacity-50 mt-1">
                          {isOwnMessage && 'Seen'}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          <div className="flex gap-2 items-center p-4 bg-white border-t border-gray-200 rounded-b-lg">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <button
              onClick={sendMessage}
              disabled={!newMessage.trim()}
              className="w-12 h-12 rounded-full bg-blue-600 text-white hover:bg-blue-700 hover:scale-110 transition-transform disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;

