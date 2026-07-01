const Category = require("../models/Category");
const { asyncHandler } = require("../utils/asyncHandler");
const { ApiError } = require("../utils/ApiError");
const { ApiResponse } = require("../utils/Apiresponse");

// Create Category — Admin only
exports.createCategory = asyncHandler(async (req, res) => {
    const { name, slug, image, parentCategory } = req.body;

    if (!name || !slug) throw new ApiError(400, "Name and slug are required");

    const exists = await Category.findOne({ $or: [{ name }, { slug }] });
    if (exists) throw new ApiError(400, "Category with this name or slug already exists");

    const category = await Category.create({ name, slug, image, parentCategory });

    res.status(201).json(new ApiResponse(201, category, "Category created"));
});

// Get All Categories — Public
exports.getAllCategories = asyncHandler(async (req, res) => {
    const categories = await Category.find().populate("parentCategory", "name slug");
    res.json(new ApiResponse(200, categories, "Categories fetched"));
});

// Get Category By ID — Public
exports.getCategoryById = asyncHandler(async (req, res) => {
    const category = await Category.findById(req.params.id).populate("parentCategory", "name slug");
    if (!category) throw new ApiError(404, "Category not found");

    res.json(new ApiResponse(200, category, "Category fetched"));
});

// Update Category — Admin only
exports.updateCategory = asyncHandler(async (req, res) => {
    const category = await Category.findById(req.params.id);
    if (!category) throw new ApiError(404, "Category not found");

    const { name, slug, image, parentCategory } = req.body;

    if (name) category.name = name;
    if (slug) category.slug = slug;
    if (image) category.image = image;
    if (parentCategory) category.parentCategory = parentCategory;

    await category.save();

    res.json(new ApiResponse(200, category, "Category updated"));
});

// Delete Category — Admin only
exports.deleteCategory = asyncHandler(async (req, res) => {
    const category = await Category.findById(req.params.id);
    if (!category) throw new ApiError(404, "Category not found");

    await category.deleteOne();

    res.json(new ApiResponse(200, {}, "Category deleted"));
});
