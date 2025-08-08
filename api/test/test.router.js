const express = require('express');
const validator = require('./test.validator');
const validate = require('../../middlewarae/validate')
const handlers = require('./test.handlers');
const {authUser, authTeacher} = require('../../middlewarae/authUser');
const router = express.Router()
router.post('/createTest',authTeacher,validate(validator.createTest),handlers.createTest);
router.post('/answer',authUser,validate(validator.answerTest),handlers.answerTest);
router.get('/listTests',authTeacher,handlers.listTests);
module.exports  = router