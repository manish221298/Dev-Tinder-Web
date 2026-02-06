import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/connect';
import QuestionBank from '@/lib/models/QuestionBank';

export async function GET(request) {
  try {
    await connectDB();

    const questionsList = await QuestionBank.find({}).select('setName questionSet questions');
    const questionSetsSummary = questionsList.map((questionSet) => ({
      _id: questionSet._id,
      setName: questionSet.setName,
      questionSet: questionSet.questionSet,
      totalCount: questionSet.questions.length,
    }));

    return NextResponse.json(
      { message: 'Question sets retrieved successfully', questionSetsSummary },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      { error: 'Something went wrong while fetching the question sets.', err: err.message },
      { status: 500 }
    );
  }
}

