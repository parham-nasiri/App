const express = require('express');
const validator = require('./quiz.validator');
const validate = require('../../middlewarae/validate')
const handlers = require('./quiz.handlers')
const {authUser} = require('../../middlewarae/authUser');
const router = express.Router()
router.post('/getUsersInfoInClassroom',authUser,validate(validator.getUsersInfoInClassroom),handlers.getUsersInfoInClassroom);
router.post('/createClassroom',authUser,validate(validator.createClassroom),handlers.createClassroom);

module.exports = router

