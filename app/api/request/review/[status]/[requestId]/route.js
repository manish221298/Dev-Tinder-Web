import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/connect';
import ConnectionRequest from '@/lib/models/ConnectionRequest';
import authenticateUser from '@/lib/middleware/auth';

export async function POST(request, { params }) {
  try {
    await connectDB();

    const authResult = await authenticateUser(request);
    if (authResult.error) {
      return authResult.error;
    }

    const { user } = authResult;
    const toUserId = user._id;
    const paramsData = await params;
    const status = paramsData.status;
    const requestId = paramsData.requestId;

    const allowedStatus = ['accepted', 'rejected'];

    if (!allowedStatus.includes(status)) {
      return NextResponse.json({ message: 'Invalid status ' + status }, { status: 401 });
    }

    const validateRequest = await ConnectionRequest.findOne({
      _id: requestId,
      status: 'interested',
      toUserId: toUserId,
    });

    if (!validateRequest) {
      return NextResponse.json({ message: 'Invalid Connection request' }, { status: 401 });
    }

    validateRequest.status = status;

    const data = await validateRequest.save();
    return NextResponse.json({ message: 'Connection request is' + status, data }, { status: 200 });
  } catch (err) {
    return NextResponse.json(err, { status: 500 });
  }
}

