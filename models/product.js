const mongoose = require("mongoose");
// const Category = require("./category");
const _ = require("lodash");

const productSchema = new mongoose.Schema({
  userId: { type: mongoose.Types.ObjectId, ref: "User", required: true }, //reset to true
  price: { type: Number, min: 10, max: 100000, required: true },
  discount: { type: Number },
  name: { type: String, required: true, minlength: 4, maxlength: 50 },
  description: { type: String, minlength: 20, maxlength: 500 },
  language: { type: String },
  imgUrl: { type: String },
  tags: [String],
  catId: { type: mongoose.Types.ObjectId, ref: "Category" } //reset to true
});

productSchema.set("toJSON", {
  virtuals: true,
  transform: doc => {
    return _.pick(doc, [
      "_id",
      "name",
      "description",
      "price",
      "discount",
      "language",
      "imgUrl",
      "tags",
      "category",
      "user"
    ]);
  }
});
productSchema.virtual("category", {
  ref: "Category",
  localField: "catId",
  foreignField: "_id"
});

productSchema.virtual("user", {
  ref: "User",
  localField: "userId",
  foreignField: "_id"
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
