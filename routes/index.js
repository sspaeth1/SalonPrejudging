const express = require("express"),
  router = express.Router(),
  passport = require("passport"),
  User = require("../models/user"),
  ArtEntry = require("../models/artEntry"),
  Category = require("../models/category"),
  GeneralScore = require("../models/score_general"),
  auth = require("../routes/auth"),
  categorySpecifics = require("../public/json/categorySpecifics3.json"),
  letterIndex = require("../public/json/LetterIndex.js");
Dotenv = require("dotenv");
const { isLoggedIn } = require("../middleware");

Dotenv.config({ debug: process.env.DEBUG });
const DBX_API_KEY = process.env.DBX_API_KEY;

//==============
//RESTful routes
//==============

//INDEX route
router.get("/index", function (req, res) {
  ArtEntry.find({}, function (err, artentries) {
    if (err) {
      console.log("index page error: ", err.message);
    }
    let sdf = 0;
    console.log(categorySpecifics[sdf].letter);
    res.render("index", { artentries: artentries });
  });
});

//===========
//SHOW Routes
//===========

// Home
router.get("/home", (req, res) => res.render("home"));

// guidelines
router.get("/generalGuidelines", (req, res) => res.render("generalGuidelines"));
router.get("/guidelinesPrejudging", (req, res) =>
  res.render("guidelinesPrejudging")
);

// Judging Groups
router.get("/judgingGroups", isLoggedIn, (req, res) =>
  res.render("judgingGroups")
);

// add users to judging group
router.post("/judgingGroups", isLoggedIn, async (req, res) => {
  // POST route for create judgingGroups

  // find the user by his/her email
  let user = await User.findOne({ email: req.body.email });
  // iterate over category letters
  req.body.categories.forEach(function (letter) {
    // push category info into user's assignedCategories array
    // be sure to check if user assignedCategories already has
    // that category
    let existsAlready = user.assignedCategories.find(
      (category) => category.letter === letter
    );
    if (!existsAlready) {
      user.assignedCategories.push({
        name: categories[category],
        letter: letter,
        folderId: req.user.assignedCategories.folderId,
      });
    }
  });
  // save user
  await user.save();
  res.render("judgingGroups");
});
// create POST route

// Award Winners
router.get("/awardWinners", isLoggedIn, async (req, res) => {
  await GeneralScore.find({}, (err, scores) => {
    GeneralScore.aggregate([
      { avg_Gnrl_part1_1_message: { $avg: "$gnrl_part1_1_message" } },
    ]);

    if (err) {
      console.log(err.message);
    }
    res.render("awardWinnersFinal", { scores: scores });
  });
});

// appendix A
router.get("/appendixA", (req, res) => res.render("appendixA"));

// appendix B
router.get("/appendixB", (req, res) => res.render("appendixB"));

// My Judging Categories
router.get("/artentries", isLoggedIn, async function (req, res) {
  let score = await GeneralScore.find({}, function (err, score) {
    if (err) {
      console.log(err.message);
    }
  });

  ArtEntry.find({}, function (err, artentries) {
    if (err) {
      console.log("Art Entries page: ", err.message);
    }
    res.render("artentries", {
      artentries: artentries,
      score: score,
      DBX_API_KEY: DBX_API_KEY,
    });
    // console.log(ArtEntry.find({ category: "A-1" }));
  })
    .populate("judge")
    .populate("score_general")
    .exec((err, artEntryFound) => {
      if (err) {
        console.log("art etry populate: " + err.message);
      }
    });
});

router.get("/artentries/:id", isLoggedIn, async (req, res) => {
  try {
    let findScore = await GeneralScore.findOne({
      judge: req.user.id,
      entryId: req.params.id,
    })
      .populate("judge")
      .populate("entryId")
      .exec();

    var foundPage = {};
    if (!findScore) {
      console.log("No existing score, creating new score");
      await GeneralScore.create({
        judge: req.user.id,
        entryId: req.params.id,
      });

      findScore = await GeneralScore.findOne({
        judge: req.user.id,
        entryId: req.params.id,
      }).exec();
    }
    let {
      judge: { judge },
      id,
      gnrl_part1_1_message = null,
      gnrl_part1_2_audience = null,
      gnrl_part1_3_problemSolving = null,
      gnrl_part1_4_accuracy = null,
      gnrl_part1_5_clarity = null,
      gnrl_part2_6_technique = null,
      gnrl_part2_7_composition = null,
      gnrl_part2_8_draftsmanship = null,
      gnrl_part2_9_craftsmanship = null,
      book_part1_1_message = null,
      book_part1_2_audience = null,
      book_part1_3_MedIlliUse = null,
      book_part1_4_accuracy = null,
      book_part1_5_clarity = null,
      book_part2_6_technique = null,
      book_part2_7_cmpstionDrftsmnshpCrftmnshp = null,
      book_part2_8_consistencyRendering = null,
      book_part2_9_layoutIntegration = null,
      anim_part1_1_message = null,
      anim_part1_2_audience = null,
      anim_part1_3_problemSolving = null,
      anim_part1_4_accuracy = null,
      anim_part1_5_clarity = null,
      anim_part2_6_technique = null,
      anim_part2_7_composition = null,
      anim_part2_8_draftsmanship = null,
      anim_part2_9_craftsmanship = null,
      anim_part2_10_motion_fx = null,
      anim_part2_11_sound = null,
      notes,
      complete,
    } = findScore;

    foundPage = await ArtEntry.findById(req.params.id);
    res.render("show", {
      artentries: foundPage,
      score: findScore,
      DBX_API_KEY: DBX_API_KEY,
      id,
      notes,
      complete,
      letterIndex,
      categorySpecifics,
      gnrl_part1_1_message,
      gnrl_part1_2_audience,
      gnrl_part1_3_problemSolving,
      gnrl_part1_4_accuracy,
      gnrl_part1_5_clarity,
      gnrl_part2_6_technique,
      gnrl_part2_7_composition,
      gnrl_part2_8_draftsmanship,
      gnrl_part2_9_craftsmanship,
      book_part1_1_message,
      book_part1_2_audience,
      book_part1_3_MedIlliUse,
      book_part1_4_accuracy,
      book_part1_5_clarity,
      book_part2_6_technique,
      book_part2_7_cmpstionDrftsmnshpCrftmnshp,
      book_part2_8_consistencyRendering,
      book_part2_9_layoutIntegration,
      anim_part1_1_message,
      anim_part1_2_audience,
      anim_part1_3_problemSolving,
      anim_part1_4_accuracy,
      anim_part1_5_clarity,
      anim_part2_6_technique,
      anim_part2_7_composition,
      anim_part2_8_draftsmanship,
      anim_part2_9_craftsmanship,
      anim_part2_10_motion_fx,
      anim_part2_11_sound,
    });
  } catch (err) {
    console.log("go to :id page catch err: " + err.message);
    res.redirect("/artentries");
  }
});

//EDIT ROUTE
router.get("/artentries/:id/edit", function (req, res) {
  ArtEntry.findById(req.params.id, function (err, foundPage) {
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
  ArtEntry.findByIdAndUpdate(req.params.id, req.body.artentries, function (
    err,
    foundPage
  ) {
    if (err) {
      console.log("update error: ", err.message);
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

    console.log("Deleted entry");
    res.redirect("/artentries");
  });
});

module.exports = router;
