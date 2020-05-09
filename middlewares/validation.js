const { validationResult } = require("express-validator");
const customError = require("../helpers/customError");

module.exports = (...validationChecks) => async (req, res, next) => {
  try {
    await Promise.all(
      validationChecks.map(validationCheck => validationCheck.run(req))
    );
    const { errors } = validationResult(req);
    if (!errors.length) {
      return next();
    }
    throw customError(422, "validation error!", errors);
  } catch (err) {
    next(err);
  }
};
