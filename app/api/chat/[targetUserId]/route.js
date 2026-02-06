import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/connect';
import { Chat } from '@/lib/models/Chat';
import mongoose from 'mongoose';
import authenticateUser from '@/lib/middleware/auth';

export async function GET(request, { params }) {
  try {
    await connectDB();

    const authResult = await authenticateUser(request);
    if (authResult.error) {
      return authResult.error;
    }

    const { user } = authResult;
    const userId = new mongoose.Types.ObjectId(user._id);
    const paramsData = await params;
    const targetUserId = paramsData.targetUserId;
    const targetUserObjectId = new mongoose.Types.ObjectId(targetUserId);

    let chat = await Chat.findOne({
      participants: { $all: [userId, targetUserObjectId] },
    }).populate('message.sendorId', 'firstName');

    if (!chat) {
      chat = new Chat({
        participants: [userId, targetUserObjectId],
        message: [],
      });
      await chat.save();
    }

    const chatData = chat?.message?.map((msg) => ({
      userId: msg.sendorId?._id || null,
      firstName: msg.sendorId?.firstName || 'Unknown',
      text: msg.text,
      createdAt: msg.createdAt,
    }));

    return NextResponse.json(chatData, { status: 200 });
  } catch (err) {
    console.error('Error fetching chat:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

