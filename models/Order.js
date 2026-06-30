const mongoose = require("mongoose");
const orderSchema = new mongoose.Schema({
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true
    },
    items : [
            {
                productId : {
                    type : mongoose.Schema.Types.ObjectId,
                    ref : "Product",
                    required : true
                },
                quantity : {
                    type : Number,
                    required : true,
                    default : 1,
                    min : 1
                },
                price : {
                    type : Number,
                    required : true
                }
            }
        ],
    totalAmount : {
        type : Number,
        required : true
    },
    status : {
        type : String,
        enum : ["Pending" , "Processing" ,"Shipped" , "Delivered" , "Cancelled"],
        default : "Pending"
    },
    paymentStatus : {
        type : String,
        enum : ["Pending" , "Paid" , "Failed" , "Refunded"],
        default : "Pending"
    },
    paymentMethod : {
        type : String,
        enum : ["COD" , "Online"]
    },
    deliveryAddress : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Address"
    },
    deliveredAt : {
        type : Date
    },
},{timestamps : true});
module.exports = mongoose.model("Order" , orderSchema);