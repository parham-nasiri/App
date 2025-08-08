const express = require('express');
const validator = require('./quiz.validator');
const validate = require('../../middlewarae/validate')
const handlers = require('./quiz.handlers')
const {authUser, authTeacher} = require('../../middlewarae/authUser');
const router = express.Router()
router.post('/createQuiz',authTeacher,validate(validator.createQuiz),handlers.createQuiz);
router.get('/startMainQuiz',authUser,handlers.startMainQuiz);
router.post('/startTeacherQuiz',authUser,validate(validator.startQuiz),handlers.startTeacherQuiz);
router.post('/answerQuiz',authUser,validate(validator.answerQuiz),handlers.answerQuiz);
router.post('/previewQuiz',authUser,handlers.previewQuiz);
router.post('/answerPreviewQuiz',authUser,validate(validator.answerPreviewQuiz),handlers.answerPreviewQuiz);
router.get('/listQuiz',authTeacher,handlers.listQuiz);
module.exports = router

