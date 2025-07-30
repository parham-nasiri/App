const express = require('express');
const User = require('./user');
const httpStatus = require('http-status');


async function getUserByEmailOrUsername({email,username}) {
    const condition =[]
    if (email){
        condition.push({email});
    }
    if (username){
        condition.push({username});
    }
    if (condition.length === 0) {
    return null;
}
    return User.findOne({$or:condition});
}
async function listUsersQeury() {
    const users = User.find().sort({createdAt:-1})
    return users
}



module.exports = {getUserByEmailOrUsername,listUsersQeury}