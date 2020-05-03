const bodyParser = require('body-parser'),
methodOverride = require('method-override'),
mongoose = require('mongoose'),
express = require('express'),
flash = require('connect-flash'),
passport = require('passport'),
LocalStrategy = require('passport-local'),
User = require ('./models/user'),
artEntry = require('./models/artentries'),
alt = 'acdNGY4RKoPe';

const newItemRoutes    = require('./routes/newItem');
const auth             = require('./routes/auth');
const indexRoutes      = require('./routes/index');
const rating           = require('./routes/rating');

const app = express();

//App config//

// //mongoose connect mongo DB Atlas
mongoose.connect("mongodb+srv://spaeth2:"+alt+"@ss-apps-vtkpg.mongodb.net/test?retryWrites=true&w=majority",{
   useNewUrlParser:true,
    useCreateIndex:true,
    useUnifiedTopology:true,
    useFindAndModify: false
  }).then(()=>{
    console.log('Connected to DB');
  }).catch(err => {
    console.log("Error: " + err.message);
});



app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use(require('express-session')({
  secret: "pulseOx",
  resave: false,
  saveUninitialized: false
}));
app.use(flash());

//Use passport functions
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//site specific middleware  sets a currentUser check on every Route //returns user feedback
app.use(function(req, res, next){
  res.locals.currentUser = req.user;
  res.locals.error       = req.flash('error');
  res.locals.success     = req.flash('success');
  next();
});

//Use routes 
app.use(indexRoutes);
app.use(auth);
app.use(newItemRoutes);
app.use(rating);


//App listen 
var port = process.env.PORT || 3000 ;
app.listen(port, process.env.IP, function(){console.log("Server Started for prejuging app: process.env.PORT || 3000");});