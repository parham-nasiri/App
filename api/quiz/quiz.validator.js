const Joi = require('joi');

const createQuiz = {
  body: Joi.object().keys({
    title: Joi.string().min(3).max(200).required(),
    tests: Joi.array().items(Joi.string().length(24)).min(1).required(),
    number: Joi.number()
  }),
};

const startQuiz = {
  body: Joi.object().keys({
    quizId: Joi.string().length(24).required()
  }),
};
const answerQuiz = {
  body: Joi.object().keys({
    quizId: Joi.string().length(24).required(),
    testId: Joi.string().length(24).required(),
    answer: Joi.number().min(1).max(4).required()
  }),
};
const answerPreviewQuiz = {
  body: Joi.object().keys({
    testId: Joi.string().length(24).required(),
    answer: Joi.number().min(1).max(4).required()
  }),
};

module.exports = { createQuiz, startQuiz,answerQuiz,answerPreviewQuiz };