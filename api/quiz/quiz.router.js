const express = require('express');
const validator = require('./quiz.validator');
const validate = require('../../middlewarae/validate')
const handlers = require('./quiz.handlers')
const {authUser} = require('../../middlewarae/authUser');
const router = express.Router()
router.post('/createQuiz',authUser,validate(validator.createQuiz),handlers.createQuiz);
router.post('/startQuiz',authUser,validate(validator.startQuiz),handlers.startQuiz);
router.post('/answerQuiz',authUser,validate(validator.answerQuiz),handlers.answerQuiz);
router.post('/previewQuiz',authUser,handlers.previewQuiz);
router.post('/answerPreviewQuiz',authUser,validate(validator.answerPreviewQuiz),handlers.answerPreviewQuiz);
router.get('/listQuiz',authUser,handlers.listQuiz);
module.exports = router

