const express = require('express');
const validator = require('./quiz.validator');
const validate = require('../../middlewarae/validate')
const handlers = require('./quiz.handlers')
const authUser = require('../../middlewarae/authUser');
const router = express.Router()
router.post('/createQuiz',authUser,validate(validator.createQuiz),handlers.createQuiz);
router.post('/submitQuiz',authUser,validate(validator.submitQuiz),handlers.submitQuiz);
router.get('/listQuiz',authUser,handlers.listQuiz);
module.exports = router

