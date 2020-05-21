const express = require('express'),
      router = express.Router(),
      passport = require('passport'),
      LocalStrategy = require('passport-local'),
      bodyParser = require('body-parser'),
      methodOverride = require('method-override'),
      mongoose = require('mongoose'),
      User = require ('../models/user'),
      artEntry = require('../models/artentries');


// ===================
// Get Ratings
// ===================

// Get rating form
router.get("/rating", function(req, res){
    res.render("register");
  });


router.post('/show', function(req, res){
    console.log(req.body);
    console.log('\n' + req.artentries);
});

  

module.exports = router;





//CREATE route
router.post("/artentries", function(req, res){
  //create entry
  artEntry.create(req.body.artentries, function(err, newEntry){
    if(err){
      res.render("/new");
    }
       res.redirect("/artentries");
  });
});