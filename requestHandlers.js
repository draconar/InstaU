/**
 *
 * Request handlers should be non-blocking
 *
 **/
var exec = require('child_process').exec; /* exec is a non-blocking linux shell comand from within node */
var querystring = require('querystring');
var fs = require('fs');
var formidable = require('formidable')
var URLProvider= require('./URLs_provider').URLProvider;
var redis = require('./url-getter');


var urlProvider = new URLProvider('localhost', 27017);


root = function(req, res) {
    res.render('index.jade', {locals:{title: 'bagulho doido'}
    });
};

root.httpMethod = 'GET';

saveNew = function(req, res){    
    res.render('url_new.jade', {locals:{title:'New URL'}});
}
saveNew.httpMethod = 'GET';

saveDB = function(req, res){    
    urlProvider.save({
        user: req.param('user'),
        address: req.param('address')}
        , function(error, urls ){                    
            console.log('saved ' + urls._id);
            redis.publish('query_curl', JSON.stringify(urls));
            res.redirect('/');
        });
}
saveDB.httpMethod = 'POST';

start = function (serverResponse) {
    console.log("Request Handler 'start' was called.");
    
    var body = '<html>'+
    '<head>'+
    '<meta http-equiv="Content-Type" content="text/html; '+
    'charset=UTF-8" />'+
    '</head>'+
    '<body>'+
    '<form action="/upload" enctype="multipart/form-data" method="post">'+
    '<input type="file" name="upload" multiple="multiple" />'+
    '<input type="submit" value="Upload File" />'+
    '</form>'+
    '</body>'+
    '</html>';
    
    serverResponse.writeHead(200, {"Content-Type": "text/html"});
    serverResponse.write(body);
    serverResponse.end();

};

upload = function(serverResponse, request) {
    console.log("Request Handler 'upload' was called.");
    
    var form = new formidable.IncomingForm();
    console.log('ABOUT TO PARSE');
    form.parse(request, function(err, fields, files){
       console.log('parsing done');
       fs.renameSync(files.upload.path, "./test.png")
       serverResponse.writeHead(200,{"Content-Type": "text/html"});
        serverResponse.write("received image <br/>"); 
        serverResponse.write("<img src='/show' />"); 
        serverResponse.end();        
    });
    
    
    
};

show = function(serverResponse) {
    console.log('Request handler "show" was called.');
    fs.readFile('./test.png', 'binary', function(error, file){
        if(error){
            serverResponse.writeHead(500, {"Content-type":"text/plain"});
            serverResponse.write(error + '\n');
            serverResponse.end();
        } else {
            serverResponse.writeHead(200, {"Content-type":"image/png"});
            serverResponse.write(file, "binary");
            serverResponse.end();
        }
    });
}

exports.root = root;
exports.start = start;
exports.upload = upload;
exports.show = show;
exports.saveNew = saveNew;
exports.saveDB = saveDB;