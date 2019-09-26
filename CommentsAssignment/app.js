var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var userRouter = require("./routes/users");
const deleteRouter = require("./routes/delete");
const editRouter = require("./routes/edit");
const threadRouter = require("./routes/thread");
const createRouter = require("./routes/create");
const passport = require("passport");
const authenticate = require("./authenticate");
const config = require("./config");
const mongoose = require("mongoose");
const url = config.mongoUrl;
const connect = mongoose.connect(url);
connect.then(
  db => {
    console.log("Connected correctly to server!");
  },
  err => {
    console.log(err);
  }
);
var app = express();

// view engine setup
app.set("views", path.resolve(__dirname, "views"));
app.set("view engine", "ejs");
app.use(cookieParser());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(passport.initialize());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", userRouter);
app.use("/", threadRouter);
app.use("/", createRouter);
app.use("/", editRouter);
app.use("/", deleteRouter);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error.jade");
});

module.exports = app;
