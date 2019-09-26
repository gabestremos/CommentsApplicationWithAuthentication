const express = require("express");
const Threads = require("../models/thread");
const editRoute = express.Router();
const authenticate = require("../authenticate");
const bodyParser = require("body-parser");

editRoute.use(bodyParser());
editRoute
  .route("/edit/:_id")
  .get(authenticate.verifyUser, (req, res, next) => {
    Threads.find({ _id: req.params._id }).then(thread => {
      if (thread != "") {
        return res.render("edit", {
          username: req.user.username,
          threads: thread
        });
      } else {
        res.status = 404;
        err = new Error("Invalid Object Id!");
        return next(err);
      }
    });
  })
  .post(authenticate.verifyUser, (req, res, next) => {
    Threads.update(
      { _id: req.params._id },
      { $set: req.body },
      { new: true }
    ).then(thread => {
      return res.redirect("/listThreads");
    });
  });
editRoute
  .route("/:threadId/editComment/:commentId")
  .get(authenticate.verifyUser, (req, res, next) => {
    Threads.findById(req.params.threadId).then(thread => {
      // console.log(thread);
      if (thread != "" && thread.comments.id(req.params.commentId) != "") {
        return res.render("editComment", {
          thread,
          commentId: thread.comments.id(req.params.commentId)._id,
          comment: thread.comments.id(req.params.commentId).comment,
          username: req.user.username
        });
      } else {
        res.status = 404;
        return new Error("Invalid Object Id!");
      }
    });
  })
  .post(authenticate.verifyUser, (req, res, next) => {
    Threads.findById(req.params.threadId)
      .then(
        thread => {
          if (
            thread != null &&
            thread.comments.id(req.params.commentId) != null
          ) {
            if (req.body.comment) {
              thread.comments.id(req.params.commentId).comment =
                req.body.comment;
            }
            console.log("saved!");
            thread.save().then(() => {
              return res.redirect("/view/" + req.params.threadId);
            });
          } else {
            err = new Error("Invalid Object Id!");
            err.status(404);
            return next(err);
          }
        },
        err => {
          next(err);
        }
      )
      .catch(err => {
        next(err);
      });
  });

module.exports = editRoute;
