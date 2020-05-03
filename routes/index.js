const express = require('express');
const router = express.Router();
const passport = require('passport');
const artentries = ('../models/artentries'),
     User = require('../models/user'),
     artEntry =require('../models/artentries')
     auth = require('../routes/auth'),
     isLoggedIn = require('../public/isLoggedIn');

  
  //==============
  //RESTful routes
  //==============
  
  //INDEX route 
  router.get('/artentries',isLoggedIn, function(req, res){
    artEntry.find({}, function(err, artentries){
      if(err){
        console.log(err);
      } 
        res.render('index', { artentries:artentries});
      
    });
  });


  
  
  //===========
  //SHOW Routes
  //===========


  // Home
  router.get('/home', isLoggedIn, (req, res)=> res.render('home'));


  // guidelines
  router.get('/generalGuidelines', isLoggedIn, (req, res)=> res.render('generalGuidelines'));
  router.get('/guidelinesPrejudging',isLoggedIn, (req, res)=> res.render('guidelinesPrejudging'));

  // Judging Groups
  router.get('/judgingGroups', isLoggedIn, (req, res)=> res.render('judgingGroups'));
    // create POST route

  // Award Winners
  router.get('/awardWinners',isLoggedIn, (req, res)=> res.render('awardWinners'));
    
  
  // appendix A
  router.get('/appendixA', isLoggedIn,(req,res)=> res.render('appendixA'));

  // appendix B
  router.get('/appendixB', isLoggedIn,(req, res)=> res.render('appendixB'));

   
    

  // My Judging Categories
  router.get("/artentries/:id", function(req, res){
    artEntry.findById(req.params.id, function(err, foundBlog){
      if(err){
        console.log("redirect show route");
        res.redirect("/artentries");
      }
    
        res.render("show", {artentries : foundBlog});
  
    });
  });
  
  
  //EDIT ROUTE 
  router.get("/artentries/:id/edit", function(req, res){
    artEntry.findById(req.params.id, function(err, foundBlog){
      if(err){
        console.log("redirect id edit");
        res.redirect("/artentries");
      }
      
        res.render("edit", {artentries : foundBlog});
      
    });
  });
  
  //Update route
  router.put("/artentries/:id", function(req, res){
                              // (id, new data, callback )
    artEntry.findByIdAndUpdate(req.params.id, req.body.artentries, function(err, foundBlog){
      if(err){
        console.log('error');
        res.render("/");
      }
      
        res.redirect("/artentries/" + req.params.id);
      
    });
  });
  
  //Destroy route
  router.delete("/artentries/:id", function(req, res){
    //destroy
    artEntry.deleteOne(req.params.id, function(err){
      if(err){
         res.redirect('/artentries'); 
      }
  
         console.log('Deleted entry');
         res.redirect('/artentries');      
    });
  });

  module.exports = router;