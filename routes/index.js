const express = require("express"),
  router = express.Router(),
  passport = require("passport"),
  User = require("../models/user"),
  ArtEntry = require("../models/artEntry"),
  Category = require("../models/category"),
  GeneralScore = require("../models/score_general"),
  auth = require("../routes/auth");
const { isLoggedIn } = require("../middleware");

//==============
//RESTful routes
//==============

//INDEX route
router.get("/index", function (req, res) {
  ArtEntry.find({}, function (err, artentries) {
    if (err) {
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
  ArtEntry.find({}, function (err, artentries) {
    if (err) {
    }
    res.render("artentries", { artentries: artentries });
  });
});

router.get("/artentries/:id", isLoggedIn, function (req, res) {
  ArtEntry.findById(req.params.id, function (err, foundPage) {
    if (err) {
      res.redirect("/artentries");
    }

    res.render("show", { artentries: foundPage });
  });
});

//EDIT ROUTE
router.get("/artentries/:id/edit", function (req, res) {
  ArtEntry.findById(req.params.id, function (err, foundPage) {
    if (err) {
      res.redirect("/artentries");
    }

    res.render("edit", { artentries: foundPage });
  });
});

//Update route
router.put("/artentries/:id", function (req, res) {
  // (id, new data, callback )
  ArtEntry.findByIdAndUpdate(req.params.id, req.body.artentries, function (
    err,
    foundPage
  ) {
    if (err) {
      res.render("/");
    }

    res.redirect("/artentries/" + req.params.id);
  });
});

//Destroy route
router.delete("/artentries/:id", function (req, res) {
  //destroy
  ArtEntry.deleteOne(req.params.id, function (err) {
    if (err) {
      res.redirect("/artentries");
    }

    res.redirect("/artentries");
  });
});

module.exports = router;
