const mongoose = require('mongoose');
const User = require('./user');
const Test = require('./userTest');

const quizSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  number:{
    type: Number,
    required: true,
    Unique: true
  },
  tests: [{
  type: mongoose.Schema.Types.ObjectId,
  ref: 'userTest'  // دقیقاً مطابق اسم مدل
}]
,
}, {
  timestamps: true,
});

quizSchema.methods.toJSON = function () {
  const quiz = this;
  const quizObject = quiz.toObject();

  return quizObject;
};

const Quiz = mongoose.model('Quiz', quizSchema);

module.exports = Quiz;
