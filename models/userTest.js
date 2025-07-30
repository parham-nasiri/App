const mongoose = require('mongoose');

const userTestSchema = new mongoose.Schema({
title:{
    type :String,
    required :true,
    trim:true
},
userId:{
    type: mongoose.Schema.Types.ObjectId,
    required:true,
    ref:'user'
    },
answer:{
    type:Number,
    required:true
    },
answersTitle:{
    type : [String],
    required : true,
    default : ["","","",""]
},
},
{
    timestamps:true
})
userTestSchema.methods.toJSON= function(){
        const userTest = this
        const userTestObject = userTest.toObject()
        return userTestObject;
}
const userTest = mongoose.model('userTest',userTestSchema);

module.exports = userTest;