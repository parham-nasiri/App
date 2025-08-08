const express = require('express');
const User = require('./user');
const httpStatus = require('http-status');
const logger = require('../../config/logger');


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
async function getUserByIds(id) {
    return User.findById({_id:id})
}
async function followUser({followerUser,followingUser}) {
    if(!followerUser instanceof User || !followingUser instanceof User) {
        logger.error('[followUser] Invalid user instances provided');
        throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid user instances provided');
    }   
    if(!followingUser.followers?.includes(followerUser._id)) {
        await followingUser.updateOne({$push: {followers: followerUser._id}});
    }
    if(!followerUser.following?.includes(followingUser._id)) {
        await followerUser.updateOne({$push: {following: followingUser._id}});
    }
}

module.exports = {getUserByEmailOrUsername,listUsersQeury,getUserByIds,followUser}