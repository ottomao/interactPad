var sys = require("sys"),
    ws = require("ws"),
    http = require("http"),
    fs = require("fs");

var clients = [];

var WebSocketServer = require('ws').Server;
var wss = new WebSocketServer({port: 8088});

wss.on('connection', function(ws) {
	console.log("connected");
    ws.on('message', function(message) {
        
        ws.send("successfully received :" + message);
    	try{
    		message = message.split(",")[1];
    	}catch(e){}
    	if(message){
	        fs.writeFile("./test.png", message, "base64", function(err) {
				if(err) {
					console.log("err in saving" + err);
				} else {
					console.log("image saved!");
				}
			});    		
    	}else{
    		console.log('received: %s', message);
    	}

    });
    ws.send('connected');
});

sys.debug("Listening on port 8088");