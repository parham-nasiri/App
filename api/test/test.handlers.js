const httpStatus = require('http-status');
const authUser = require('../../middlewarae/authUser');
const ApiError = require("../../utils/ApiError");
const Test = require('./test');
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
async function answerTest (req,res,next){
 try {
    const userId = req.user._id;
    if(!userId){
      throw new ApiError(httpStatus.UNAUTHORIZED, 'User ID not found from token');
    }
    const {answer,testId} = req.body
    if(!testId){
        throw new ApiError(httpStatus.BAD_REQUEST, 'test ID not provided');
    }
    const realAnswer = await services.findAnswer({testId})
    if(answer == realAnswer){
       const userPoint = await services.getPoint({ _id: userId })
       if(userPoint==0){
        throw new ApiError(httpStatus.BAD_REQUEST, 'userPoint error');
        }
        res.send(genericResponse({success:true,data:{userPoint}}))
    }
    else{
        throw new ApiError(httpStatus.BAD_REQUEST, 'Wrong answer')
    }
}
catch (err) {
  logger.error(`[answerTest] answerTest failed with error`, err);
  res.status(err.statusCode || 500).send(
    genericResponse({ success: false, errorMessage: err.message })
  );
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