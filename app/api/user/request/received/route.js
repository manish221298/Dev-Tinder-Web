import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/connect';
import ConnectionRequest from '@/lib/models/ConnectionRequest';
import authenticateUser from '@/lib/middleware/auth';

export async function GET(request) {
  try {
    await connectDB();

    const authResult = await authenticateUser(request);
    if (authResult.error) {
      return authResult.error;
    }

    const { user } = authResult;
    const loggedInUser = user._id;

    const requestedData = await ConnectionRequest.find({
      toUserId: loggedInUser,
      status: 'interested',
    }).populate('fromUserId', 'firstName lastName email photo nationality');

    if (!requestedData) {
      return NextResponse.json({ message: 'Pending request not found' });
    }

    return NextResponse.json({ message: 'Pending requests are ', data: requestedData }, {
      status: 200,
    });
  } catch (err) {
    return NextResponse.json({ message: err }, { status: 400 });
  }
}

