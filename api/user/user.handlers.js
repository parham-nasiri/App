const httpStatus = require('http-status');
const express = require('express');
const ApiError = require("../../utils/ApiError");
const User = require('./user');
const genericResponse = require('../../utils/genericResponse');
const logger = require('../../config/logger');
const {getUserByEmailOrUsername,listUsersQeury,getUsersByIds,getUserByIds,followUser} = require('./user.services');
const Submission = require('../Submission/Submission');
async function login(req,res,next) {
    try {
        
    
    const{email,password} = req.body;
    const user  = await User.findByCredentials(email,password);
    if (!user){
        throw new ApiError(httpStatus.NOT_FOUND,"user did not found with this email and password")
    }
    const token = await user.generateAuthToken();
    
    res.send(genericResponse({success:true,data:({user,token})}))
    } catch (err) {
        logger.info(`[login] login failed with error`,err);
        next(err)
    }
}



async function createUser(req,res,next) {
    try{
        const {email,username,password} = req.body;
        const newUser = new User({email,username,password});
        const user = await getUserByEmailOrUsername({email,username});
        if(user?.username ==username){
            throw new ApiError(httpStatus.BAD_REQUEST,"this username is already taken")
        }
        if(user?.email ==email){
            throw new ApiError(httpStatus.BAD_REQUEST,"this email is already taken")
        }
        await newUser.save();
        const token = await newUser.generateAuthToken();
        res.send(genericResponse({data:{user:newUser,token:token}}));
    }
    catch(err){
        logger.error(`[createUser] Create User failed with error`, err);
       // res.status(err.statusCode || 500).send(genericResponse({success:false,errorMessage:err.message}))
        next(err);
    }
}


async function listUser(req,res,next) {
    try {
        const users = await listUsersQeury();
        if(!users){
            throw new ApiError(httpStatus.NOT_FOUND,"cant find users")
        }
        res.send(genericResponse({success:true,data:{users}}))
    }
    catch(err){
        logger.info(`[listUsers] list Users failed with error`,err)
        res.status(err.statusCode).send(genericResponse({success:false,errorMessage:err.message}))
    }
}
/*async function getUserByIdHandler(req,res,next) {
    try {
        const {ids} = req.body;
        if(!Array.isArray(ids)||ids.some(id => typeof id != 'string')){
             throw new ApiError(httpStatus.BAD_REQUEST,"invail id input");
        }
        const users = await getUsersByIds(ids);
            if(!users||users.length===0){
                throw new ApiError(httpStatus.NOT_FOUND,"No user found with ids")
            }
            res.send(genericResponse({success:true,status:httpStatus,data:users.map(user => user.toJSON())}))
    } catch (err) {
        logger.error(`[getUsersByIds] fetching users failed ${err}`);
            

        res.status(err.statusCode||500).send(genericResponse({success:false,errorMessage:err.message}))
    }
}
    */
async function follow(req,res,next) {
    const payload = req.body
    const followerUser = new User(req.user)
    try {
        let{followingUserId} = payload;
        if(followingUserId===followerUser?.id){
            throw new ApiError (httpStatus.BAD_REQUEST, "You cannot follow yourself");
        }
        const followingUser = await getUserByIds({id:followingUserId});
        if(!followingUser){
            throw new ApiError(httpStatus.NOT_FOUND,"Following user not found");
        }
        await followUser({followerUser,followingUser});
        res.send(genericResponse({success:true,data:{message:"Followed successfully"}}));
    } 
    catch (err) {
        logger.error(`[follow] Follow user failed with error`, err);
        res.status(err.statusCode || 500).send(genericResponse({success:false,errorMessage:err.message}));
    }




}





module.exports = {login,createUser,listUser,follow}