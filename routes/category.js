const express = require("express");
const router = express.Router();

const Category = require("../models/category");

module.exports = router;

router.post("/add", async (req, res, next) => {
  const { name } = req.body;
  const category = new Category({ name });
  await category.save();
  res.json({ message: "Category Added", newCategory: category });
});

router.patch("/:id", async (req, res, next) => {
  const { id } = req.params;
  const { name } = req.body;
  const cat = await Category.findByIdAndUpdate(id, { name }, { new: true });
  res.json({ message: "Cat Edited Successfully", CatAfterEdit: cat });
});

router.delete("/:id", async (req, res, next) => {
  const { id } = req.params;
  const cat = await Category.findByIdAndRemove(id);
  const CatAfterDel = await Category.find();
  res.json({ message: "Cat deleted Successfully", CatAfterDel: CatAfterDel });
});

router.get("/", async (req, res, next) => {
  const cats = await Category.find().populate("products");
  res.json(cats);
});
