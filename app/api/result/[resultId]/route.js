import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/connect';
import QuizResult from '@/lib/models/QuizResult';

export async function DELETE(request, { params }) {
  try {
    await connectDB();

    const paramsData = await params;
    const resultId = paramsData.resultId;

    if (!resultId) {
      return NextResponse.json({ error: 'Result ID is required.' }, { status: 400 });
    }

    // Find the result to verify it exists
    const result = await QuizResult.findById(resultId);
    if (!result) {
      return NextResponse.json({ error: 'Result not found.' }, { status: 404 });
    }

    // Delete the result
    await QuizResult.findByIdAndDelete(resultId);

    return NextResponse.json(
      {
        message: 'Result deleted successfully',
        resultId: resultId,
      },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      {
        error: 'Something went wrong while deleting the result.',
        err: err.message,
      },
      { status: 500 }
    );
  }
}

