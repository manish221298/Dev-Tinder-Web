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

    const myConnection = await ConnectionRequest.find({
      $or: [
        { fromUserId: loggedInUser, status: 'accepted' },
        { toUserId: loggedInUser, status: 'accepted' },
      ],
    })
      .populate('toUserId', 'firstName lastName email photo nationality')
      .populate('fromUserId', 'firstName lastName email photo nationality');

    if (!myConnection) {
      return NextResponse.json({ message: 'Pending request not found' });
    }

    const data = myConnection.map((row) => {
      if (row.fromUserId._id.toString() === loggedInUser.toString()) {
        return row.toUserId;
      }
      return row.fromUserId;
    });

    return NextResponse.json({ message: 'Pending requests are ', data }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ message: err }, { status: 400 });
  }
}

