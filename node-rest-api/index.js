const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const multer = require('multer');
const fileUpload = require('express-fileupload');

mongoose
  .connect("mongodb://127.0.0.1:27017/userCrudApp")
  .then((x) => {
    console.log(
      `Connected to Mongo! Database name: "${x.connections[0].name}"`
    );
  })
  .catch((err) => {
    console.error("Error connecting to mongo", err.reason);
  });

const userRoute = require("./routes/user.routes");

const app = express();
app.use(fileUpload());

app.use(express.urlencoded());

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(cors());

// Static directory path
app.use(express.static("uploads"));

// API root
app.use("/api", userRoute);

// PORT
const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log("Listening on port " + port);
});

// 404 Handler
app.use((req, res, next) => {
  next(createError(404));
});

// Base Route
app.get("/", (req, res) => {
  res.send("invaild endpoint");
});

app.get("*", (req, res) => {
  res.sendFile(
    path.join(__dirname, "dist/angular-mean-crud-tutorial/index.html")
  );
});

// error handler
app.use(function (err, req, res, next) {
  console.error(err.message);
  if (!err.statusCode) err.statusCode = 500;
  res.status(err.statusCode).send(err.message);
});
