import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/connect';
import QuestionBank from '@/lib/models/QuestionBank';
import QuizResult from '@/lib/models/QuizResult';
import authenticateUser from '@/lib/middleware/auth';

export async function POST(request) {
  try {
    await connectDB();

    const authResult = await authenticateUser(request);
    if (authResult.error) {
      return authResult.error;
    }

    const { user } = authResult;
    const { quizSetId, results } = await request.json();

    // Validate input
    if (!quizSetId) {
      return NextResponse.json({ error: 'Quiz set ID is required.' }, { status: 400 });
    }
    if (!Array.isArray(results) || results.length === 0) {
      return NextResponse.json(
        { error: 'Results array is required and must not be empty.' },
        { status: 400 }
      );
    }

    // Fetch the question set
    const questionSet = await QuestionBank.findById(quizSetId);
    if (!questionSet) {
      return NextResponse.json({ error: 'Question set not found.' }, { status: 404 });
    }

    // Create a map of question IDs to questions for quick lookup
    const questionMap = new Map();
    questionSet.questions.forEach((question) => {
      questionMap.set(question._id.toString(), question);
    });

    // Evaluate each answer
    let correctCount = 0;
    let totalQuestions = results.length;
    const evaluatedResults = results.map((result) => {
      const question = questionMap.get(result.questionId);

      if (!question) {
        return {
          question: result.question,
          questionId: result.questionId,
          selectedAnswer: result.selectedAnswer,
          correctAnswer: null,
          isCorrect: false,
          error: 'Question not found in question set',
        };
      }

      const isCorrect =
        result.selectedAnswer !== null &&
        result.selectedAnswer.trim().toLowerCase() === question.answer.trim().toLowerCase();

      if (isCorrect) {
        correctCount++;
      }

      return {
        question: result.question,
        questionId: result.questionId,
        selectedAnswer: result.selectedAnswer,
        correctAnswer: question.answer,
        isCorrect: isCorrect,
      };
    });

    // Calculate score
    const score = totalQuestions > 0 ? ((correctCount / totalQuestions) * 100).toFixed(2) : 0;

    // Save results to database
    const quizResult = new QuizResult({
      quizSetId: quizSetId,
      userId: user._id,
      results: evaluatedResults,
      totalQuestions: totalQuestions,
      correctAnswers: correctCount,
      incorrectAnswers: totalQuestions - correctCount,
      score: parseFloat(score),
    });

    const savedResult = await quizResult.save();

    return NextResponse.json(
      {
        message: 'Quiz submitted successfully',
        resultId: savedResult._id,
      },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      { error: 'Something went wrong while submitting the quiz.', err: err.message },
      { status: 500 }
    );
  }
}

