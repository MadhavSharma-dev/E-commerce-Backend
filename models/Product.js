const mongoose = require("mongoose");
const productSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    description : {
        type : String,
        required : true
    },
    price : {
        type : Number,
        required : true
    },
    discountPrice : {
        type : Number
    },
    stock : {
        type : Number,
        default : 0
    },
    categoryId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Category"
    },
    sellerId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    },
    ratings : {
        type : Number,
        default : 0
    },
    totalReviews : {
        type : Number,
        default : 0
    },
    isFeatured : {
        type : Boolean,
        default : false
    },
    status : {
        type : String,
        enum : ["Active" , "Inactive" , "Out of stock"],
        default : "Active"
    },
    images: [
  {
    type: String
  }
]

},{timestamps : true}
);
module.exports = mongoose.model("Product" , productSchema);