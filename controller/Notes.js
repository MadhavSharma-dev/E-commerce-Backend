const Model = require("../models/Model");
const { asyncHandler } = require("../utils/asyncHandler");
const { ApiError } = require("../utils/ApiError");
const { ApiResponse } = require("../utils/Apiresponse");

// CREATE
exports.createItem = asyncHandler(async (req, res) => {
    const { field1, field2 } = req.body;

    // 1. Validate required fields
    if (!field1 || !field2) throw new ApiError(400, "field1 and field2 are required");

    // 2. Check duplicate if unique fields exist
    // const exists = await Model.findOne({ field1 });
    // if (exists) throw new ApiError(400, "Already exists");

    // 3. Create
    const item = await Model.create({ field1, field2 });

    res.status(201).json(new ApiResponse(201, item, "Created successfully"));
});

// GET ALL
exports.getAllItems = asyncHandler(async (req, res) => {
    const items = await Model.find();
    res.json(new ApiResponse(200, items, "Fetched successfully"));
});

// GET BY ID
exports.getItemById = asyncHandler(async (req, res) => {
    const item = await Model.findById(req.params.id);
    if (!item) throw new ApiError(404, "Not found");

    res.json(new ApiResponse(200, item, "Fetched successfully"));
});

// UPDATE
exports.updateItem = asyncHandler(async (req, res) => {
    const item = await Model.findById(req.params.id);
    if (!item) throw new ApiError(404, "Not found");

    const { field1, field2 } = req.body;

    if (field1) item.field1 = field1;
    if (field2) item.field2 = field2;

    await item.save();

    res.json(new ApiResponse(200, item, "Updated successfully"));
});

// DELETE
exports.deleteItem = asyncHandler(async (req, res) => {
    const item = await Model.findById(req.params.id);
    if (!item) throw new ApiError(404, "Not found");

    await item.deleteOne();

    res.json(new ApiResponse(200, {}, "Deleted successfully"));
});

//Replace Model with your actual model — Product, Order, etc.
//Replace field1, field2 with your actual schema fields
//Uncomment duplicate check if your model has unique fields
//Whatever fields are required: true in the schema → those go in validation check. Everything else → optional, update only if provided.

//The rule is:

// required: true in model → validate in controller
// default value in model → skip, DB handles it
// ref: "OtherModel" → either comes from req.body or req.user._id
// enum fields → optionally validate the value is one of the allowed options