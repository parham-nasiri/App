const mongoose = require('mongoose');
const User = require('./user');
const Test = require('./userTest');
const Teacher = require('./teacher'); // Import the Teacher model

const classroomSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher',
    required: true,
  },
  users: [{
  type: mongoose.Schema.Types.ObjectId,
  ref: 'User'  // دقیقاً مطابق اسم مدل
}],
}, {
  timestamps: true,
});

classroomSchema.methods.toJSON = function () {
  const classroom = this;
  const classroomObject = classroom.toObject();

  return classroomObject;
};

const Classroom = mongoose.model('Classroom', classroomSchema);

module.exports = Classroom;
