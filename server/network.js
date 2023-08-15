//http, socket.io, express servers / config.
const express = require("express");

//top-level Express function / an Express server instance.
//initialize a function handler supplied to an HTTP server.
const app = express();

//node.js http module's Server class.
//specify the requestListener function.
//https://nodejs.org/api/http.html#httpcreateserveroptions-requestlistener
const http = require("http").Server(app);

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

//socket.io middleware
//TODO: https://socket.io/docs/v4/middlewares/#compatibility-with-express-middleware
/*
get_socket_io_instance().use((socket, next) => {
	console.log("*************socket.io server event****************");

	next();
});
*/
get_socket_io_instance().engine.use((req, res, next) => {
	console.log("*************socket.io server event****************");

	next();
});


const socket_id2room_id = new Map();
get_socket_io_instance().on("connection", (socket) => {
	console.log("socket.io server got a new \"connection\" event.");

	//NOTE: client's socket instance is not server's socket.io io server/socket instances.
	//NOTE: client may not have server's socket.io io server instance,
	//NOTE: so io.on(...) outside of this connection event may not work.
	socket.on("set room_id", async (room_id) => {
		console.log("socket.io server got a \"set room_id\" event, with room_id=" + room_id);

		for(const [key, val] of socket_id2room_id.entries()){
			await socket.leave(val);
			socket_id2room_id.delete(key);
		}
		
		await socket.join(room_id);
		socket_id2room_id.set(socket.id, room_id);
		console.log( [...socket_id2room_id.entries()] );
		console.log(socket.rooms);

		if(socket.rooms.size !== 2){
			console.log();
			console.log("!!!!!!!!!!!!!!!!!!");
			console.log("!!!!!!!!!!!!!!!!!!");
			console.log("[error] [server/netwwork.js: socket.on(set room_id)]: socket.rooms.size !== 2");
			console.log();

			throw "[error] [server/netwwork.js: socket.on(set room_id)]: socket.rooms.size !== 2";
		}
	});
});

//node.js http module.
//https://nodejs.org/api/http.html#serverlisten
http.listen(port, () => {
	console.log(`socket.io server running on ${port}`);
});

//module.exports = {get_socket_io_instance_fn, hi:"heelo"};
//module.exports.get_socket_io_instance_fn = get_socket_io_instance_fn;
module.exports = {app, get_socket_io_instance, get_express_app_instance};
