const httpStatus = require('http-status');
const ApiError = require("../../utils/ApiError");
const services = require("./quiz.services");
const Quiz = require('./quiz');
const User = require('../user/user');
const handlers = require('../test/test.handlers');
const Submission = require('../Submission/Submission');
const genericResponse = require('../../utils/genericResponse');
const logger = require('../../config/logger');

async function createQuiz(req, res, next) {
  try {
    const { title, tests } = req.body;

    if (!title || !tests || !Array.isArray(tests) || tests.length === 0) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Title and tests are required');
    }

    const quiz = await services.findQuiz({ title }); // ✅ اضافه کردن await

    if (quiz) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Quiz with this title already exists');
    }

    const newQuiz = new Quiz({title,tests,createdBy: req.user._id});

    await newQuiz.save();

    res.status(200).send(
      genericResponse({
        success: true,
        data: { quizId: newQuiz._id, title: newQuiz.title }
      })
    );
  } catch (error) {
    logger.error(error);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json(
      genericResponse(false, error.message || 'Internal Server Error')
    );
  }
}

/*async function submitQuiz(req, res, next) {
  try {
    const userId = req.user._id;
    const { quizId, answers } = req.body;

    if (!quizId || !Array.isArray(answers)) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'quizId and answers are required');
    }

    const existingSubmission = await Submission.findOne({ quizId, studentId: userId });
    if (existingSubmission) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'You have already submitted this quiz');
    }

    const quiz = await Quiz.findById(quizId).populate('tests');
    if (!quiz) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Quiz not found');
    }

    let correctAnswersCount = 0;
    const answerMap = new Map();
    answers.forEach(ans => {
      answerMap.set(ans.testId.toString(), ans.selectedOption);
    });

    for (const test of quiz.tests) {
      const userAnswer = answerMap.get(test._id.toString());
      if (userAnswer !== undefined && userAnswer === test.answer) {
        correctAnswersCount++;
      }
    }

    const score = correctAnswersCount;

    const newSubmission = new Submission({
      quizId,
      studentId: userId,
      answers,
      score
    });

    await newSubmission.save();

    const user = await User.findById(userId);
    user.point += score;
    await user.save();

    res.status(200).send(
      genericResponse({
        success: true,
        data: {
          message: 'Quiz submitted successfully',
          score
        }
      })
    );
  } catch (err) {
    next(err);
  }
}
  */
async function startQuiz(req, res, next) {
  try {
    const { quizId } = req.body;

    if (!quizId) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'quizId is required');
    }
    const quiz = await Quiz.findById(quizId).populate('tests');
    if (!quiz) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Quiz not found');
    }
    const allTests = quiz.tests;
    if (allTests.length === 0) {
      throw new ApiError(httpStatus.NOT_FOUND, 'No questions found in this quiz');
    }
    const randomIndex = Math.floor(Math.random() * allTests.length);
    const randomTest = allTests[randomIndex];
    res.status(200).send(genericResponse({success: true,data: {testId: randomTest._id,title: randomTest.title,answersTitle: randomTest.answersTitle}
      })
    );

  } catch (err) {
    next(err);
  }
}
async function answerQuiz(req, res, next) {
  const {quizId,testId,answer} = req.body
  const userId = req.user._id;
  

  
}
async function listQuiz(req,res,next) {
    try {
        const quizes = await services.listQuizQeury();
        if(!quizes){
            throw new ApiError(httpStatus.NOT_FOUND,"cant find quizes")
        }
        res.send(genericResponse({success:true,data:{quizes}}))
    }
    catch(err){
        logger.info(`[listQuiz] list Quiz failed with error`,err)
        res.status(err.statusCode).send(genericResponse({success:false,errorMessage:err.message}))
    }
}
module.exports = { createQuiz, submitQuiz,listQuiz};
