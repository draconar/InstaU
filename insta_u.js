var http = require('http'),
	sys = require('sys'),
	//static = require('node-static/lib/static'), /* BAIXAR */
	url = require('url'),
	requestHandlers = require('./requestHandlers'),
	express = require('express'),
	redis = require('redis'),
	rc = redis.createClient(),
	io = require('socket.io');
	
	
/* constructor function */
function InstaU(options) {
	if(! (this instanceof arguments.callee)) {
		return new arguments.callee(arguments);
	}
	
	var self = this;
	
	self.settings = {
		port: options.port
	};
	
	self.handles = {};
		self.handles["/"] = requestHandlers.root;
		self.handles['/save.new'] = requestHandlers.saveNew;
		self.handles['/save.db'] = requestHandlers.saveDB;
		//self.handles["/start"] = requestHandlers.start;
		//self.handles["/upload"] = requestHandlers.upload;
		//self.handles["/show"] = requestHandlers.show;
	
	self.init();
};

InstaU.prototype.init = function() {
	var self = this;
	
	self.httpServer = self.createHTTPServer(this.router, this.handles);
	self.configHTTPServer(self.httpServer);
	self.httpServer.listen(self.settings.port);
	sys.log('Server started on PORT ' + self.settings.port);
	
	/*serve socket.io*/
	//var socket_io = io.listen(self.httpServer);	
	//this.configRedis(socket_io);	
	
		
};
/*
InstaU.prototype.configRedis = function(socket) {
	
	rc.on("error", function (err) {
		console.log("Error " + err);
	});
	
	rc.on('connect', function(channel, count){
		rc.subscribe('query_curl');
		console.log('subscribing to curl ...');
		//we could subscribe to more channels here
	});
	/* when we get a message in one of the channels we are subscribed to,
	  we send messages ... 
	rc.on('message', function(channel, msg){
		console.log("sending: " + msg + " in channel " + channel);
		socketio.sockets.emit('message', message);
	});
	
	
}*/


InstaU.prototype.configHTTPServer = function(server){
	server.set('views', __dirname + '/views');
	server.set('view engine', 'jade');
	server.use(express.bodyParser());
	server.use(express.methodOverride());
	server.use(require('stylus').middleware({ src: __dirname + '/public' }));
	server.use(server.router);
	server.use(express.static(__dirname + '/public'));
	this.configHandlers(server, this.handles);
	
};

InstaU.prototype.configHandlers = function (server, handles) {
	for(h in handles)	{
		if (handles[h].httpMethod === 'GET'){
			if (typeof handles[h] === 'function') {
				server.get(h, handles[h]);
			}		
		} else if (handles[h].httpMethod === 'POST') {
			if (typeof handles[h] === 'function') {				
				server.post(h, handles[h]);
			}		
		}
		
	}
}

InstaU.prototype.createHTTPServer = function(route, handles) {
	var self = this;
	function onRequest(req, res) {
		var pathname = url.parse(req.url).pathname;
		console.log("Request for " + pathname + " received");
		
		route(handles, pathname, res, req); // pathname = /start, /upload, etc
			// here is a dependency injection viz. http://martinfowler.com/articles/injection.html			
		
	}
	var server = express.createServer();
	return server;	
}

InstaU.prototype.router = function(handles, pathname, serverResponse, request) {
	console.log("about to route a request for " + pathname);
	
	if(typeof handles[pathname] === 'function'){
		handles[pathname](serverResponse, request);
	} else {
		console.log("no request handler found for " + pathname);
		res.writeHead(404,{"Content-Type": "text/plain"});
		res.write("404 - not FOUND");
		res.end();
	}
}

module.exports = InstaU;


