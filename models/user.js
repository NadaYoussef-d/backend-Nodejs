var mongoose = require("mongoose");
require("dotenv").config();
const _ = require("lodash");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const util = require("util");

const saltRounds = 10;
const secret = process.env.JTW_SECRET;

var userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    firstName: { type: String, minlength: 3, maxlength: 15 },
    age: { type: Number, required: false, min: 13 }
  },
  { autoIndex: true, timestamps: true }
);
// debugger;
userSchema.set("toJSON", {
  virtuals: true,
  transform: doc => {
    return _.pick(doc, ["id", "username", "firstName", "prds"]);
  }
});
userSchema.virtual("prds", {
  ref: "Product",
  localField: "_id",
  foreignField: "userId"
});

userSchema.pre("save", async function() {
  const userInstance = this;
  if (this.isModified("password")) {
    userInstance.password = await bcrypt.hash(
      userInstance.password,
      saltRounds
    );
  }
});

const sign = util.promisify(jwt.sign); // jwt take callback as param and util make it to take promise instesd
const verify = util.promisify(jwt.verify); // we need promise to use async & await

userSchema.methods.generateToken = async function(expiresIn = "1w") {
  const userInstance = this;
  return await sign({ userId: userInstance.id }, secret, {
    expiresIn: expiresIn
  });
};

userSchema.methods.comparePassword = function(plaintextPassword) {
  //debugger;
  const userInstance = this;
  return bcrypt.compare(plaintextPassword, userInstance.password);
};

userSchema.statics.getUserFromToken = async function(token) {
  const User = this;
  const payload = await verify(token, secret);
  const currentUser = await User.findById(payload.userId);
  if (!currentUser) throw new Error("User Not Found");
  return currentUser;
};

var User = mongoose.model("User", userSchema);

module.exports = User;
