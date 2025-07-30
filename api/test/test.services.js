const ApiError = require('../../utils/ApiError');
const User = require('../user/user')
const Test = require('./test')
async function findByTitl({title}) {
    const oldTest = await Test.findOne({title});
    return oldTest
}
async function findAnswer({ testId }) {
  const test = await Test.findById(testId);
  if (!test) {
    throw new ApiError(404, 'Test not found');
  }
  return test.answer;
}
async function getPoint({userId}) {
    const user  = await User.findOne({userId})
    if(!user){
        throw new ApiError(404, 'User not found');
    }
    user.point = (user?.point || 0) + 1;
    await user.save();
    return user.point;
}
async function listTestsQeury() {
    const tests = await Test.find().sort({createdAt:-1})
    return tests
}
module.exports = {findByTitl, findAnswer, getPoint,listTestsQeury}