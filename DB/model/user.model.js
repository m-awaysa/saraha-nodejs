const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    userName:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    age:Number,
    gender:{
        type:String,
        enum:['Male','Female'],
        default:'Male',
    },
    confirmEmail:{
        type:Boolean,
        default:false,
    },
    profilePic:String,
    sendCode:{
        type:String,
        default:null
    }

},{timestamps:true});

const userModel = mongoose.model('user',userSchema);
module.exports = {userModel};