const mongoose = require("mongoose");
const _ = require("lodash");

const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 2, maxlength: 50 }
});

CategorySchema.set("toJSON", {
  virtuals: true,
  transform: doc => {
    return _.pick(doc, ["id", "name"]);
  }
});

CategorySchema.virtual("products", {
  ref: "Product",
  localField: "_id",
  foreignField: "catId"
});

const Category = mongoose.model("Category", CategorySchema);

module.exports = Category;
