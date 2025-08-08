const express = require('express');
const validator = require('./user.validator')
const validate = require('../../middlewarae/validate')
const handlers = require('./user.handlers');
const {authUser} = require('../../middlewarae/authUser');
const router = express.Router()
router.post('/login',validate(validator.login),handlers.login);
router.post('/createUser',validate(validator.createUser),handlers.createUser);
router.get('/list',authUser,handlers.listUser);
router.post('/follow',authUser,validate(validator.getUserById),handlers.follow)
module.exports = router