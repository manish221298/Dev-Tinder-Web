import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/connect';
import QuestionBank from '@/lib/models/QuestionBank';

export async function POST(request) {
  try {
    await connectDB();

    const { setName, questionSet, questions } = await request.json();

    if (
      !setName ||
      !questionSet ||
      !Array.isArray(questions) ||
      questions.length === 0
    ) {
      return NextResponse.json(
        { error: 'Please upload a valid question set with questions.' },
        { status: 400 }
      );
    }

    const newQuestionsSet = new QuestionBank({
      setName,
      questionSet,
      questions,
    });

    const savedData = await newQuestionsSet.save();

    return NextResponse.json(
      { message: 'Pdf uploaded successfully', savedData },
      { status: 201 }
    );
  } catch (err) {
    return NextResponse.json(
      { error: 'Something went wrong while saving the questions.', err: err.message },
      { status: 500 }
    );
  }
}

