const User = require("../models/user");
const customError = require("../helpers/customError");

module.exports = async (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) throw customError(401, "No Authoriazation Here");
  const currentUser = await User.getUserFromToken(token);
  req.user = currentUser;
  req.body.userId = currentUser.id;
  next();
};
