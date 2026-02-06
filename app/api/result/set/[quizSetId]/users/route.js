import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/connect';
import QuestionBank from '@/lib/models/QuestionBank';
import QuizResult from '@/lib/models/QuizResult';

export async function GET(request, { params }) {
  try {
    await connectDB();

    const paramsData = await params;
    const quizSetId = paramsData.quizSetId;

    if (!quizSetId) {
      return NextResponse.json({ error: 'Quiz set ID is required.' }, { status: 400 });
    }

    // Verify quiz set exists
    const questionSet = await QuestionBank.findById(quizSetId);
    if (!questionSet) {
      return NextResponse.json({ error: 'Question set not found.' }, { status: 404 });
    }

    // Fetch all results for this quiz set with user details
    const results = await QuizResult.find({ quizSetId: quizSetId })
      .populate('userId', 'firstName lastName email photo')
      .sort({ createdAt: -1 });

    // Format the results
    const userWiseResults = results.map((result) => {
      return {
        resultId: result._id,
        userId: result.userId ? result.userId._id : null,
        user: result.userId
          ? {
              firstName: result.userId.firstName,
              lastName: result.userId.lastName,
              email: result.userId.email,
              photo: result.userId.photo,
            }
          : null,
        totalQuestions: result.totalQuestions,
        correctAnswers: result.correctAnswers,
        incorrectAnswers: result.incorrectAnswers,
        score: result.score,
        results: result.results,
        submittedAt: result.createdAt,
      };
    });

    return NextResponse.json(
      {
        message: 'User-wise results retrieved successfully',
        quizSetId: quizSetId,
        quizSetName: questionSet.setName,
        totalSubmissions: userWiseResults.length,
        userResults: userWiseResults,
      },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      {
        error: 'Something went wrong while fetching user-wise results.',
        err: err.message,
      },
      { status: 500 }
    );
  }
}

