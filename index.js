const express = require("express");
require("express-async-errors");
require("./db");
const userRouter = require("./routes/user");
const productRouter = require("./routes/product");
const categoryRouter = require("./routes/category");
const cors = require("cors");

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded());
app.use(cors());

app.use("/user", userRouter); // this line connects to user router (note: this path in userrouter file will complete this '/user' path)
app.use("/product", productRouter);
app.use("/category", categoryRouter);

app.use((err, req, res, next) => {
  console.error(err);

  const statusCode = err.statusCode || 500;
  if (statusCode >= 500) {
    res.status(statusCode).json({
      message: "Internal_Server_Error",
      type: err.type,
      details: err.details
    });
  } else {
    res.status(statusCode).json({
      message: err.message,
      type: err.type,
      details: err.details
    });
  }
});

app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
);
