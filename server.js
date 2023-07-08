const express = require("express");

//top-level Express function / an Express server instance.
//initialize a function handler supplied to an HTTP server.
const app = require("express")();//TODO: `express()`

//node.js http module's Server class.
//specify the requestListener function.
//https://nodejs.org/api/http.html#httpcreateserveroptions-requestlistener
const http = require("http").Server(app);//TODO: use socket.io example: createServer()

//initialize a new instance of socket.io by the HTTP server object.
//https://socket.io/get-started/chat
const io = require("socket.io")(http);
const port = 3000

//Sets the execution mode to verbose to produce long stack traces.
//https://github.com/TryGhost/node-sqlite3/wiki/API
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("message_db.db");

//why not use static("/")?
//the path that you provide to the express.static function is relative to the directory from where you launch your node process.
//so static("/") will find a folder called "/".
//https://expressjs.com/en/starter/static-files.html
//mounts middleware function in Express that allow express server instance to serve files under /public.
//https://expressjs.com/en/api.html#express.static
app.use(express.static(__dirname + "/public"));

//mounts express.js builtin middleware in Express that parses incoming requests with JSON payloads.
//Returns middleware that only parses JSON and only looks at requests where the Content-Type header matches the type option. 
//a new body object containing the parsed data is populated on the request object after the middleware (i.e. req.body).
//https://expressjs.com/en/api.html#express.json
app.use(express.json());



//Express Routing guide:
//https://expressjs.com/en/guide/routing.html

//Routing refers to determining how an application responds to a client request to a particular endpoint, which is a URI (or path) and a specific HTTP request method (GET, POST, and so on).
//https://expressjs.com/en/starter/basic-routing.html

//HTTP GET. a function handler for the home page.
app.get("/", (req, res) => {
	res.sendFile(__dirname + "/public/index.html");
});

//HTTP POST. chats.
app.post("/messages", (req, res) => {
	console.log();
	console.log("server got HTTP POST /messages request.");

	//TODO: res req property fields: body, status, json.

	console.log(req.body);
	console.log("experss POST: server got a new message:" + req.body.message);

	//run the SQL query with the param.
	//https://github.com/TryGhost/node-sqlite3/wiki/API
	db.run("INSERT INTO messages VALUES(?)", req.body.message);

	res.status(201);
	res.json({
		"message":true
	});
});

//HTTP GET. chats.
app.get("/messages", (req, res) => {
	console.log();
	console.log("server got HTTP GET /messages request.");

	console.log("client asks for messages.");

	res.status(200);
	msgs = []

	//run the SQL query with the callback function.
	//https://github.com/TryGhost/node-sqlite3/wiki/API
	db.all("SELECT * FROM messages", (err, msg_rows) => {
		msg_rows.forEach((msg) => {
			console.log(msg);
			msgs.push(msg);
		});

		console.log("print msgs:");
		console.log(msgs);

		//Sends a JSON response. This method sends a response (with the correct Content-Type) that is the parameter converted to a JSON string using JSON.stringify().
		//The parameter can be any JSON type, including object, array, string, Boolean, number, or null, and you can also use it to convert other values to JSON.
		//https://expressjs.com/en/4x/api.html#res.json
		res.json({
			"data":msgs
		});
	});

	//TODO: async await, promise
	/*console.log("print msgs:");
	console.log(msgs);
	res.json({
		"data":msgs
	});*/
});

//socket.io emit the event
io.on("connection", (socket) => {
	console.log("socket.io server got a new connection.");

	socket.on("new chat message", (new_msg) => {
		io.emit("new chat message", new_msg);
		console.log("socket.io: server got new message: " + new_msg);
	});
});

//TODO: socket.io on connection & disconnect events.


//node.js http module.
//https://nodejs.org/api/http.html#serverlisten
http.listen(port, () => {
	console.log(`socket.io server running on ${port}`);
});


//TODO: express graceful shutdown: close http server & db.
