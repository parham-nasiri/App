const express = require('express');
const validator = require('./test.validator');
const validate = require('../../middlewarae/validate')
const handlers = require('./test.handlers');
const authUser = require('../../middlewarae/authUser');
const router = express.Router()
router.post('/createTest',authUser,validate(validator.createTest),handlers.createTest);
router.post('/answer',authUser,validate(validator.answerTest),handlers.answerTest);
//router.get('/getPoint',authUser,handlers.getPoint);
router.get('/listTests',authUser,handlers.listTests);
module.exports  = router