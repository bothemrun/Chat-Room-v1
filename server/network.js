//http, socket.io, express servers / config.
const express = require("express");

//top-level Express function / an Express server instance.
//initialize a function handler supplied to an HTTP server.
const app = express();

//node.js http module's Server class.
//specify the requestListener function.
//https://nodejs.org/api/http.html#httpcreateserveroptions-requestlistener
const http = require("http").Server(app);

//TODO
const sessionStore = require("../routers/root_middleware").sessionStore;

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
	console.log("on connection event, cookie:");
	console.log(socket.request.headers.cookie);

	const sessionID = socket.request.headers.cookie.split(".")[0].split("%3")[1];
	console.log("socket.io: parsed sessionID:" + sessionID);

	console.log("socket.io: sessionStore:");
	console.log(sessionStore);
	sessionStore.get(sessionID, function(err, session){
		console.log("socket.io: session get from sessionStore:");
		console.log(session);
	});


	//TODO
	//get_socket_io_instance().on("ci", (socket) => {
	socket.on("ci socket", () => {
		console.log("socket.io server got a \"ci socket\" event, socket:");
		console.log("on ci socket event, cookie:");
		console.log(socket.request.headers.cookie);

		//TODO: console.log(socket);

		console.log("query key:" + socket.handshake.query.my_query_key);
		//console.log("data key:" + socket.data.my_data_key);
	});

	//TODO:
	socket.on("set room_id", (client_room_id) => {
		console.log("socket.io server got a \"set room_id\" event, with client_room_id:" + client_room_id);
		console.log("on set room_id event, cookie:");
		console.log(socket.request.headers.cookie);
	});
});
//TODO: can't get emit events from clients, since client doesn't have to socket.io server io instance.
//note that server side's server instance & socket instance, and client side's socket instance are all distinct.
get_socket_io_instance().on("ci server", (socket) => {
	console.log("socket.io server got a \"ci server\" event, socket:");
	console.log(socket);
});

//node.js http module.
//https://nodejs.org/api/http.html#serverlisten
http.listen(port, () => {
	console.log(`socket.io server running on ${port}`);
});

//module.exports = {get_socket_io_instance_fn, hi:"heelo"};
//module.exports.get_socket_io_instance_fn = get_socket_io_instance_fn;
module.exports = {app, get_socket_io_instance, get_express_app_instance};
