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
// Authenticate routes
// ===================

// show register form
router.get("/register", function(req, res){
    res.render("register");
  });
  
  //handle sign up logic
  
  //Show register form
  router.post("/register", function( req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
      if(err){
        console.log(err);
        return res.render('register');
      }
      passport.authenticate('local')(req, res, function(){
        res.redirect('/artentries');
      });
    });
  });
  
  //======
  //LOGIN
  //======
  router.get('/login', function(req,res){
    res.render("login");
  });
  
  router.post(("/login"), passport.authenticate("local",
   {
     successRedirect: "/artentries",
    failureRedirect: "/login"
  }), function(req, res){
  
  });
  
  router.get('/', function(req, res){
    res.redirect('/artentries');
  });
  
  
  //Logout ROUTE
  
  router.get('/logout', function(req, res){
    req.logout();
    req.flash('success', "Successfully logged out");
    res.redirect('/login')
  });
  
  
module.exports = router;