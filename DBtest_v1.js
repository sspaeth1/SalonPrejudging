const   express = require('express'),
        bodyParser =require('body-parser'),
        Dotenv = require('dotenv'),
        // fetch =require('node-fetch'),
        IsoFetch = require('isomorphic-fetch'),
        uuid     = require('uuid/v4'),
        Dropbox = require('dropbox').Dropbox,
        ejs = require('ejs'),
        app = express();
        // import {Dropbox} from 'dropbox';

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine','ejs');

        
//// DOT ENV block ////
Dotenv.config();
    // {path: path/filename}

const port  = process.env.PORT,
      host  = process.env.HOST,
      DBkey = process.env.DB_ACCESS_KEY,
      DB_API_KEY = process.env.DB_API_KEY;


//// Get files from DB  ////

const dbx = new Dropbox({
    accessToken: DBkey,
    fetch
});

let json  = dbx.filesListFolder({
                        path:''
                    }).then(res =>{
                        console.log('res');
                        res
                        });
let filesFromDB =JSON.stringify(json);

let url = 'https://www.reddit.com/r/popular.json';


app.get('/index', (req, res, next)=>{
    res.render('DBtest');
    });


app.get('/', (req, res)=>{res.redirect('/index')});


app.listen(port, host,console.log(`listening on port: ${port}`));



