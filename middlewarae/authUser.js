const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Teacher = require('../models/teacher');
const ApiError = require('../utils/ApiError');
const httpstatus = require('http-status');
const authUser = async (req,res,next) => {
try{
    const token = req?.header("Authorization")?.replace("Bearer ","")
    if(!token){
        console.log('ho');
    throw new ApiError(httpstatus.UNAUTHORIZED,"token is missing")
}
const {_id} = jwt.verify(token , "elephent")
const  user =  _id? await User.findById({_id}):null;
if (!user?.id){
    console.log("Invalid token");
    throw new ApiError(httpstatus.UNAUTHORIZED,"Invalid token")
    
}
req.user = user
    next();

}
catch(err){
    console.log(err.message);
    console.log("noooo");
    next(new ApiError(httpstatus.UNAUTHORIZED,err.message||"invalid token" ));

}
}
const authTeacher = async (req,res,next) => {
try{
    const token = req?.header("Authorization")?.replace("Bearer ","")
    if(!token){
        console.log('ho');
    throw new ApiError(httpstatus.UNAUTHORIZED,"token is missing")
}
const {_id} = jwt.verify(token , "elephent")
const  teacher =  _id? await Teacher.findById({_id}):null;
if (!teacher?.id){
    console.log("Invalid token");
    throw new ApiError(httpstatus.UNAUTHORIZED,"Invalid token")
    
}
req.teacher = teacher
    next();

}
catch(err){
    console.log(err.message);
    console.log("noooo");
    next(new ApiError(httpstatus.UNAUTHORIZED,err.message||"invalid token" ));

}
}
module.exports = {authUser, authTeacher};

