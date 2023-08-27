//http, socket.io, express servers / config.
const express = require("express");

//top-level Express function / an Express server instance.
//initialize a function handler supplied to an HTTP server.
const app = express();

//node.js http module's Server class.
//specify the requestListener function.
//https://nodejs.org/api/http.html#httpcreateserveroptions-requestlistener
const http = require("http").Server(app);


//user login by express-session
//https://expressjs.com/en/resources/middleware/session.html
const express_session = require("express-session");

app.use(express_session({
	secret: "https://expressjs.com/en/resources/middleware/session.html",
	resave: false,
	saveUninitialized: true
}));


//initialize a new server instance of socket.io by the HTTP server object.
//https://socket.io/get-started/chat
const socket_io = require("socket.io");
//Singleton
let io = null;
//NOTE: server's server io instance & socket instance, client's socket are all distinct
const get_socket_io_instance = function(){
	if(io === null){
		io = socket_io(http);
	}

	return io;
};

const get_express_app_instance = function(){
	if(app === null){
		app = express();
	}

	return app;
};

const port = 3000

get_socket_io_instance().on("connection", (socket) => {
	console.log("socket.io server got a new \"connection\" event.");

	//NOTE: client's socket instance is not server's socket.io io server/socket instances.
	//NOTE: client may not have server's socket.io io server instance,
	//NOTE: so io.on(...) outside of this connection event may not work.
});

//node.js http module.
//https://nodejs.org/api/http.html#serverlisten
http.listen(port, () => {
	console.log(`socket.io server running on ${port}`);
});

//module.exports = {get_socket_io_instance_fn, hi:"heelo"};
//module.exports.get_socket_io_instance_fn = get_socket_io_instance_fn;
module.exports = {app, get_socket_io_instance, get_express_app_instance};
