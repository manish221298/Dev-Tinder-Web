import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/connect';
import User from '@/lib/models/User';
import validateUsers from '@/lib/utils/authValidator';
import bcrypt from 'bcrypt';

export async function POST(request) {
  try {
    await connectDB();

    const {
      firstName,
      lastName,
      email,
      password,
      bio,
      gender,
      nationality,
      photo,
    } = await request.json();

    validateUsers(email, password);
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      bio,
      gender,
      nationality,
      photo,
    });
    await user.save();
    return NextResponse.json('User Registered Successfully !', { status: 201 });
  } catch (err) {
    return NextResponse.json(err.message, { status: 400 });
  }
}

