const express = require("express");
const bodyParser = require("body-parser");
const threadRouter = express.Router();
const Threads = require("../models/thread");
const authenticate = require("../authenticate");
const multer = require("multer");

threadRouter.use(bodyParser());
threadRouter
  .route("/listThreads")
  .get(authenticate.verifyUser, (req, res, next) => {
    Threads.find({})
      .then(
        threads => {
          return res.render("list", {
            username: req.user.username,
            threads: threads
          });
        },
        err => {
          return err;
        }
      )
      .catch(err => {
        return err;
      });
  });

threadRouter
  .route("/view/:_id")
  .get(authenticate.verifyUser, (req, res, next) => {
    Threads.find({ _id: req.params._id }).then(thread => {
      if (thread != "") {
        return res.render("view", {
          username: req.user.username,
          threads: thread
        });
      } else {
        res.status = 500;
        err = new Error("Invalid Object Id!");
        return next(err);
      }
    });
  });

module.exports = threadRouter;
