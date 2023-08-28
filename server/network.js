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

let sessionStore = null;
//TODO: why session store can't use singleton instance getter?

app.use(express_session({
	store: ( sessionStore = new express_session.MemoryStore() ),
	secret: "https://expressjs.com/en/resources/middleware/session.html",
	resave: false,
	saveUninitialized: true
}));

//for MVC layer architecture, only controllers access models.
const Room_Model = require("../controllers/room_controller").Room_Model;

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

get_socket_io_instance().on("connection", async (socket) => {
	console.log("socket.io server got a new \"connection\" event.");

	//NOTE: client's socket instance is not server's socket.io io server/socket instances.
	//NOTE: client may not have server's socket.io io server instance,
	//NOTE: so io.on(...) outside of this connection event may not work.
	console.log(socket.request.headers.cookie);
	const sessionID = socket.request.headers.cookie.split("=")[1].split(".")[0].split("%3A")[1];
	console.log("socket.io: parsed sessionID:" + sessionID);
	console.log(sessionStore);
	sessionStore.get(sessionID, async function(err, session){
		console.log(`socket.io: session get from sessionStore (username=${ session.username }) :`);
		console.log(session);

		const rooms = await Room_Model.get_all_rooms_by_username(session.username);
		console.log("socket.io: before join():" + JSON.stringify( Array.from(socket.rooms) ) );
		for(const room of rooms){
			await socket.join(room.room_id);
		}
		console.log("socket.io: after join():" + JSON.stringify( Array.from(socket.rooms) ) );
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
