const httpStatus = require('http-status');
const ApiError = require("../../utils/ApiError");
const services = require("./quiz.services");
const Quiz = require('./quiz');
const User = require('../user/user');
const Test = require('../test/test'); 
const TestProgress = require('../testProgress/testProgress');
const handlers = require('../test/test.handlers');
const Submission = require('../Submission/Submission');
const genericResponse = require('../../utils/genericResponse');
const logger = require('../../config/logger');

async function createQuiz(req, res, next) {
  try {
    const { title, tests,number ,teacherQuiz} = req.body;

    if (!title || !tests || !Array.isArray(tests) || tests.length === 0|| !number) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Title and tests are required');
    }

    const quiz = await services.findQuiz({ title });

    if (quiz) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Quiz with this title already exists');
    }
    if(teacherQuiz){
    const duplicateNumber = await Quiz.findOne({ number });

    if (duplicateNumber) {
      throw new ApiError(httpStatus.CONFLICT, `Quiz number ${number} already exists`);
    }
    const newQuiz = new Quiz({title,tests,createdBy: req.user._id, number });
     await newQuiz.save();

    res.status(200).send(
      genericResponse({
        success: true,
        data: { quizId: newQuiz._id, title: newQuiz.title ,number: newQuiz.number}
      })
    );
    
  }
  else{
    const newQuiz = new Quiz({title,tests,createdBy: req.user._id});
    await newQuiz.save();
    res.status(200).send(genericResponse({success: true,data: { quizId: newQuiz._id, title: newQuiz.title}}));
    }

  } 
  catch (error) {
    logger.error(error);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json(
      genericResponse(false, error.message || 'Internal Server Error')
    );
  }
}
async function startMainQuiz(req, res, next) {
  try {
    const userId = req.user._id;
    if (!userId) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'User ID not found from token');
    }

    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'User not found');
    }

    const ranked = user.ranked;
    const quiz = await Quiz.findOne({ number: ranked }).populate('tests');
    if (!quiz) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Quiz not found');
    }

    // ایجاد یک submission جدید
    const submission = new Submission({
      quizId: quiz._id,
      userId: userId,
      score: user.point || 0,
      finished: false
    });
    await submission.save();

    const allTests = quiz.tests;
    if (allTests.length === 0) {
      throw new ApiError(httpStatus.NOT_FOUND, 'No questions found in this quiz');
    }

    const randomIndex = Math.floor(Math.random() * allTests.length);
    const randomTest = allTests[randomIndex];

    res.status(200).send(
      genericResponse({
        success: true,
        data: {
          testId: randomTest._id,
          title: randomTest.title,
          answersTitle: randomTest.answersTitle
        }
      })
    );
  } catch (err) {
    next(err);
  }
}
async function startTeacherQuiz(req, res, next) {
  try {
    const { quizId } = req.body;
    const userId = req.user._id;
    if (!userId) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'User ID not found from token'); 
    }
    const user = await User.findById(userId);
    if (!user) { 
      throw new ApiError(httpStatus.UNAUTHORIZED, 'User not found');
    }
    if (!quizId) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'quizId is required');
    }
    const quiz = await Quiz.findById(quizId).populate('tests');
    if (!quiz) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Quiz not found');
    }
    const submission = new Submission({quizId,studentId: userId,score: user.point, finished: false});
    await submission.save();
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
  try {
    const { quizId, testId, answer } = req.body;
    const userId = req.user._id;
    if (!quizId || !testId || !answer) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'quizId, testId and answer are required');
    }

    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'User not found');
    }

   
    req.body.answer = answer;
    req.body.testId = testId;
    const result  = await handlers.answerTest(req, res, next);
const submission = await Submission.findOne({ quizId, studentId: userId });
    if (!submission) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Submission not found for this quiz');}
