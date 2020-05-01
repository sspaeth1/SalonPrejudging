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
  req.flash("error", "Please login ");
  res.redirect("/login");
}

module.exports = isLoggedIn;