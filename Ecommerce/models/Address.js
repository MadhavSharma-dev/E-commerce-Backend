const mongoose = require("mongoose");
const addressSchema= new mongoose.Schema({
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true
    },
    phone : {
        type : String,
        required : true
    },
    street: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    zipCode: {
        type: String,
        required: true
    },
    country : {
        type : String,
        required : true,
        default : "India"
    },
    addressType : {
        type : String,
        enum : ["Home" , "Work" , "Other"]
    },
    isDefault : {
        type : Boolean,
        default : false
    },
},{timestamps : true}
);
module.exports = mongoose.model("Address" , addressSchema);