const express = require("express"),
  router = express.Router(),
  passport = require("passport"),
  LocalStrategy = require("passport-local"),
  bodyParser = require("body-parser"),
  methodOverride = require("method-override"),
  mongoose = require("mongoose"),
  expressSanitizer = require("express-sanitizer"),
  User = require("../models/user"),
  artEntry = require("../models/artentries");

// ===================
// Authenticate routes
// ===================

// show register form
router.get("/register", function (req, res) {
  res.render("register");
});

router.get("/registerAdmin", function (req, res) {
  res.render("registerAdmin");
});

//handle sign up logic

//Show register form
router.post("/register", function (req, res) {
  req.body.password = req.sanitize(req.body.password);
  var newUser = new User({
    username: req.body.username,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    avatar: req.body.avatar,
  });
  User.register(newUser, req.body.password, function (err, user) {
    if (err) {
      console.log(err);
      req.flash("error", err);
      return res.render("register");
    }
    passport.authenticate("local")(req, res, function () {
      res.redirect("/index");
      req.flash("success", "Welcome " + user.username);
    });
  });
});

// admin register POST
router.post("/registerAdmin", function (req, res) {
  var newUser = new User({
    username: req.body.username,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    avatar: req.body.avatar,
    isAdmin: req.body.isAdmin,
    assignedCategories: req.body.assignedCategories,
  });
  if (req.body.adminCode === "12cranialnerves") {
    newUser.isAdmin = true;
  }
  User.register(newUser, req.body.password, function (err, user) {
    if (err) {
      console.log(err);
      return res.render("registerAdmin");
    }
    passport.authenticate("local")(req, res, function () {
      res.redirect("/index");
    });
  });
});

//======
//LOGIN
//======
router.get("/login", function (req, res) {
  res.render("login");
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/index",
    failureFlash: "Login failed",
    failureRedirect: "/login",
  }),
  function (req, res) {}
);

router.get("/", function (req, res) {
  res.redirect("/artentries");
});

//Logout ROUTE

router.get("/logout", function (req, res) {
  req.logout();
  req.flash("success", "Successfully logged out");
  res.redirect("/login");
});

module.exports = router;
