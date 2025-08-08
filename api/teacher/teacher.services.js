const express = require('express');
const Teacher = require('./teacher');
const httpStatus = require('http-status');

async function getTeacherByEmailOrteacherName({email,teacherName}) {
    const condition =[]
    if (email){
        condition.push({email});
    }
    if (teacherName){
        condition.push({teacherName});
    }
    if (condition.length === 0) {
    return null;
}
    return Teacher.findOne({$or:condition});
}
async function listTeachersQeury() {
    const teachers = Teacher.find().sort({createdAt:-1})
    return teachers
}



module.exports = {getTeacherByEmailOrteacherName,listTeachersQeury}