const express = require("express");
const { check } = require("express-validator");
const customError = require("../helpers/customError");
const router = express.Router();

const User = require("../models/user");
const validationMiddleWare = require("../middlewares/validation");

module.exports = router;

router.post(
  "/register",
  validationMiddleWare(
    check("password")
      .isLength({ min: 5 })
      .withMessage("must be at least 5 chars long")
      .matches(/\d/)
      .withMessage("must contain a number"),
    check("username")
      .isLength({ min: 5 })
      .withMessage("must be at least 5 chars long")
  ),

  async (req, res, next) => {
    const { username, password, firstName, age } = req.body;
    const user = new User({
      username,
      password,
      firstName,
      age
    });
    await user.save();
    res.status(200).json(user);
  }
);

router.post("/login", async (req, res, next) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) throw customError(422, "wrong username or password");
  const isMatch = await user.comparePassword(password);
  if (!isMatch) customError(422, "wrong username or password");

  const token = await user.generateToken();
  res.status(200).json({ user, token });
});

router.get("/", async (req, res, next) => {
  const users = await User.find().populate("prds");
  res.json({ users });
});

router.delete("/:id", async (req, res, next) => {
  const id = req.params.id;
  const user = await User.findByIdAndRemove(id);
  const usersAfterDel = await User.find();
  await res.json({ usersAfterDelete: usersAfterDel });
});

router.patch("/:id", async (req, res, next) => {
  const id = req.params.id;
  const { username, password, firstName } = req.body;
  const userEdited = await User.findByIdAndUpdate(
    id,
    { username, password, firstName },
    { omitUndefined: true, new: true }
  ).populate("prds");
  res.json({
    msg: " user was edited successfully ",
    userAfterEdit: userEdited
  });
});
