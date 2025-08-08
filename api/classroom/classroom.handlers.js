const httpStatus = require('http-status');
const ApiError = require("../../utils/ApiError");
const genericResponse = require('../../utils/genericResponse');
const logger = require('../../config/logger');
const classroomService = require('./classroom.service');

async function getUsersInfoInClassroom(req, res, next) {
  try {
    const { classroomId } = req.body;
    if (!classroomId) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Classroom ID is required');
    }

    const usersInfo = await classroomService.getUsersInfoInClassroom(classroomId);

    res.status(200).send(genericResponse({success: true,data: usersInfo}));


  } 
  catch (err) {
    logger.error('[getUsersInfoInClassroom] failed', err);
    next(err);
  }
}

async function createClassroom(req, res, next) {
  try {
    const teacherId = req.teacher._id;
    const { title, users } = req.body;

    if (!title || !users || !Array.isArray(users) || users.length === 0) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Title and users are required');
    }

    const classroom = await classroomService.createClassroom({ title, users, teacherId });

    res.status(200).send(
      genericResponse({
        success: true,
        data: {
          classroomId: classroom._id,
          title: classroom.title
        }
      })
    );
  } catch (err) {
    logger.error('[createClassroom] failed', err);
    next(err);
  }
}

module.exports = {
  getUsersInfoInClassroom,
  createClassroom
};
