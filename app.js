var bodyParser = require('body-parser'),
methodOverride = require('method-override'),
mongoose = require('mongoose'),
express = require('express'),
passport = require('passport'),
LocalStrategy = require('passport-local'),
User = require ('./models/user'),
artEntry = require('./models/artentries');

app = express();

//App config

mongoose.connect("mongodb://localhost:27017/salon_prejudging_app", { useNewUrlParser: true,  useUnifiedTopology: true }, { useFindAndModify: false });
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use(require('express-session')({
  secret: "pulseOx",
  resave: false,
  saveUninitialized: false
}));


app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//site specific middleware  sets a currentUser check on every Route
app.use(function(req, res, next){
  res.locals.currentUser = req.user;
  next();
});

// artEntry.create({
//   title: 'cell nucleus',
//   image: 'https://micro.magnet.fsu.edu/cells/nucleus/images/nucleusfigure1.jpg',
//   medium: 'photoshop',
//   fomat: 'painting',
//   audience: 'High School'
// });


// // check if admin middleware
// router.post('/login', requireAdmin(), passport.authenticate('local'), function(req, res) {
//   res.redirect('/');
// });

// function requireAdmin() {
//   return function(req, res, next) {
//     User.findOne({ req.body.username }, function(err, user) {
//       if (err) { return next(err); }

//       if (!user) { 
//         // Do something - the user does not exist
//       }

//       if (!user.admin) { 
//         // Do something - the user exists but is no admin user
//       }

//       // Hand over control to passport
//       next();
//     });
//   }
// }


// ===================
// Authenticate routes
// ===================

// show register form
app.get("/register", function(req, res){
  res.render("register");
});

//handle sign up logic

//Show register form
app.post("/register", function( req, res){
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


//LOGIN
app.get('/login', function(req,res){
  res.render("login");
});

app.post(("/login"), passport.authenticate("local",
 {
   successRedirect: "/artentries",
  failureRedirect: "/login"
}), function(req, res){

});

app.get('/', function(req, res){
  res.redirect('/artentries');
});


//Logout ROUTE

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/login')
});

// check if logged in

function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect("/login");
}


//==============
//RESTful routes
//==============

//INDEX route 
app.get('/artentries',isLoggedIn, function(req, res){
  artEntry.find({}, function(err, artentries){
    if(err){
      console.log(err);
    } 
      res.render('index', { artentries:artentries});
    
  });
});

//New route 
app.get('/artentries/new', isLoggedIn, function(req, res){
  res.render('new');
});

//CREATE route
app.post("/artentries", function(req, res){
  //create entry
  artEntry.create(req.body.artentries, function(err, newEntry){
    if(err){
      res.render("/new");
    }
        res.redirect("/artentries");
    

  });
});



//SHOW Routes
app.get("/artentries/:id", function(req, res){
  artEntry.findById(req.params.id, function(err, foundBlog){
    if(err){
      console.log("redirect show route");
      res.redirect("/artentries");
    }
  
      res.render("show", {artentries : foundBlog});

  });
});


//EDIT ROUTE 
app.get("/artentries/:id/edit", function(req, res){
  artEntry.findById(req.params.id, function(err, foundBlog){
    if(err){
      console.log("redirect id edit");
      res.redirect("/artentries");
    }
    
      res.render("edit", {artentries : foundBlog});
    
  });
});

//Update route
app.put("/artentries/:id", function(req, res){
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
app.delete("/artentries/:id", function(req, res){
  //destroy
  artEntry.deleteOne(req.params.id, function(err){
    if(err){
       res.redirect('/artentries'); 
    }

       console.log('Deleted entry');
       res.redirect('/artentries'); 
    
  });
});

var port = process.env.PORT || 3000 ;
app.listen(port, process.env.IP, function(){console.log("Server Started for prejuging app");});