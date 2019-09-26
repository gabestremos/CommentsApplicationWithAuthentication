const express = require("express");
const deleteRouter = express.Router();
const authenticate = require("../authenticate");
const bodyParser = require("body-parser");
const Threads = require("../models/thread");
deleteRouter.use(bodyParser());

deleteRouter
  .route("/deleteThread/:_id")
  .get(authenticate.verifyUser, (req, res, next) => {
    Threads.find({ _id: req.params._id }).then(thread => {
      if (thread != "") {
        Threads.deleteOne({ _id: req.params._id }).then(thread => {
          return res.redirect("/listThreads");
        });
      } else {
        res.status = 404;
        err = new Error("Invalid Object Id!");
        return next(err);
      }
    });
  });
deleteRouter
  .route("/:threadId/deleteComment/:commentId")
  .get(authenticate.verifyUser, (req, res, next) => {
    Threads.findById(req.params.threadId).then(thread => {
      if (thread != "" && thread.comments.id(req.params.commentId) != "") {
        thread.comments.id(req.params.commentId).remove();
        thread.save().then(
          () => {
            Threads.findById(req.params.threadId)
              .populate("user")
              .then(thread => {
                res.status = 200;
                return res.redirect("/view/" + req.params.threadId);
              });
          },
          err => next(err)
        );
      } else {
        err = new Error("Invalid Object Id!");
        return next(err);
      }
    });
  });
module.exports = deleteRouter;
