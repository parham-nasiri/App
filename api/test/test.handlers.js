const httpStatus = require('http-status');
const authUser = require('../../middlewarae/authUser');
const ApiError = require("../../utils/ApiError");
const Test = require('./test');
const TestProgress = require('../testProgress/testProgress');
const services = require('./test.services')
const genericResponse = require('../../utils/genericResponse');
const logger = require('../../config/logger');
async function createTest(req,res,next) {
    try {
    const userId = req.user._id;
    if(!userId){
      throw new ApiError(httpStatus.UNAUTHORIZED, 'User ID not found from token');
    }
    const { title, answer, answersTitle } = req.body;
    const newTest = new Test({ title, answer, answersTitle });
    const test = await services.findByTitl({ title });
    if (test) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Test with this title already exists');
    }
    newTest.userId =userId

    await newTest.save();
res.status(200).send(genericResponse({ success: true, data: newTest._id }));

    } catch (error) {
        logger.error(error);
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json(genericResponse(false, error.message || 'Internal Server Error'));
    }
}
async function answerTest(req, res, next) {
  try {
    const userId = req.user._id;
    if (!userId) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'User ID not found from token');
    }

    const { answer, testId } = req.body;
    if (!testId) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'test ID not provided');
    }

    const realAnswer = await services.findAnswer({ testId });

    const existingProgress = await TestProgress.findOne({ userId });

    if (answer == realAnswer) {
      if (!existingProgress) {
        const newProgress = new TestProgress({
          userId,
          test: [{
            testId,
            firstAnswer: true,
            isCorrect: true,
            isSeen: true
          }]
        });
        await newProgress.save();
        return null;
      } else {
        existingProgress.test.push({
          testId,
          isCorrect: true,
          firstAnswer: false,
          isSeen: true
        });
        await existingProgress.save();
        return null;
      }
    } else {
      if (!existingProgress) {
        const newProgress = new TestProgress({
          userId,
          test: [{
            testId,
            firstAnswer: false,
            isCorrect: false,
            isSeen: true
          }]
        });
        await newProgress.save();
        return realAnswer;
      } else {
        existingProgress.test.push({
          testId,
          isCorrect: false,
          firstAnswer: false,
          isSeen: true
        });
        await existingProgress.save();
        return realAnswer;
      }
    }

  } catch (err) {
    logger.error(`[answerTest] Answer Test failed with error`, err);
    res
      .status(err.statusCode || httpStatus.INTERNAL_SERVER_ERROR)
      .send(genericResponse({ success: false, errorMessage: err.message }));
  }
}

async function listTests(req,res,next) {
    try {
        const tests = await services.listTestsQeury();
        if(!tests){
            throw new ApiError(httpStatus.NOT_FOUND,"cant find tests")
        }
        res.send(genericResponse({success:true,data:{tests}}))
    }
    catch(err){
        logger.info(`[listTests] listTests failed with error`,err)
        res.status(err.statusCode).send(genericResponse({success:false,errorMessage:err.message}))
    }
}
module.exports = {createTest,answerTest,listTests};