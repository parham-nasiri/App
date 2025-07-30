const ApiError = require('../../utils/ApiError');
const httpStatus = require('http-status');
const Quiz = require('./quiz');

async function findQuiz({ title }) {
  const quiz = await Quiz.findOne({ title }); 
  if (quiz) {
    throw new ApiError(httpStatus.NOT_FOUND, 'title is taken');
  }
  return quiz;
}
async function listQuizQeury() {
    const quizes = await Quiz.find().sort({createdAt:-1})
    return quizes
}
module.exports = { findQuiz ,listQuizQeury};
