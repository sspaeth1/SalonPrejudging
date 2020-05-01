const IsoFetch = require('isomorphic-fetch'),
    express = require('express'),
    app = express(),
    http = require('http'),
    fs =require('fs'),
    Dotenv = require('dotenv'),
    ejs = require('ejs'),
    bodyParser = require('body-parser'),
    Dropbox = require('dropbox').Dropbox;
    

// import { Dropbox } from 'dropbox';
app.use(express.static('/public'));
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");


//// DOT ENV block ////

Dotenv.config();
    // {path: path/filename}

    // process env PORT
let port = process.env.PORT;
let host = process.env.HOST;
let DBkey = process.env.DB_API_KEY;
let DBaccess = process.env.DB_ACCESS_KEY;

 //HTTP SERVER //
    let server = http.createServer((req,res)=>{
        console.log('thanks for the request ')
        res.writeHead(200, {'Content-Type': 'text/html'});
        fs.readFile('public/_index.html', null, (err, data)=>{
            if(err){
                console.log(err);
            }
            res.write(data);
        });
        res.end(
            'you rock'       
            );

    });

    server.listen(port, host,()=>{
        console.log(`env server started:  ${host}:${port}`);
    });

// // EXPRESS SERVER //

// //Express routing
// app.get('/index.html', (req, res)=>{
//     res.render('/DB_show', function(err){
//         if(err){
//             console.log(err);
//         }
//         console.log(req.body)
//         res.render('index.html');
//         return  alert('JS file loaded');
//     })
// })

// app.get('/',(req,res)=>{res.redirect('index.html')})
// app.listen(port, host, function(){console.log('express server started for Dropbox import on port: '+port +" and host: "+host)});



//// Get files from DropBox ////

// const fileListElem = document.querySelector('.js-file-list');

    // const dbx = new Dropbox({
    //     accessToken: DBaccess,
    //     fetch
    // });

    // const state = {
    //     files: []
    // }

    // const init = () => {
    //     dbx.filesListFolder({
    //         path:''
    //     }).then(res =>{
    //         renderFiles(res.entries)    
    //     });   
    // }

    // const updateFiles = files => {
    //     state.files = [...state.files, ...files]
    //     renderFiles()
    // }

    // const renderFiles = () => {
    //     // fileListElem.innerHTML = state.files.sort((a,b)=>{
            
    //     state.files.sort((a,b)=>{
    //         //sort alphabetically, folders first
    //         if((a['.tag'] === 'folder' || b['.tag'] === 'folder')
    //             && !(a['.tag'] === b ['.tag'])){
    //                 return a['.tag'] === 'folder' ?-1 :1
    //             }else{
    //                 return a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1
    //             }
    //     }).map(file =>{
    //         const type = file['.tag']
    //         return `
    //             <li class="dbx-list-item ${type}">${file.name}</li`
    //     }

    //     )
    // }

    // init()