const progress = await TestProgress.findOne({
  userId,
  test: { $elemMatch: { testId: testId } }
});
    if (!progress) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Progress not found for this user and test');
    }
      

    if (progress.isCorrect && progress.firstAnswer)
       {user.point += 10;await user.save();
        submission.score += 10;await submission.save();
       }
    const seenTestIds = await services.getSeenTestIds(userId,testId);
    const quiz = await services.getQuizWithTests(quizId);
    const nextTest = services.getRandomUnseenTest(quiz.tests, seenTestIds);
    if (!nextTest) {
      submission.finished = true ;await submission.save();
      if(!result){
        return res.status(httpStatus.OK||200).send(
        genericResponse({success: true, data: {message: 'Quiz completed successfully'}})
        );
      }
      return res.status(500).send(
        genericResponse({success: true, data: {message: 'Quiz completed successfully',result: result}})
      );
    }
      if(!result){
        return res.status(httpStatus.OK||200).send(
        genericResponse({success: true,data: {quizId,testId: nextTest._id,title: nextTest.title, answersTitle: nextTest.answersTitle,result: 'true answer' }})
        );
      }
      return res.status(httpStatus.OK||200).send(
      genericResponse({success: true,data: {quizId,testId: nextTest._id,title: nextTest.title, answersTitle: nextTest.answersTitle,result: result }})
      );
    
  } 
  catch (err) {
  logger.info(`[login] login failed with error`,err);
        next(err)
}
}
async function previewQuiz(req, res, next) {
  try {
    const userId = req.user._id;
    if(!userId){
      throw new ApiError(httpStatus.NOT_FOUND, 'No userId found');
    }
    const progress = await TestProgress.findOne({ userId });
    if (!progress || !progress.test || progress.test.length === 0) {
      throw new ApiError(httpStatus.NOT_FOUND, 'No progress found');
    }

    const incorrectTestIds = progress.test
      .filter(item => item.isCorrect === false)
      .map(item => item.testId.toString());

    if (incorrectTestIds.length === 0) {
      throw new ApiError(httpStatus.NOT_FOUND, 'No incorrect answers found');
    }

    // گرفتن اطلاعات تست‌ها از دیتابیس
    const allTests = await Test.find({ _id: { $in: incorrectTestIds } });

    const randomIndex = Math.floor(Math.random() * allTests.length);
    const randomTest = allTests[randomIndex];

    res.status(200).send(
      genericResponse({
        success: true,
        data: {
          testId: randomTest._id,
          title: randomTest.title,
          answersTitle: randomTest.answersTitle
        }
      })
    );
  } catch (err) {
    next(err);
  }
}
async function answerPreviewQuiz(req, res, next) {
try {
    const { testId, answer } = req.body;
    const userId = req.user._id;
    if (!testId || !answer) {
      throw new ApiError(httpStatus.BAD_REQUEST, ' testId and answer are required');
    }

    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'User not found');
    }

    req.body.answer = answer;
    req.body.testId = testId;
    const result  = await handlers.answerTest(req, res, next);
    const nextTest = await TestProgress.findOne({ userId, testId });
     if (!nextTest) {
      if(!result){
        return res.status(httpStatus.OK||200).send(
        genericResponse({success: true, data: {message: 'Preview completed successfully'}})
        );
      }
    }
      if(!result){
        return res.status(httpStatus.OK||200).send(
        genericResponse({success: true,data: {testId: nextTest._id,title: nextTest.title, answersTitle: nextTest.answersTitle,result: 'true answer' }})
        );
      }
      return res.status(httpStatus.OK||200).send(
      genericResponse({success: true,data: {testId: nextTest._id,title: nextTest.title, answersTitle: nextTest.answersTitle,result: result }})
      );




  }
  catch (err) {
    logger.error('[answerPreviewQuiz] failed', err);
    res.status(err.statusCode || 500).send(genericResponse({ success: false, errorMessage: err.message }));
  }
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
module.exports = { createQuiz,startTeacherQuiz,answerQuiz,listQuiz,previewQuiz,answerPreviewQuiz}
