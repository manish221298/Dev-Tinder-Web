import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/connect';
import User from '@/lib/models/User';
import authenticateUser from '@/lib/middleware/auth';

export async function PATCH(request) {
  try {
    await connectDB();

    const authResult = await authenticateUser(request);
    if (authResult.error) {
      return authResult.error;
    }

    const { user } = authResult;
    const userData = await User.findById(user._id);

    if (!userData) {
      return NextResponse.json({ message: 'Invalid request' }, { status: 400 });
    }

    const body = await request.json();
    Object.assign(userData, body);

    await userData.save();

    return NextResponse.json({ userData }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ message: err.message }, { status: 400 });
  }
}

