const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    name: { 
        type : String,
        required : [true , "Name is required"],
        minlength : 5
    },
    email : { 
        type : String,
        required : [true, "Email is required"],
        lowercase : true,
        unique : true
    },
    password : {
        type  : String,
        required : [true, "Password is required"],
        minlength : 5
    },
    phone : {
        type : String,
        //Optional means you dont have to add required : true 
    },
    role : {
        type : String,
        enum : ["Admin" , "Seller" , "Customer"],
    },
    isActive : {
        type : Boolean,
        default : true
    },
    isEmailVerified : {
        type : Boolean,
        default : false
    },
    emailVerificationToken : {
        type : String
    },
    emailVerificationExpiry: {
        type: Date
    },
    passwordResetToken : {
        type : String
    },
    passwordResetExpiry : {
        type : Date
    },
    refreshToken : {
        type : String
    },
},
{timestamps : true});
module.exports = mongoose.model("User",userSchema);