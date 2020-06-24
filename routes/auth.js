const express = require("express"),
  router = express.Router(),
  passport = require("passport"),
  LocalStrategy = require("passport-local"),
  bodyParser = require("body-parser"),
  methodOverride = require("method-override"),
  mongoose = require("mongoose"),
  expressSanitizer = require("express-sanitizer"),
  User = require("../models/user"),
  ArtEntry = require("../models/artEntry");

const { isLoggedIn } = require("../middleware");
const JudgeGroups = require("../public/json/Groups2019");

// ===================
// Authenticate routes
// ===================

// show register form
router.get("/register", async (req, res) => {
  await res.render("register");
});

router.get("/registerAdmin", async (req, res) => {
  res.render("registerAdmin");
});

//handle sign up logic

//Show register form
router.post("/register", async (req, res) => {
  req.body.password = req.sanitize(req.body.password);
  var newUser = new User({
    username: req.body.username,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    avatar: req.body.avatar,
    judge: req.body.judge,
    judgingGroup: req.body.judgingGroup,
  });

  User.register(newUser, req.body.password, isLoggedIn, async (err, user) => {
    try {
      await passport.authenticate("local", req, res, () => {
        res.redirect("/index");
        req.flash("success", "Welcome " + user.username);
      });
    } catch (err) {
      console.log(err);
      req.flash("error", err);
      return res.render("register");
    }
  });
});

// admin register POST
router.post("/registerAdmin", isLoggedIn, function (req, res) {
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
    passport.authenticate("local", req, res, function () {
      res.redirect("/index");
    });
  });
});

//User Profiles

router.get("/profile/:id", isLoggedIn, function (req, res) {
  User.findById(req.params.id, function (err, foundProfile) {
    if (err) {
      req.flash("error", "Urp, issue with your profile");
      res.redirect("/login");
    }
    res.render("profiles/show", { user: foundProfile });
  });
});

//EDIT User
router.get("/profile/:id/edit", function (req, res) {
  User.findById(req.params.id, function (err, foundProfile) {
    if (err) {
      console.log("redirect id edit");
      res.redirect("/artentries");
    }
    res.render("editUser", { user: foundProfile });
  });
});

//Update user
router.put("/profile/:id/", async (req, res) => {
  // (id, new data, callback )
  User.findByIdAndUpdate(req.params.id, req.body.user, async (err, foundPage) => {
    if (err) {
      console.log("error");
      res.render("/");
    }
    for (const userId of req.body.users) {
      let user = await User.findById(userId);
      user.assignedCategories = req.body.categories;
      await user.save();
      res.redirect("/login/" + req.params.id);
    }
  });
});

//Destroy user
router.delete("/profile/:id", function (req, res) {
  //destroy
  User.deleteOne(req.params.id, function (err) {
    if (err) {
      res.redirect("/login");
    }

    console.log("Deleted user");
    res.redirect("/login");
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
    successRedirect: "index",
    failureFlash: "Login failed",
    failureRedirect: "/login",
  }),
  function (req, res) {}
);

router.get("/", function (req, res) {
  res.redirect("/index");
});

//Logout ROUTE

router.get("/logout", function (req, res) {
  req.logout();
  req.flash("success", "Successfully logged out");
  res.redirect("/login");
});

//Get judges list:  ROUTE

router.get("/profiles/_judges", (req, res) => {
  User.find(req.params.id, function (err, foundUser) {
    if (err) {
      console.log("catch err: " + err.message);
      redirect("/index");
    }
    console.log(foundUser);
    res.render("profiles/_judges", { user: foundUser });
  });
});

module.exports = router;
