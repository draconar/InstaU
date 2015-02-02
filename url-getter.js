var redis = require('redis'),
	sub_getURL = redis.createClient(), /******* PUB & SUB are different REDIS clients ******/
        sub_NLPreceived = redis.createClient(),
	pub = redis.createClient(),
	sys = require('sys'),
	exec = require('child_process').exec,
	NLP_CATEGORIES = ['URLGetCategory','URLGetRankedNamedEntities','URLGetRankedConcepts','URLGetRankedKeywords','URLGetText'],
	child = [];
        
        sub_getURL.on('connect', function(channel, count){
		sub_getURL.subscribe('query_curl');		
		console.log('subscribing to query_curl ...');
		//we could subscribe to more channels here
	});
	
	sub_NLPreceived.on('connect', function(channel, count){
		sub_NLPreceived.subscribe('curl_response');		
		console.log('subscribing to "curl_response" waiting curl ...');
		//we could subscribe to more channels here
	});
	
	/* when we get a message in one of the channels we are subscribed to,
	  we send messages ... */
	
	sub_getURL.on('message', function(channel, msg){
		msg = JSON.parse(msg);
		console.log("sending: " + msg.address + " in channel " + channel);
		//executes curl-alchemy
		for(var i = 0; i < NLP_CATEGORIES.length; i++){			
				child[i] = (function(w){ exec("./curl-alchemy.sh " + w + " " + msg.address, function (error, stdout, stderr) {
				json = JSON.parse(stdout);
				json.objInfo = {'id': w, 'name': NLP_CATEGORIES[w]};
				json = JSON.stringify(json); 
				pub.publish('curl_response', json);				
				if (error !== null) {
				  console.log('exec error: ' + error);
				}
			});})(i);
		}
		
	});
        
        sub_getURL.on("error", function (err) {
		console.log("Error " + err);
	});
	
	sub_NLPreceived.on('message', function(channel, msg){                
		//console.log("reading: " + JSON.parse(msg).url + " in channel " + channel);		
	
	var r = redis.createClient();
		r.stream.on( 'connect', function() {
			//r.incr( 'url:id:' , function( err, id ) {		
			s_msg = JSON.parse(msg);			
			r.hset( 'url:'+s_msg.url, s_msg.objInfo.name, msg, function() {} );
						
		 //});

        } );
	//sub_NLPreceived.set();		
	
	});
	
	
	sub_NLPreceived.on("error", function (err) {
		console.log("Error " + err);
	});
	

module.exports = pub;