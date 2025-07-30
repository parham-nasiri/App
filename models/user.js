const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');
const { array } = require('joi');
const MAX_LOGIN_ATTEMPT=5;
// Define schema
const userSchema = new mongoose.Schema({
    username: {
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
    point:{
        type:Number,
        required:true,
        default:0
    },
   quizzesAnswered: {
  type: [mongoose.Schema.Types.ObjectId],
  ref: 'Quiz',
  default: [],
}

});
userSchema.virtual('userTest',{
ref:'UserTest',
localField:'_id',
foreignField:'userId'
})

userSchema.methods.toJSON = function () {
    const user = this;
    const userObject = user.toObject();
    delete userObject.password;
    return userObject;
};
//userSchema.methods.jsonwebtoken = async function(){
  //  const user = this
//const token = jwt.sign({ _id: user._id.toString() },
 // process.env.JWT_SECRET
//);
  //  user.tokens = user.tokens.concat({token})
   // await user.save()
   // return token  
//}
userSchema.methods.generateAuthToken = async function () {
    const user = this;
    const token = jwt.sign({ _id: user._id.toString() }, "elephent");
    user.tokens = user.tokens.concat({ token });

    await user.save();
    return token;
};

// Hash password before saving
userSchema.pre('save', async function (next) {
    const user = this;
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }
    next();
});

userSchema.statics.findByCredentials = async function (email,password){
    const user =await User.findOne({email});
    if(!user){
    throw new ApiError(httpStatus.NOT_FOUND,"email dose not exist")
    }
    if(user?.login_atempt && user?.login_atempt>=MAX_LOGIN_ATTEMPT){
        throw new ApiError(httpStatus.BAD_REQUEST,"Max login attempt reached")

    }
    const isMatch = await bcrypt.compare(password, user?.password);
    if(!isMatch){
        user.login_atempt = (user?.login_atempt || 0) + 1;
        await user.save();
        throw new ApiError(httpStatus.NOT_FOUND,"Invalid password")    
    }
    else {
        user.login_atempt = 0;
        await user.save();
    }
    return user;

};



const User = mongoose.model('User', userSchema);
module.exports = User;