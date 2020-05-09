const express = require("express");
const router = express.Router();
const _ = require("lodash");

const Product = require("../models/product");
const Authentication = require("../middlewares/authentication");
const ProductOwner = require("../middlewares/authorization");

module.exports = router;

router.post("/add", Authentication, async (req, res, next) => {
  const {
    userId,
    name,
    price,
    discount,
    description,
    language,
    imgUrl,
    catId
  } = req.body;
  const newPrd = new Product({
    userId,
    name,
    price,
    discount,
    description,
    language,
    imgUrl,
    catId
  });

  await newPrd.save();
  res.json({ message: "Product Added Successfuly", productAdded: newPrd });
});

router.patch("/:id", async (req, res, next) => {
  const id = req.params.id;
  const {
    userId,
    name,
    price,
    discount,
    description,
    language,
    imgUrl,
    tags,
    catId
  } = req.body;
  const product = await Product.findByIdAndUpdate(
    id,
    {
      userId,
      name,
      price,
      discount,
      description,
      language,
      tags,
      imgUrl,
      catId
    },
    {
      omitUndefined: true,
      new: true
    }
  ).populate("category");
  res.json({ message: "Product Edited Successfuly", productEdited: product });
});

router.delete("/:id", async (req, res, next) => {
  const id = req.params.id;
  const prdRemoved = await Product.findByIdAndRemove(id);
  const productsAfterDel = await Product.find();
  res.json({
    message: "Product Removed Successfuly",
    productsAfterDelete: productsAfterDel
  });
});

router.get("/", async (req, res, next) => {
  const products = await Product.find()
    .populate("user", "username")
    .populate("category");
  res.json(products);
});

router.get("/SSFP", async (req, res, next) => {
  let { search, cat, sort, page = true, currPage = 1, items = 5 } = req.query;
  let products = [];
  if (!cat || cat == "5ea37c2c719364050ad3813c") {
    if (!search) {
      products = await Product.find().populate("category");
    } else {
      products = await Product.find({
        name: { $regex: new RegExp(".*" + search + ".*"), $options: "i" }
      }).populate("category");
    }
  } else {
    if (!search) {
      products = await Product.find({ catId: cat }).populate("category");
    } else {
      products = await Product.find({
        $and: [
          { catId: cat },
          {
            name: { $regex: new RegExp(".*" + search + ".*"), $options: "i" }
          }
        ]
      }).populate("category");
    }
  }
  if (sort) {
    switch (sort) {
      case "name":
        products = _.orderBy(products, ["name"]);
        break;
      case "priceUp":
      case "price":
        products = _.orderBy(products, ["price"], ["asc"]);
        break;
      case "priceDown":
        products = _.orderBy(products, ["price"], ["desc"]);
        break;
      case "default":
        break;
    }
  }
  const count = products.length;
  if (products.length > items) {
    if (page) {
      const startIndex = (currPage - 1) * items;
      products = _(products)
        .slice(startIndex)
        .take(items)
        .value();
    }
  }
  res.json({ products, count });
});
