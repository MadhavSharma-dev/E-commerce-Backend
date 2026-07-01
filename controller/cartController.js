const Cart = require("../models/Cart");
const Product = require("../models/Product");
const { asyncHandler } = require("../utils/asyncHandler");
const { ApiError } = require("../utils/ApiError");
const { ApiResponse } = require("../utils/Apiresponse");

// Helper to recalculate totals
const recalculate = (cart) => {
    cart.totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
    cart.totalPrice = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
};

// GET /cart
exports.getCart = asyncHandler(async (req, res) => {
    const cart = await Cart.findOne({ userId: req.user._id }).populate("items.productId", "name images status");
    if (!cart) return res.json(new ApiResponse(200, { items: [], totalItems: 0, totalPrice: 0 }, "Cart is empty"));

    res.json(new ApiResponse(200, cart, "Cart fetched successfully"));
});

// POST /cart  — add item or increase quantity if already exists
exports.addToCart = asyncHandler(async (req, res) => {
    const { productId, quantity = 1 } = req.body;
    if (!productId) throw new ApiError(400, "ProductId is required");

    const product = await Product.findById(productId);
    if (!product) throw new ApiError(404, "Product not found");
    if (product.status === "Inactive" || product.status === "Out of stock")
        throw new ApiError(400, "Product is not available");
    if (product.stock < quantity) throw new ApiError(400, "Insufficient stock");

    // Use discountPrice if available, else price
    const itemPrice = product.discountPrice || product.price;

    let cart = await Cart.findOne({ userId: req.user._id });

    if (!cart) {
        cart = await Cart.create({
            userId: req.user._id,
            items: [{ productId, quantity, price: itemPrice }],
        });
    } else {
        const existingItem = cart.items.find((i) => i.productId.toString() === productId);

        if (existingItem) {
            const newQty = existingItem.quantity + quantity;
            if (product.stock < newQty) throw new ApiError(400, "Insufficient stock");
            existingItem.quantity = newQty;
        } else {
            cart.items.push({ productId, quantity, price: itemPrice });
        }
    }

    recalculate(cart);
    await cart.save();

    res.json(new ApiResponse(200, cart, "Item added to cart"));
});

// PATCH /cart/:productId  — update quantity of a specific item
exports.updateCartItem = asyncHandler(async (req, res) => {
    const { quantity } = req.body;
    if (!quantity || quantity < 1) throw new ApiError(400, "Quantity must be at least 1");

    const cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) throw new ApiError(404, "Cart not found");

    const item = cart.items.find((i) => i.productId.toString() === req.params.productId);
    if (!item) throw new ApiError(404, "Item not in cart");

    const product = await Product.findById(req.params.productId);
    if (product.stock < quantity) throw new ApiError(400, "Insufficient stock");

    item.quantity = quantity;
    recalculate(cart);
    await cart.save();

    res.json(new ApiResponse(200, cart, "Cart updated successfully"));
});

// DELETE /cart/:productId  — remove a single item
exports.removeFromCart = asyncHandler(async (req, res) => {
    const cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) throw new ApiError(404, "Cart not found");

    const itemIndex = cart.items.findIndex((i) => i.productId.toString() === req.params.productId);
    if (itemIndex === -1) throw new ApiError(404, "Item not in cart");

    cart.items.splice(itemIndex, 1);
    recalculate(cart);
    await cart.save();

    res.json(new ApiResponse(200, cart, "Item removed from cart"));
});

// DELETE /cart  — clear entire cart
exports.clearCart = asyncHandler(async (req, res) => {
    const cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) throw new ApiError(404, "Cart not found");

    cart.items = [];
    recalculate(cart);
    await cart.save();

    res.json(new ApiResponse(200, {}, "Cart cleared"));
});
