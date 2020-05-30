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
  ArtEntry.find({}, function (err, artentries) {
    if (err) {
      console.log(err);
    }
    res.render("artentries", { artentries: artentries });
    // console.log(ArtEntry.find({ category: "A-1" }));
  });
});

// Idividual art entries

router.get("/artentries/:id", isLoggedIn, async (req, res) => {
  try {
    const findScore = await GeneralScore.findOne({
      judge: req.user,
    });
    // findScore.$where({entryId: req.entryId});  // entryId: `${entryId._id}`,
    // if (!findScore || findScore === null) {
    //   console.log("No existing score, creating new score");
    //   await GeneralScore.insert({
    //     judge: req.user,
    //     entryId: req.entryId,
    //     //[getQuestionNum]: Number(selectedRadio),
    //     category: "B", ////  MUST COME FROM SCHEMA
    //   }).exec();
    // } else {
    console.log("score: " + findScore);
    const {
      judge,
      complete,
      id,
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
    } = findScore;
    // }
    const foundPage = await ArtEntry.findById(req.params.id);
    res.render("show", {
      artentries: foundPage,
      score: findScore,
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
    console.log("found page: " + foundPage);
  } catch (err) {
    console.log("catch err: " + err.message);
    res.redirect("/artentries");
  }
});

// router.get("/artentries/:id", isLoggedIn, function (req, res) {
//   ArtEntry.findById(req.params.id, function (err, foundPage) {
//     if (err) {
//       console.log("redirect show route");
//       res.redirect("/artentries");
//     }
//     console.log(foundPage);
//     res.render("show", { artentries: foundPage });
//   });
// });

//   try {
//     User.find({ assignedCategories }, function (err, AssignedCategories) {
//       if (err) {
//         console.log("error: " + err.message);
//       }
//       res.render("show", { AssignedCategories });
//     });

//   } catch (err) {
//     console.log("error message: " + err.message);
//   }
// });

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
      console.log("error");
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
