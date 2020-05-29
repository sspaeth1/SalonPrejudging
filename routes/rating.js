const express = require("express"),
  router = express.Router(),
  passport = require("passport"),
  LocalStrategy = require("passport-local"),
  bodyParser = require("body-parser"),
  methodOverride = require("method-override"),
  mongoose = require("mongoose"),
  User = require("../models/user"),
  ArtEntry = require("../models/artEntry"),
  GeneralScore = require("../models/score_general");
const { isLoggedIn } = require("../middleware");

// ===================
// Get Ratings
// ===================

// Get rating form
router.get("/rating", function (req, res) {
  res.render("register");
});

router.post("/show", function (req, res) {
  console.log(req.body);
  console.log("\n" + req.artentries);
});

module.exports = router;

//CREATE route
router.post("/artentries", function (req, res) {
  //create entry
  ArtEntry.create(req.body.artentries, function (err, newEntry) {
    if (err) {
      res.render("/new");
    }
    res.redirect("/artentries");
  });
});

/////////////
//Score
//////////////////

// Create

//ajax reques tto fetch   user id and

// Check id ajax request  to assure only score if logged in
router.post("/score", isLoggedIn, async function (req, res) {
  const { entry, getQuestionNum, selectedRadio } = req.body;
  try {
    let score = await GeneralScore.findOne({
      entryId: entry,
      judge: req.user,
    }).exec();
    console.log(selectedRadio, getQuestionNum);
    if (!score) {
      console.log("No existing score, creating new score");
      await GeneralScore.create({
        judge: req.user,
        entryId: entry,
        [getQuestionNum]: Number(selectedRadio),
        category: "A1",
      });
    } else {
      console.log("Score already exists, updating score");
      await GeneralScore.updateOne(
        { entryId: entry, judge: req.user },
        { [getQuestionNum]: Number(selectedRadio) }
      ).exec();
    }
    console.log("Score created/updated");
    res.send({ message: "Scored successfully" });
  } catch (err) {
    console.log("ERROR", err.message);
  }

  // entry
  // property
  // score

  // GeneralScore.create(req.params.id, function (err, newScore) {
  //   if (err) {
  //     red.render("/artentries");
  //   }
  // });
  // res.render(console.log(req.body), { newScore: newScore });
  //console.log("got here===>>", req.body);

  /* GeneralScore.create({

  });*/
});

//update

/// Winners   admin vs. user view based on login in page

router.get("/awardWinners", function (req, res) {
  res.render("awardWinners");
});
