const express = require("express"),
  router = express.Router(),
  passport = require("passport"),
  User = require("../models/user"),
  artEntry = require("../models/artentries"),
  Categories = require("../models/categories"),
  bookScore = require("../models/score_book"),
  generalScore = require("../models/score_general"),
  animationScore = require("../models/score_animation"),
  auth = require("../routes/auth"),
  isLoggedIn = require("../public/isLoggedIn");

//==============
//RESTful routes
//==============

//INDEX route
router.get("/index", function (req, res) {
  artEntry.find({}, function (err, artentries) {
    if (err) {
      console.log(err);
    }
    res.render("index", { artentries: artentries });
  });
});

//===========
//SHOW Routes
//===========

// Home
router.get("/home", (req, res) => res.render("home"));

// guidelines
router.get("/generalGuidelines", isLoggedIn, (req, res) =>
  res.render("generalGuidelines")
);
router.get("/guidelinesPrejudging", isLoggedIn, (req, res) =>
  res.render("guidelinesPrejudging")
);

// Judging Groups
router.get("/judgingGroups", isLoggedIn, (req, res) =>
  res.render("judgingGroups")
);
// create POST route

// Award Winners
router.get("/awardWinners", isLoggedIn, (req, res) =>
  res.render("awardWinnersFinal")
);

// appendix A
router.get("/appendixA", (req, res) => res.render("appendixA"));

// appendix B
router.get("/appendixB", (req, res) => res.render("appendixB"));

// My Judging Categories
router.get("/artentries", isLoggedIn, function (req, res) {
  artEntry.find({}, function (err, artentries) {
    if (err) {
      console.log(err);
    }
    if (artEntry.find({ category: "A-1" })) {
      res.render("artentries", { artentries: artentries });
    }
  });
});

router.get("/artentries/:id", function (req, res) {
  artEntry.findById(req.params.id, function (err, foundPage) {
    if (err) {
      console.log("redirect show route");
      res.redirect("/artentries");
    }
    res.render("show", { artentries: foundPage });
  });
});

//User Profiles

router.get("/profile/:id", function (req, res) {
  User.findById(req.params.id, function (err, foundProfile) {
    if (err) {
      req.flash("error", "Urp, issue with your profile");
      res.redirect("/login");
    }
    res.render("profiles/show", { user: foundProfile });
  });
});

//EDIT ROUTE
router.get("/artentries/:id/edit", function (req, res) {
  artEntry.findById(req.params.id, function (err, foundPage) {
    if (err) {
      console.log("redirect id edit");
      res.redirect("/artentries");
    }

    res.render("edit", { artentries: foundPage });
  });
});

//Update route
router.put("/artentries/:id", function (req, res) {
  // (id, new data, callback )
  artEntry.findByIdAndUpdate(req.params.id, req.body.artentries, function (
    err,
    foundPage
  ) {
    if (err) {
      console.log("error");
      res.render("/");
    }

    res.redirect("/artentries/" + req.params.id);
  });
});

//Destroy route
router.delete("/artentries/:id", function (req, res) {
  //destroy
  artEntry.deleteOne(req.params.id, function (err) {
    if (err) {
      res.redirect("/artentries");
    }

    console.log("Deleted entry");
    res.redirect("/artentries");
  });
});

module.exports = router;
