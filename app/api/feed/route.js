import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/connect';
import ConnectionRequest from '@/lib/models/ConnectionRequest';
import User from '@/lib/models/User';
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

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    let limit = parseInt(searchParams.get('limit')) || 10;
    limit = limit > 20 ? 20 : limit;
    const skip = (page - 1) * limit;

    const myConnectionReq = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUser }, { toUserId: loggedInUser }],
    }).select('fromUserId toUserId -_id');

    const uniqueReqId = new Set();

    myConnectionReq.forEach((req) => {
      uniqueReqId.add(req.fromUserId.toString());
      uniqueReqId.add(req.toUserId.toString());
    });

    const feedUsers = await User.find({
      $and: [
        { _id: { $nin: [...uniqueReqId] } },
        { _id: { $ne: loggedInUser } },
      ],
    })
      .select('firstName lastName email skills gender nationality photo bio ')
      .skip(skip)
      .limit(limit);

    return NextResponse.json({ feedUsers }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ message: err }, { status: 400 });
  }
}

