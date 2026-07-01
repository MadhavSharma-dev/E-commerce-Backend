const Product =require("../models/Product");
const {asyncHandler} = require("../utils/asyncHandler");
const {ApiError} = require("../utils/ApiError");
const {ApiResponse} = require("../utils/Apiresponse");

exports.createProduct = asyncHandler(async(req,res)=>{
    const {name, description , price} = req.body;

    if(!name || !description || !price) throw new ApiError(400 , "Name , Description , Price are required");

    const product = await Product.create({name,description,price});
    res.status(201).json(new ApiResponse(201, product , "Created Successfully"));
});

//Get All 
exports.getAllProducts = asyncHandler(async(req,res) => {
    const product = await Product.find();
    res.json(new ApiResponse(200,product,"Fetched Successfully"));
});

//Get By id 
exports.getProductById = asyncHandler(async(req,res) => {
    const product = await Product.findById(req.params.id);
    if(!product) throw new ApiError(404, "Not found");

    res.json(new ApiResponse(200,product,"Fetched successfully"));
});

//Update 

exports.updateProduct = asyncHandler(async(req,res) => {
    const product = await Product.findById(req.params.id);
    if(!product) throw new ApiError(404, "Not found");

    const {name , description , price} = req.body;
    if(name) product.name = name;
    if(description) product.description = description;
    if(price) product.price = price;

    await product.save();
    res.json(new ApiResponse(200 , product , "Updated Successfully"));
});


//Delete 
exports.deleteProduct = asyncHandler(async(req,res)=>{
    const product = await Product.findById(req.params.id);
    if(!product) throw new ApiError(404, "Not found");

    await product.deleteOne();

    res.json(new ApiResponse(200 , {}  , "Deleted Successfully"));
});