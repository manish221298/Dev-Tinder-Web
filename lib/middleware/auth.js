import jwt from 'jsonwebtoken';
import User from '@/lib/models/User';
import { NextResponse } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET || 'Mandani2216';

export default async function authenticateUser(request) {
    try {
        const authHeader = request.headers.get('authorization');

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ message: 'Authorization header missing or invalid' }, { status: 401 });
        }

        const token = authHeader.split(' ')[1];
        const tokenData = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(tokenData._id);

        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 401 });
        }

        // Attach user to request object by returning it
        return { user, error: null };
    } catch (err) {
        return { user: null, error: NextResponse.json({ message: err.message }, { status: 400 }) };
    }
}

