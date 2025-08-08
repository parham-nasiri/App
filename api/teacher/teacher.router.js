const express = require('express');
const validator = require('./teacher.validator')
const validate = require('../../middlewarae/validate')
const handlers = require('./teacher.handlers');
const {authTeacher} = require('../../middlewarae/authUser');
const router = express.Router()
router.post('/login',validate(validator.login),handlers.login);
router.post('/createTeacher',validate(validator.createTeacher),handlers.createTeacher);
router.get('/list',authTeacher,handlers.listTeacher);
module.exports = router