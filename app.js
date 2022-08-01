const express = require("express");
const cors = require("cors");
const errorhandler = require("errorhandler");
const mongoose = require("mongoose");

const isProduction = process.env.NODE_ENV === "production";

// Create global app object
const app = express();

app.use(
  cors({
    origin: "*",
  })
);

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(__dirname + "/public"));

if (!isProduction) {
  app.use(errorhandler());
}

if (isProduction) {
  mongoose.connect(process.env.MONGODB_URI);
} else {
  mongoose.connect("mongodb://127.0.0.1:27017/hire_it");
  mongoose.set("debug", true);
}

/// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error("Not Found");
  err.status = 404;
  next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (!isProduction) {
  app.use(function (err, req, res, next) {
    console.log(err.stack);

    res.status(err.status || 500);

    res.json({
      errors: {
        message: err.message,
        error: err,
      },
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    errors: {
      message: err.message,
      error: {},
    },
  });
});

// finally, let's start our server...
const server = app.listen(process.env.PORT || 5000, function () {
  console.log("Listening on port " + server.address().port);
});
