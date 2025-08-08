const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');
const { array } = require('joi');
const MAX_LOGIN_ATTEMPT=5;
const teacherSchema = new mongoose.Schema({
    teacherName: {
        type: String,
        unique: true,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Invalid email');
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('Password cannot include the word "password"');
            }
        }
    },
    tokens:[{
        token:{
            type:String,
            required:false
        }
    }],
    login_atempt:{
        type : Number,
        required:true,
        default:0
    },

});
/*userSchema.virtual('userTest',{
ref:'UserTest',
localField:'_id',
foreignField:'userId'
})*/

teacherSchema.methods.toJSON = function () {
    const teacher = this;
    const teacherObject = teacher.toObject();
    delete teacherObject.password;
    return teacherObject;
};
teacherSchema.methods.generateAuthToken = async function () {
    const teacher = this;
    const token = jwt.sign({ _id: teacher._id.toString() }, "elephent");
    teacher.tokens = teacher.tokens.concat({ token });

    await teacher.save();
    return token;
};
// Hash password before saving
teacherSchema.pre('save', async function (next) {
    const teacher = this;
    if (teacher.isModified('password')) {
        teacher.password = await bcrypt.hash(teacher.password, 8);
    }
    next();
});

teacherSchema.statics.findByCredentials = async function (email,password){
    const teacher =await Teacher.findOne({email});
    if(!teacher){
    throw new ApiError(httpStatus.NOT_FOUND,"email dose not exist")
    }
    if(teacher?.login_atempt && teacher?.login_atempt>=MAX_LOGIN_ATTEMPT){
        throw new ApiError(httpStatus.BAD_REQUEST,"Max login attempt reached")

    }
    const isMatch = await bcrypt.compare(password, teacher?.password);
    if(!isMatch){
        teacher.login_atempt = (teacher?.login_atempt || 0) + 1;
        await teacher.save();
        throw new ApiError(httpStatus.NOT_FOUND,"Invalid password")    
    }
    else {
        teacher.login_atempt = 0;
        await teacher.save();
    }
    return teacher;

};



const Teacher = mongoose.model('Teacher', teacherSchema);
module.exports = Teacher;