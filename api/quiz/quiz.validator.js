const Joi = require('joi');

const createQuiz = {
  body: Joi.object().keys({
    title: Joi.string().min(3).max(200).required(),
    tests: Joi.array().items(Joi.string().length(24)).min(1).required(),
  }),
};

const submitQuiz = {
  body: Joi.object().keys({
    quizId: Joi.string().length(24).required(),
    answers: Joi.array().items(Joi.object({testId: Joi.string().length(24).required(),
    selectedOption: Joi.number().min(1).max(4).required()}))
      .min(1)
      .required(),
  }),
};

module.exports = { createQuiz, submitQuiz };
