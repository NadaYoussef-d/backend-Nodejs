var mongoose = require("mongoose");
require("dotenv").config();

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("connected to mongo db successfully");
  })
  .catch(err => {
    console.error(err);
  });
