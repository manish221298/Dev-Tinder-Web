import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/connect';
import User from '@/lib/models/User';

export async function POST(request) {
    try {
        await connectDB();

        const { email, password } = await request.json();
        const user = await User.findOne({ email });

        if (!user) {
            return NextResponse.json('Invald email or password', { status: 401 });
        }

        const verifyPassword = await user.passwordVerify(password);

        if (!verifyPassword) {
            return NextResponse.json('Invald email or password', { status: 401 });
        }

        const token = await user.getJWT();

        return NextResponse.json({ token: token, data: user }, { status: 200 });
    } catch (err) {
        return NextResponse.json(err.message, { status: 400 });
    }
}

