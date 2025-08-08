const Classroom = require('./classroom');
const User = require('../user/user');
const Submission = require('../Submission/Submission');
const ApiError = require('../../utils/ApiError');
const httpStatus = require('http-status');

async function getUsersInfoInClassroom(classroomId) {
  const classroom = await Classroom.findById(classroomId);
  if (!classroom) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Classroom not found');
  }

  const usersInfo = await Promise.all(
    classroom.users.map(async (userId) => {
      const user = await User.findById(userId);
      if (!user) return null;

      const finishedCount = await Submission.countDocuments({
        userId,
        finished: true
      });

      return {
        name: user.name,
        point: user.point || 0,
        finishedSubmissions: finishedCount
      };
    })
  );

  return usersInfo.filter(Boolean);
}

async function createClassroom({ title, users, teacherId }) {
  const existingClassroom = await Classroom.findOne({ title, teacher: teacherId });
  if (existingClassroom) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Classroom with this title already exists');
  }

  const newClassroom = new Classroom({ title, users, teacher: teacherId });
  await newClassroom.save();
  return newClassroom;
}

module.exports = {getUsersInfoInClassroom,createClassroom};
