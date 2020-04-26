const IsoFetch = require('isomorphic-fetch');
const http = require('http');
const Dotenv = require('dotenv');
const DB_API_KEY = process.env.DB_API_KEY;
const DB_ACCESS_KEY = process.env.DB_ACCESS_KEY;
const Dropbox = require('dropbox').Dropbox;



//// DOT ENV block ////

Dotenv.config();
    // {path: path/filename}

    // process env PORT
let port = process.env.PORT;
let host = process.env.HOST;

let server = http.createServer((req,res)=>{
    console.log('thanks for the request ')
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('you rock');
});

server.listen(port, host,()=>{
    console.log(`env server started:  ${host}:${port}`);
});


//// Get files in DB  ////

const dbx = new Dropbox({
    accessToken: 'VqJ_FOuvvXAAAAAAAAAAPvMCW1eNJUZdqcvoy7ewhCQpQF8HwqN-yimnxNkpWhH4',
    fetch
});

dbx.filesListFolder({
    path:''
}).then(res => console.log(res));



// require('isomorphic-fetch'); // or another library of choice.
// var Dropbox = require('dropbox').Dropbox;
// var dbx = new Dropbox({ accessToken: 'access key ' });
// dbx.filesListFolder({path: ''})
//   .then(function(response) {
//     console.log(response);
//   })
//   .catch(function(error) {
//     console.log(error);
//   });




