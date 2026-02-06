import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/connect';
import ConnectionRequest from '@/lib/models/ConnectionRequest';
import User from '@/lib/models/User';
import authenticateUser from '@/lib/middleware/auth';

export async function POST(request, { params }) {
  try {
    await connectDB();

    const authResult = await authenticateUser(request);
    if (authResult.error) {
      return authResult.error;
    }

    const { user } = authResult;
    const fromUserId = user._id;
    const paramsData = await params;
    const status = paramsData.status;
    const toUserId = paramsData.toUserId;

    const allowedStatus = ['interested', 'ignored'];

    if (!allowedStatus.includes(status)) {
      return NextResponse.json({ message: 'Invalid status ' + status }, { status: 401 });
    }

    const validateUser = await User.findById(toUserId);

    if (!validateUser) {
      return NextResponse.json({ message: "User doesn't exist" }, { status: 401 });
    }

    const validateConnection = await ConnectionRequest.findOne({
      $or: [
        { toUserId, fromUserId },
        { toUserId: fromUserId, fromUserId: toUserId },
      ],
    });

    if (validateConnection) {
      return NextResponse.json({ message: 'Connection already exist' }, { status: 401 });
    }

    if (toUserId.toString() === fromUserId.toString()) {
      return NextResponse.json(
        { message: "You can't send connection to yourself" },
        { status: 401 }
      );
    }

    const connectionReqData = new ConnectionRequest({
      fromUserId,
      toUserId,
      status,
    });

    const data = await connectionReqData.save();

    return NextResponse.json({ message: 'Connection sent successully', data }, { status: 201 });
  } catch (err) {
    return NextResponse.json(err, { status: 500 });
  }
}

