const express = require("express"),
  router = express.Router(),
  passport = require("passport"),
  auth = require("../routes/auth"),
  LocalStrategy = require("passport-local"),
  bodyParser = require("body-parser"),
  methodOverride = require("method-override"),
  mongoose = require("mongoose"),
  expressSanitizer = require("express-sanitizer"),
  JudgeGroups = require("../public/json/Groups2019"),
  User = require("../models/user"),
  ArtEntry = require("../models/artEntry");

const { isLoggedIn } = require("../middleware");

// ===================
// Authenticate routes
// ===================

// show register form
router.get("/register", async (req, res) => {
  try {
    await res.render("register", { JudgeGroups });
  } catch (err) {
    console.log(err);
  }
});

router.get("/registerAdmin", async (req, res) => {
  res.render("registerAdmin", { JudgeGroups });
});

//handle sign up logic

//Show register form
router.post("/register", async (req, res) => {
  try {
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
          req.flash("success", "Welcome " + user.username);
          res.redirect("/index");
        });
      } catch (err) {
        console.log(err);
        req.flash("error", err);
        return res.render("register");
      }
    });
  } catch (err) {
    console.log(err);
  }
});

// admin register POST
router.post("/registerAdmin", isLoggedIn, function (req, res) {
  try {
    var newUser = new User({
      username: req.body.username,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      avatar: req.body.avatar,
      judge: req.body.judge,
      isAdmin: req.body.isAdmin,
      assignedCategories: req.body.assignedCategories,
    });
    if (req.body.isAdmin === true) {
      newUser.isAdmin = true;
    }

    User.register(newUser, req.body.password, function (err, user) {
      try {
        req.flash("success", "Welcome " + user.username);
        passport.authenticate("local", req, res, function () {
          return res.render("registerAdmin");
        });
      } catch (err) {
        console.log(err);
        res.redirect("/index");
      }
    });
  } catch (err) {
    console.log(err);
  }
});

//User Profiles

router.get("/profile/:id", isLoggedIn, function (req, res) {
  User.findById(req.params.id, function (err, foundProfile) {
    if (err) {
      req.flash("error", "Urp, issue with your profile");
      res.redirect("/login");
    }
    res.render("profiles/show", { user: foundProfile, JudgeGroups });
  });
});

//EDIT User
router.get("/profile/:id/edit", async (req, res) => {
  await User.findById(req.params.id, (err, foundProfile) => {
    try {
      res.render("editUser", { user: foundProfile, JudgeGroups });
    } catch (err) {
      console.log("redirect id edit");
      res.redirect("/artentries");
    }
  });
});

//Update user
router.put("/profile/:id/", async (req, res) => {
  // (id, new data, callback )
  User.findByIdAndUpdate(req.params.id, req.body.user, async (err, foundPage) => {
    try {
      for (const userId of req.body.users) {
        let user = await User.findById(userId);
        user.assignedCategories = req.body.categories;
        await user.save();
        res.redirect("/login/" + req.params.id);
      }
    } catch (err) {
      req.flash("error", "Urp, issue with your profile");
      console.log("error");
      res.render("/");
    }
  });
});

//Destroy user
router.delete("/profile/:id", (req, res) => {
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
router.get("/login", async (req, res) => {
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
