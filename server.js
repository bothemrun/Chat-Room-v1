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


//all logged-in users.
//can have duplicate logged-in users.
active_username_set = new Set();



//Express Routing guide:
//https://expressjs.com/en/guide/routing.html

//Routing refers to determining how an application responds to a client request to a particular endpoint, which is a URI (or path) and a specific HTTP request method (GET, POST, and so on).
//https://expressjs.com/en/starter/basic-routing.html

//HTTP GET. a function handler for the home page.
app.get("/", (req, res) => {
	res.sendFile(__dirname + "/public/chat.html"); //TODO: login.html
});

//HTTP POST. chats.
app.post("/messages", (req, res) => {
	console.log();
	console.log("server got HTTP POST /messages request.");

	const timestamp_utc = (new Date()).toUTCString();

	//socket.io emit the event to all clients
	io.emit("new chat message", req.body.message, timestamp_utc);


	//Contains key-value pairs of data submitted in the request body. By default, it is undefined, and is populated when you use body-parsing middleware such as express.json()
	//https://expressjs.com/en/api.html#req.body
	console.log(req.body);
	console.log("experss POST: server got a new message:" + req.body.message + ", on timestamp_utc:" + timestamp_utc);

	//run the SQL query with the param.
	//https://github.com/TryGhost/node-sqlite3/wiki/API
	db.run("INSERT INTO messages VALUES(?, ?)", req.body.message, timestamp_utc);

	//Sets the HTTP status for the response.
	//https://expressjs.com/en/api.html#res.status
	res.status(201);

	//Sends a JSON response.
	//This method sends a response (with the correct content-type) that is the parameter converted to a JSON string using JSON.stringify().
	//The parameter can be any JSON type, including object, array, string, Boolean, number, or null, and you can also use it to convert other values to JSON.
	//https://expressjs.com/en/api.html#res.status
	res.json({
		"message":true
	});
});


//HTTP GET. chats.
app.get("/messages", (req, res) => {
	console.log();
	console.log("server got HTTP GET /messages request.");

	console.log("client asks for messages.");

	msgs = []

	//run the SQL query with the callback function.
	//https://github.com/TryGhost/node-sqlite3/wiki/API
	db.all("SELECT * FROM messages", (err, msg_rows) => {
		for(let msg of msg_rows){
			console.log(msg);
			msgs.push(msg);
		}

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

	//TODO: should res.status() before res.json() ?
	//Sets the HTTP status for the response.
	//https://expressjs.com/en/api.html#res.status
	res.status(200);
});


//HTTP POST. register.
app.post("/register", (req, res) => {
	console.log();
	console.log("server got HTTP POST register request.");

	console.log(req.body);
	console.log("sever POST register: got a register (username, password): (" + req.body.username + ", " + req.body.password + ").");

	//get all account usernames
	db.all("SELECT * FROM accounts", (err, account_rows) => {
		username_conflict = false;

		for(let account of account_rows){
			if(account.username === req.body.username){
				console.log("register: username conflict.");
				username_conflict = true;
				break;
			}
		}

		//callback hell: javascript uses nonblocking I/O.
		if(username_conflict === true){
			console.log("register: username conflict.");
			res.status(400);
			res.json({
				"register":"username conflict"
			});
			return;
		}

		console.log("register: successful.");
		db.run("INSERT INTO accounts VALUES(?, ?)", req.body.username, req.body.password);
		res.status(201);
		res.json({
			"register":"success"
		});
	});

});


//HTTP POST. login
app.post("/login", (req, res) => {
	console.log();
	console.log("server got an HTTP POST /login request.");

	db.all("SELECT * FROM accounts", (err, account_rows) => {
		for(let account of account_rows){
			if(account.username === req.body.username){
				username_found = true;
				if(account.password === req.body.password){
					if(active_username_set.has(req.body.username) === true){
						console.log("login: user already logged in.");
						console.log("active username set: " + Array.from(active_username_set) );

						res.status(400);
						res.json({
							"login":"already logged in"
						});
						return;
					}

					console.log("login: " + req.body.username + " successful");

					active_username_set.add(req.body.username);
					console.log("active username set: " + Array.from(active_username_set) );

					res.status(200);
					res.json({
						"login":"success"
					});

					//TODO: redirect to the chat room page.

					return;
				}else{
					console.log("login: password incorrect !!!");
					console.log("active username set: " + Array.from(active_username_set) );
					res.status(403);
					res.json({
						"login":"password incorrect"
					});

					return;
				}
			}
		}

		console.log("login: username not found !!!");
		console.log("active username set: " + Array.from(active_username_set) );
		res.status(401);
		res.json({
			"login":"username not found"
		});
	});
});


//HTTP POST. logout
app.post("/logout", (req, res) => {
	console.log();
	console.log("server got an HTTP POST /logout request.");

	if(active_username_set.has(req.body.username) === true){
		console.log("logout: success.");

		active_username_set.delete(req.body.username);
		console.log("active username set: " + Array.from(active_username_set) );

		res.status(200);
		res.json({
			"logout":"success"
		});

		//TODO: redirect to the login page.
	}else{
		console.log("logout: username not active.");
		console.log("active username set: " + Array.from(active_username_set) );

		res.status(400);
		res.json({
			"logout":"username not active"
		});
	}
});



//socket.io emit the event
io.on("connection", (socket) => {
	console.log("socket.io server got a new connection.");
});

//TODO: socket.io on connection & disconnect events.


//node.js http module.
//https://nodejs.org/api/http.html#serverlisten
http.listen(port, () => {
	console.log(`socket.io server running on ${port}`);
});


//TODO: express graceful shutdown: close http server & db.
