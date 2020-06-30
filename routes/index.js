const express = require("express"),
  router = express.Router(),
  passport = require("passport"),
  User = require("../models/user"),
  ArtEntry = require("../models/artEntry"),
  Category = require("../models/category"),
  GeneralScore = require("../models/score_general"),
  JudgeGroups = require("../public/json/Groups2019"),
  auth = require("../routes/auth"),
  categorySpecifics = require("../public/json/categorySpecifics.js"),
  letterIndexKeys = require("../public/json/LetterIndexKeys.json");
letterIndex = require("../public/json/LetterIndex");
Dotenv = require("dotenv");
const { isLoggedIn } = require("../middleware");
var fetch = require("isomorphic-fetch");
Dotenv.config({ debug: process.env.DEBUG });
const DBX_API_KEY = process.env.DBX_API_KEY;

const Dropbox = require("dropbox").Dropbox;

const config = {
  fetch: fetch,
  accessToken: DBX_API_KEY,
};
const dbx = new Dropbox(config);

//==============
//RESTful routes
//==============

//INDEX route
router.get("/index", async (req, res) => {
  ArtEntry.find({}, function (err, artentries) {
    try {
      res.render("index", { artentries, categorySpecifics, JudgeGroups });
    } catch (err) {
      console.log("index page error: ", err.message);
    }
  }).populate("assignedCategories");
});

//===========
//SHOW Routes
//===========

router.get("/home", (req, res) => res.render("home"));

router.get("/generalGuidelines", (req, res) => res.render("generalGuidelines", { JudgeGroups }));

router.get("/guidelinesPrejudging", (req, res) => res.render("guidelinesPrejudging", { JudgeGroups }));

router.get("/judgingGroups", isLoggedIn, (req, res) => res.render("judgingGroups", { JudgeGroups }));

router.post("/judgingGroups", isLoggedIn, async (req, res) => {
  let user = await User.findOne({ email: req.body.email });
  req.body.categories.forEach(function (letter) {
    let existsAlready = user.assignedCategories.find((category) => category.letter === letter);
    if (!existsAlready) {
      user.assignedCategories.push({
        name: categories[category],
        letter: letter,
      });
    }
  });
  await user.save();
  res.render("judgingGroups", { JudgeGroups });
});

//  award entry dropdown page

router.get("/awardWinners", isLoggedIn, async (req, res) => {
  let artentries = await ArtEntry.find({}).exec();
  let score = await GeneralScore.find({}).populate("judge").populate("score_general").exec();

  res.render("awardWinners", { score, artentries, categorySpecifics, letterIndex, JudgeGroups });
});

// await GeneralScore.find({}, (err, scores) => {
//   GeneralScore.aggregate([
//     { avg_Gnrl_part1_1_message: { $avg: "$gnrl_part1_1_message" } },
//   ]);

//   if (err) {
//     console.log(err.message);
//   }
//   res.render("awardWinnersFinal", { scores: scores });
// });

//Award Winners post

router.post("/awardWinners", (req, res) => {
  const { category, excellenceEntryId, excellenceWinner, meritEntryId, meritWinner } = req.body;
  console.log("body", req.body);
  // ArtEntry.findOneAndUpdate({ id: excellenceEntryId }, { $set: { excellenceWinner: true } }, (err, foundPAge) => {
  //   if (err) {
  //     console.log("update error: ", err.message);
  //     res.render("/");
  //   }
  //   res.redirect("/awardWinners");
  // });
});

router.get("/appendixA", (req, res) => res.render("appendixA", { JudgeGroups }));

router.get("/appendixB", (req, res) => res.render("appendixB", { JudgeGroups }));

router.get("/ballots", (req, res) => res.render("ballots", { JudgeGroups }));

