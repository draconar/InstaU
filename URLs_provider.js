var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;


URLProvider = function(host, port) {
  this.db= new Db('node-mongo-instanu', new Server(host, port, {auto_reconnect: true}, {}));
  this.db.open(function(){});
};

URLProvider.prototype.getCollection= function(callback) {
  this.db.collection('urls', function(error, url_collection) {
    if( error ) callback(error);
    else callback(null, url_collection);
  });
};


URLProvider.prototype.save = function(urls, callback) {
    this.getCollection(function(error, url_collection) {
      if( error ) return callback(error)
    else {
      if( typeof(urls.length)=="undefined")
          urls = [urls];

        for( var i =0;i< urls.length;i++ ) {
          url = urls[i];
          url.created_at = new Date();          
        }

        url_collection.insert(urls, function() {
          console.log("BLAAAAAAAAAAA " + JSON.stringify(urls[0]));
          callback(null, urls[0]);
        });        
    }
  });
};

exports.URLProvider = URLProvider;