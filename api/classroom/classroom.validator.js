const Joi = require('joi');

const createClassroom = {
  body: Joi.object().keys({
    title: Joi.string().min(3).max(200).required(),
    users: Joi.array().items(Joi.string().length(24)).min(1).required()
  }),
};
const getUsersInfoInClassroom = {
  body: Joi.object().keys({
    classroomId: Joi.string().length(24).required()
  }),
};
module.exports = {createClassroom,getUsersInfoInClassroom};
