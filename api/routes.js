const express = require('express');
const router = express.Router()
const userRouter = require('./user/user.router')
const testRouter = require('./test/test.router')
const quizRouter = require('./quiz/quiz.router')
router.use('/user',userRouter);
router.use('/test',testRouter);
router.use('/quiz',quizRouter);

module.exports = router;