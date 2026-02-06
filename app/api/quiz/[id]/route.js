import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/connect';
import QuestionBank from '@/lib/models/QuestionBank';

export async function GET(request, { params }) {
  try {
    await connectDB();

    const paramsData = await params;
    const id = paramsData.id;

    if (!id) {
      return NextResponse.json({ error: 'Question set ID is required.' }, { status: 400 });
    }

    const questionSet = await QuestionBank.findById(id);
    if (!questionSet) {
      return NextResponse.json({ error: 'Question set not found.' }, { status: 404 });
    }

    return NextResponse.json(
      { message: 'Question set retrieved successfully', questionSet },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      { error: 'Something went wrong while fetching the question set.', err: err.message },
      { status: 500 }
    );
  }
}

