const express = require("express");
const Threads = require("../models/thread");
const authenticate = require("../authenticate");
const multer = require("multer");
const createRouter = express.Router();
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});
const imageFileFilter = (req, file, cb) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return cb(new Error("You can only upload image files!"), false);
  }
  cb(null, true);
};
const upload = multer({ storage: storage, fileFilter: imageFileFilter }).single(
  "imgDir"
);

createRouter
  .route("/create")
  .get(
    authenticate.verifyUser,
    (req, res, next) => {
      return res.render("create", { username: req.user.username });
    },
    err => {
      return err;
    }
  )
  .post(authenticate.verifyUser, (req, res, next) => {
    upload(req, res, function(err) {
      if (err instanceof multer.MulterError) {
        // A Multer error occurred when uploading.
      } else if (err) {
        res.status = 500;
        return new Error("There was a problem uploading your image");
      }
      req.body.author = req.user.username;
      if (req.file) {
        req.body.imgDir = req.file.originalname;
      }
      Threads.create(req.body)
        .populate("user")
        .then(
          () => {
            res.status = 200;
            return res.redirect("/listThreads");
          },
          err => {
            next(err);
          }
        )
        .catch(err => {
          return err;
        });
    });
  });

createRouter
  .route("/comment/:_id")
  .post(authenticate.verifyUser, (req, res, next) => {
    Threads.findById(req.params._id)
      .then(
        thread => {
          if (thread != null) {
            req.body.author = req.user.username;
            thread.comments.push(req.body);
            thread.save().then(
              thread => {
                Threads.findById(thread._id)
                  .populate("user")
                  .then(thread => {
                    res.statusCode = 200;
                    return res.redirect("/view/" + thread._id);
                  });
              },
              err => next(err)
            );
          } else {
            err = new Error("Invalid thread!");
            err.status = 404;
            return next(err);
          }
        },
        err => next(err)
      )
      .catch(err => next(err));
  });
module.exports = createRouter;
