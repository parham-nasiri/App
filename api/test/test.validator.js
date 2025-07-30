const joi = require('joi');
const createTest = {
    body: joi.object().keys({
        title: joi.string().min(3).max(200).required(),
        answer: joi.number().min(1).max(4).required(),
        answersTitle: joi.array().items(joi.string()).length(4).required()
    })
}
const answerTest = {
    body: joi.object().keys({
        answer: joi.number().min(1).max(4).required(),
        testId: joi.string().required(),
    })
}
module.exports = {createTest,answerTest}