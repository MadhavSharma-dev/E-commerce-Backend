const Address = require("../models/Address");
const { asyncHandler } = require("../utils/asyncHandler");
const { ApiError } = require("../utils/ApiError");
const { ApiResponse } = require("../utils/Apiresponse");

exports.createAddress = asyncHandler(async (req, res) => {
    const { phone, street, city, state, zipCode, country, addressType, isDefault } = req.body;

    if (!phone || !street || !city || !state || !zipCode || !country)
        throw new ApiError(400, "Phone, Street, City, State, Zipcode, Country are required");

    // If this address is being set as default, unset all others first
    if (isDefault) {
        await Address.updateMany({ userId: req.user._id }, { isDefault: false });
    }

    const address = await Address.create({
        userId: req.user._id,
        phone,
        street,
        city,
        state,
        zipCode,
        country,
        addressType,
        isDefault: isDefault || false,
    });

    res.status(201).json(new ApiResponse(201, address, "Created successfully"));
});

exports.getAllAddresses = asyncHandler(async (req, res) => {
    const addresses = await Address.find({ userId: req.user._id });
    res.json(new ApiResponse(200, addresses, "Fetched successfully"));
});

exports.getAddressById = asyncHandler(async (req, res) => {
    const address = await Address.findById(req.params.id);
    if (!address) throw new ApiError(404, "Not found");

    // Ensure address belongs to the logged-in user
    if (address.userId.toString() !== req.user._id.toString())
        throw new ApiError(403, "Not authorized");

    res.json(new ApiResponse(200, address, "Fetched successfully"));
});

exports.updateAddress = asyncHandler(async (req, res) => {
    const address = await Address.findById(req.params.id);
    if (!address) throw new ApiError(404, "Not found");

    // Ensure address belongs to the logged-in user
    if (address.userId.toString() !== req.user._id.toString())
        throw new ApiError(403, "Not authorized");

    const { phone, street, city, state, zipCode, country, addressType, isDefault } = req.body;

    if (phone) address.phone = phone;
    if (street) address.street = street;
    if (city) address.city = city;
    if (state) address.state = state;
    if (zipCode) address.zipCode = zipCode;
    if (country) address.country = country;
    if (addressType) address.addressType = addressType;

    // If setting as default, unset all others first
    if (isDefault) {
        await Address.updateMany({ userId: address.userId }, { isDefault: false });
        address.isDefault = true;
    }

    await address.save();

    res.json(new ApiResponse(200, address, "Updated successfully"));
});

exports.deleteAddress = asyncHandler(async (req, res) => {
    const address = await Address.findById(req.params.id);
    if (!address) throw new ApiError(404, "Not found");

    // Ensure address belongs to the logged-in user
    if (address.userId.toString() !== req.user._id.toString())
        throw new ApiError(403, "Not authorized");

    await address.deleteOne();

    res.json(new ApiResponse(200, {}, "Deleted successfully"));
});
