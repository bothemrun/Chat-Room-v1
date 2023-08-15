//http, socket.io, express servers / config.
const express = require("express");

//top-level Express function / an Express server instance.
//initialize a function handler supplied to an HTTP server.
const app = express();

//node.js http module's Server class.
//specify the requestListener function.
//https://nodejs.org/api/http.html#httpcreateserveroptions-requestlistener
const http = require("http").Server(app);

//initialize a new instance of socket.io by the HTTP server object.
//https://socket.io/get-started/chat
const socket_io = require("socket.io");
//Singleton
let io = null;

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
	console.log("socket.io server got a new connection.");
	/*
	console.log("socket object:");
	console.log(socket);
	console.log("socket.data:");
	console.log(socket.data);
	console.log("socket.data.room_id:" + socket.data.room_id);
	*/
});

//TODO
get_socket_io_instance().on("ci", (socket) => {
	console.log("socket.io server get a \"client init\" event, with emit data: room_id=");
});

//node.js http module.
//https://nodejs.org/api/http.html#serverlisten
http.listen(port, () => {
	console.log(`socket.io server running on ${port}`);
});

//module.exports = {get_socket_io_instance_fn, hi:"heelo"};
//module.exports.get_socket_io_instance_fn = get_socket_io_instance_fn;
module.exports = {app, get_socket_io_instance, get_express_app_instance};
