const ApiError = require('../../utils/ApiError');
const httpStatus = require('http-status');
const Quiz = require('./quiz');
const TestProgress = require('../testProgress/testProgress');


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
async function getSeenTestIds(userId) {
  const answeredTests = await TestProgress.find({ userId });

  // همه testId هایی که isSeen:true هستند جمع می‌کنیم
  const seenTestIds = [];

  for (const doc of answeredTests) {
    for (const t of doc.test) {
      if (t.isSeen) {
        seenTestIds.push(t.testId.toString());
      }
    }
  }

  return seenTestIds;
}

async function getQuizWithTests(quizId) {
  const quiz = await Quiz.findById(quizId).populate('tests');
  if (!quiz) throw new ApiError(httpStatus.NOT_FOUND, 'Quiz not found');
  return quiz;
}
function getRandomUnseenTest(allTests, seenIds) {
  const unseen = allTests.filter(test => !seenIds.includes(test._id.toString()));
  if (unseen.length === 0) {
  return null; 
  }
  return unseen[Math.floor(Math.random() * unseen.length)];
}
function getRandomWrongeTest(allTests) {
  const wrongeAnswerd = allTests.filter(test => !isCorrect.includes(test._id.toString()));
  if (wrongeAnswerd.length === 0) {
    throw new ApiError(httpStatus.NOT_FOUND, 'No wrongeAnswerd questions left in this quiz');
  }
  return wrongeAnswerd[Math.floor(Math.random() * wrongeAnswerd.length)];
}


module.exports = { findQuiz ,listQuizQeury,getSeenTestIds, getQuizWithTests, getRandomUnseenTest ,getRandomWrongeTest};
