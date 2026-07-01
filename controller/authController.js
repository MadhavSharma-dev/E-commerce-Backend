const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const generateToken = require("../utils/generateToken");
const { asyncHandler } = require("../utils/asyncHandler");
const { ApiError } = require("../utils/ApiError");
const { ApiResponse } = require("../utils/Apiresponse");

// ─── Register ───────────────────────────────────────────────
exports.registerUser = asyncHandler(async (req, res) => {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
        throw new ApiError(400, "Name, email and password are required");
    }

    const userExists = await User.findOne({ email });
    if (userExists) throw new ApiError(400, "User already exists");

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
        name,
        email,
        password: hashPassword,
        role: role || "Customer"
    });

    res.status(201).json(
        new ApiResponse(201, {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id, user.role)
        }, "User registered successfully")
    );
});

// ─── Login ───────────────────────────────────────────────────
exports.loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new ApiError(400, "Email and password are required");
    }

    const user = await User.findOne({ email });
    if (!user) throw new ApiError(401, "Invalid email or password");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new ApiError(401, "Invalid email or password");

    if (!user.isActive) throw new ApiError(403, "Account is deactivated");

    // Generate tokens
    const accessToken = generateToken(user._id, user.role);
    const refreshToken = jwt.sign(
        { id: user._id },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: "7d" }
    );

    // Save refresh token in DB
    user.refreshToken = refreshToken;
    await user.save();

    res
        .cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        })
        .json(
            new ApiResponse(200, {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: accessToken
            }, "Login successful")
        );
});

// ─── Logout ──────────────────────────────────────────────────
exports.logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(req.user._id, { refreshToken: "" });

    res
        .clearCookie("refreshToken")
        .json(new ApiResponse(200, {}, "Logged out successfully"));
});

// ─── Refresh Token ───────────────────────────────────────────
exports.refreshAccessToken = asyncHandler(async (req, res) => {
    const token = req.cookies?.refreshToken;
    if (!token) throw new ApiError(401, "No refresh token");

    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id);

    if (!user || user.refreshToken !== token) {
        throw new ApiError(401, "Invalid or expired refresh token");
    }

    const newAccessToken = generateToken(user._id, user.role);

    res.json(new ApiResponse(200, { token: newAccessToken }, "Token refreshed"));
});

// ─── Get Profile ─────────────────────────────────────────────
exports.getProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id).select("-password -refreshToken");
    res.json(new ApiResponse(200, user, "Profile fetched"));
});