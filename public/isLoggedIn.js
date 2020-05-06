const express = require('express'),
      router = express.Router(),
      passport = require('passport'),
      LocalStrategy = require('passport-local'),
      bodyParser = require('body-parser'),
      methodOverride = require('method-override'),
      mongoose = require('mongoose'),
      User = require ('../models/user'),
      artEntry = require('../models/artentries');



// check if logged in
  

function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  req.flash("error", "You need to be signed in for that");
  res.redirect("/login");
}

module.exports = isLoggedIn;