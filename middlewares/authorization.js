// const Post = require("../models/post");
const Product = require("../models/product");
const customError = require("../helpers/customError");

module.exports = async (req, res, next) => {
  const {
    params: { id: productId },
    user: { id: userId }
  } = req;
  const product = await Product.findById(productId);
  if (product.userId.toHexString() !== userId) {
    //or (!post.userId.equals(userId))
    throw customError(403, "Not Allowed");
  }
  next();
};