router.get("/artentries/", isLoggedIn, async function (req, res) {
  try {
    let pageCategoryId = req.query;

    let findScore = await GeneralScore.find({
      judge: req.user.id,
    }).exec();

    let findComplete = await GeneralScore.find({
      judge: req.user.id,
      complete: true,
    }).exec();

    // var page = req.params.page || 1;
    // var r_limit = req.params.limit || 2;
    // var limit = parseInt(r_limit);

    await ArtEntry.find({})
      .populate("judge")
      .populate("score_general")
      .then(async (artentries) => {
        console.log(" req.query", req.query.categoryId);
        for (var i = 0; i < artentries.length; i++) {
          let sub = "/" + req.query.categoryId + "/" + artentries[i].title.split(" ", 1)[0] + ".jpg";
          // console.log(sub.split("-", 1)[0]);
          // console.log("/" + req.query.categoryId + "/" + req.query.categoryId);
          if (sub.split("-", 1)[0] == "/" + req.query.categoryId + "/" + req.query.categoryId) {
            try {
              // console.log("substr", sub);
              await dbx
                .filesGetTemporaryLink({
                  path: sub,
                })
                .then(function (response) {
                  artentries[i].link = response.link;
                  console.log(" linkr: ", response.link);
                });
            } catch (err) {
              artentries[i].link = "https://i.imgur.com/33E6CfN.jpg";
              console.log(" linkr: ", artentries[i].link);
              console.log(" page catch err: ", err.message);
            }
          }
        }
        res.render("artentries", {
          // title: "pagination",
          // result: result.docs,
          // total: result.total,
          // limit: result.limit,
          // page: page,
          // pages: result.pages,
          artentries,
          findScore,
          findComplete,
          DBX_API_KEY,
          pageCategoryId,
          categorySpecifics,
          JudgeGroups,
          letterIndexKeys,
        });
      });

    //  await ArtEntry.find({},async function (err, artentries) {
    //     if (err) {
    //       console.log("Art Entries page: ", err.message);
    //     }
    //     for (var i = 0; i < artentries.length; i++) {
    //       if (artentries[i].folderId) {
    //        await dbx.usersGetCurrentAccount().then(function (response) {
    //           console.log("response", response);
    //         });
    //       }
    //     }
    //     res.render("artentries", {
    //       artentries,
    //       findScore,
    //       DBX_API_KEY,
    //       pageCategoryId,
    //       categorySpecifics,
    //       letterIndexKeys,
    //     });
    //   })
    //     .populate("judge")
    //     .populate("score_general")
    //     .exec((err, artEntryFound) => {
    //       if (err) {
    //         console.log("art etry populate: " + err.message);
    //       }
    //     });
  } catch (err) {
    console.log("go to artentries page catch err: ", err);
    res.redirect("/index");
  }
});

router.get("/artentries/:id", isLoggedIn, async (req, res) => {
  try {
    let pageCategoryId = req.query;

    let findScore = await GeneralScore.findOne({
      judge: req.user.id,
      entryId: req.params.id,
    })
      .populate("judge")
      .populate("entryId")
      .exec();

    let foundPage = {};
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
      intractv_part1_1_message = null,
      intractv_part1_2_audience = null,
      intractv_part1_3_problemSolving = null,
      intractv_part1_4_intractvUse = null,
      intractv_part1_5_accuracy = null,
      intractv_part1_6_clarity = null,
      intractv_part2_7_technique = null,
      intractv_part2_8_UI = null,
      intractv_part2_9_draftsman_craftsmanship = null,
      intractv_part2_10_usability = null,
      intractv_part2_11_functionality = null,
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
      JudgeGroups,
      letterIndexKeys,
      pageCategoryId,
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
      intractv_part1_1_message,
      intractv_part1_2_audience,
      intractv_part1_3_problemSolving,
      intractv_part1_4_intractvUse,
      intractv_part1_5_accuracy,
      intractv_part1_6_clarity,
      intractv_part2_7_technique,
      intractv_part2_8_UI,
      intractv_part2_9_draftsman_craftsmanship,
      intractv_part2_10_usability,
      intractv_part2_11_functionality,
    });
  } catch (err) {
    console.log("go to :id page catch err: " + err.message);
    res.redirect("/artentries");
  }
});

//Sample entry
router.get("/SampleEntry", function (req, res) {
  ArtEntry.findById(req.params.id, function (err, foundPage) {
    if (err) {
      console.log("redirect id edit");
      res.redirect("index");
    }

    res.render("categories/showSample", { artentries: foundPage, DBX_API_KEY, JudgeGroups });
  });
});

//EDIT ROUTE
router.get("/artentries/:id/edit", function (req, res) {
  ArtEntry.findById(req.params.id, function (err, foundPage) {
    if (err) {
      console.log("redirect id edit");
      res.redirect("/artentries");
    }

    res.render("edit", { artentries: foundPage, JudgeGroups });
  });
});

//Update route
router.put("/artentries/:id", function (req, res) {
  // (id, new data, callback )
  ArtEntry.findByIdAndUpdate(req.params.id, req.body.artentries, function (err, foundPage) {
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
