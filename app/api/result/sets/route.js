import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/connect';
import QuestionBank from '@/lib/models/QuestionBank';
import QuizResult from '@/lib/models/QuizResult';

export async function GET(request) {
  try {
    await connectDB();

    // Get all unique quizSetIds that have submissions
    const submissions = await QuizResult.distinct('quizSetId');

    if (submissions.length === 0) {
      return NextResponse.json(
        {
          message: 'No quiz sets with submissions found',
          quizSets: [],
        },
        { status: 200 }
      );
    }

    // Fetch all question sets that have submissions
    const questionSets = await QuestionBank.find({
      _id: { $in: submissions },
    });

    // Get submission counts for each quiz set
    const quizSetsWithCounts = await Promise.all(
      questionSets.map(async (questionSet) => {
        const submissionCount = await QuizResult.countDocuments({
          quizSetId: questionSet._id,
        });

        return {
          _id: questionSet._id,
          setName: questionSet.setName,
          questionSet: questionSet.questionSet,
          totalQuestions: questionSet.questions.length,
          submissionCount: submissionCount,
        };
      })
    );

    return NextResponse.json(
      {
        message: 'Quiz sets with submissions retrieved successfully',
        totalSets: quizSetsWithCounts.length,
        quizSets: quizSetsWithCounts,
      },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      {
        error: 'Something went wrong while fetching the quiz set details.',
        err: err.message,
      },
      { status: 500 }
    );
  }
}

