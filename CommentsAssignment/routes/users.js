const express = require("express");
const bodyParser = require("body-parser");
const User = require("../models/user");
const passport = require("passport");
const userRouter = express.Router();
const authenticate = require("../authenticate");

userRouter
  .route("/login")
  .get((req, res, next) => {
    res.render("login", { err: "" });
  })
  .post((req, res, next) => {
    passport.authenticate("local", (err, user) => {
      if (err) {
        console.log("error");
        return res.render("login", { err: "Incorrect username or password!" });
      }
      if (!user) {
        return res.render("login", { err: "Incorrect username or password!" });
        // return res.redirect("/login");
      }
      if (user) {
        const token = authenticate.getToken({ _id: user._id });
        res.cookie("token", token);
        res.status = 200;
        return res.redirect("/listThreads");
      }
    })(req, res, next);
  });
userRouter
  .route("/signup")
  .get(
    (req, res, next) => {
      res.render("signup");
    },
    err => {
      next(err);
    }
  )
  .post((req, res, next) => {
    User.register(
      new User({ username: req.body.username }),
      req.body.password,
      (err, user) => {
        if (err) {
          res.status = 500;
          err = new Error("There was an error creating your account");
          return next(err);
        } else {
          passport.authenticate("local")(req, res, () => {
            res.status = 200;
            return res.redirect("/login");
          });
        }
      }
    );
  });
userRouter
  .route("/changePassword")
  .get(authenticate.verifyUser, (req, res, next) => {
    res.render("changePassword", { user: req.user, err: "" });
  });
userRouter.route("/changePassword/:userId").post((req, res, next) => {
  User.findById(req.params.userId).then(user => {
    user.changePassword(
      req.body.oldpassword,
      req.body.newpassword,
      (err, user) => {
        if (err) {
          err = new Error("Incorrect password!");
          return next(err);
          // return res.render("changepassword", {
          //   user,
          //   err: "Incorrect password!"
          // });
        } else {
          console.log("Password changed successfully!");
          res.clearCookie("token");
          return res.redirect("/login");
        }
      }
    );
  });
});
userRouter.get("/logout", (req, res, next) => {
  res.clearCookie("token");
  return res.redirect("/login");
});
module.exports = userRouter;
