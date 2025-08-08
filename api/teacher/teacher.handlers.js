const httpStatus = require('http-status');
const express = require('express');
const ApiError = require("../../utils/ApiError");
const Teacher = require('./teacher');
const genericResponse = require('../../utils/genericResponse');
const logger = require('../../config/logger');
const {getTeacherByEmailOrteacherName,listTeachersQeury,getteachersByIds} = require('./teacher.services')
async function login(req,res,next) {
    try {
    const{email,password} = req.body;
    const teacher  = await Teacher.findByCredentials(email,password);
    if (!teacher){
        throw new ApiError(httpStatus.NOT_FOUND,"teacher did not found with this email and password")
    }
    const token = await teacher.generateAuthToken();
    
    res.send(genericResponse({success:true,data:({teacher,token})}))
    } catch (err) {
        logger.info(`[login] login failed with error`,err);
        next(err)
    }
}



async function createTeacher(req, res, next) {
    try {
        const { email, teacherName, password } = req.body;

        // استفاده از مدل با حرف بزرگ
        const existingTeacher = await getTeacherByEmailOrteacherName({ email, teacherName });

        if (existingTeacher?.teacherName === teacherName) {
            throw new ApiError(httpStatus.BAD_REQUEST, "this teacherName is already taken");
        }
        if (existingTeacher?.email === email) {
            throw new ApiError(httpStatus.BAD_REQUEST, "this email is already taken");
        }

        const newTeacher = new Teacher({ email, teacherName, password });
        await newTeacher.save();

        const token = await newTeacher.generateAuthToken();
        res.send(genericResponse({ data: { teacher: newTeacher, token: token } }));
    } catch (err) {
        logger.error(`[createTeacher] Create Teacher failed with error`, err);
        next(err);
    }
}



async function listTeacher(req,res,next) {
    try {
        const teachers = await listTeachersQeury();
        if(!teachers){
            throw new ApiError(httpStatus.NOT_FOUND,"cant find teachers")
        }
        res.send(genericResponse({success:true,data:{teachers}}))
    }
    catch(err){
        logger.info(`[listTeachers] list Teachers failed with error`,err)
        res.status(err.statusCode).send(genericResponse({success:false,errorMessage:err.message}))
    }
}
/*async function getteacherByIdHandler(req,res,next) {
    try {
        const {ids} = req.body;
        if(!Array.isArray(ids)||ids.some(id => typeof id != 'string')){
             throw new ApiError(httpStatus.BAD_REQUEST,"invail id input");
        }
        const teachers = await getteachersByIds(ids);
            if(!teachers||teachers.length===0){
                throw new ApiError(httpStatus.NOT_FOUND,"No teacher found with ids")
            }
            res.send(genericResponse({success:true,status:httpStatus,data:teachers.map(teacher => teacher.toJSON())}))
    } catch (err) {
        logger.error(`[getteachersByIds] fetching teachers failed ${err}`);
            

        res.status(err.statusCode||500).send(genericResponse({success:false,errorMessage:err.message}))
    }
}
    */





module.exports = {login,createTeacher,listTeacher/*,getteacherByIdHandler*/};