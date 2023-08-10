const express = require("express");

//top-level Express function / an Express server instance.
//initialize a function handler supplied to an HTTP server.
const app = require("express")();

//node.js http module's Server class.
//specify the requestListener function.
//https://nodejs.org/api/http.html#httpcreateserveroptions-requestlistener
const http = require("http").Server(app);

//initialize a new instance of socket.io by the HTTP server object.
//https://socket.io/get-started/chat
const io = require("socket.io")(http);
const port = 3000

//Sets the execution mode to verbose to produce long stack traces.
//https://github.com/TryGhost/node-sqlite3/wiki/API
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("message_db.db");

const User = require("./models/user").User;

//user login by express-session
//https://expressjs.com/en/resources/middleware/session.html
const session = require("express-session");

app.use(session({
	secret: "https://expressjs.com/en/resources/middleware/session.html",
	resave: false,
	saveUninitialized: true
}));


//https://stackoverflow.com/questions/28362909/how-do-i-restrict-the-user-from-accessing-the-static-html-files-in-a-expressjs-n
app.use((req, res, next) => {
	if(req.path.indexOf(".html") >= 0){
		console.log("server restricts access to html static files: " + req.path);
		res.redirect("/");
	}
	next();
});

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

//TODO: move to auth class ?
//user login by express-session
//https://expressjs.com/en/resources/middleware/session.html
function is_authenticated(req, res, next){
	//error: browser: cannot GET /
	if(req.session.user) next();
	else{
		console.log("server directs client to /login.html");
		res.sendFile(__dirname + "/public/login.html");
		return;
		//error: browswer: cannot GET / , since no next router for /
		//next("route");
	};
}

//Express Routing guide:
//https://expressjs.com/en/guide/routing.html

//Routing refers to determining how an application responds to a client request to a particular endpoint, which is a URI (or path) and a specific HTTP request method (GET, POST, and so on).
//https://expressjs.com/en/starter/basic-routing.html

//HTTP GET. a function handler for the home page.
app.get("/", is_authenticated, (req, res) => {
	console.log("server directs client to /chat.html");
	res.sendFile(__dirname + "/public/chat.html");
});


//HTTP POST. chats.
app.post("/messages", (req, res) => {
	console.log();
	console.log("server got HTTP POST /messages request.");
	console.log("from req.session.user:" + req.session.user);

	const timestamp_utc = (new Date()).toUTCString();

	//socket.io emit the event to all clients
	io.emit("new chat message", req.body.message, timestamp_utc, req.session.user);


	//Contains key-value pairs of data submitted in the request body. By default, it is undefined, and is populated when you use body-parsing middleware such as express.json()
	//https://expressjs.com/en/api.html#req.body
	console.log(req.body);
	console.log("experss POST: server got a new message:" + req.body.message + ", on timestamp_utc:" + timestamp_utc);

	//run the SQL query with the param.
	//https://github.com/TryGhost/node-sqlite3/wiki/API
	db.run("INSERT INTO messages VALUES(?, ?, ?)", req.body.message, timestamp_utc, req.session.user);

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
//restrict unlogged-in client to access router /messages for chat logs.
app.get("/messages", is_authenticated, (req, res) => {
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

	//TODO: should res.status() before res.json() ?
	//Sets the HTTP status for the response.
	//https://expressjs.com/en/api.html#res.status
	res.status(200);
});


//HTTP POST. register.
app.post("/register", async (req, res) => {
	console.log();
	console.log("sever POST register: got a register (username, password): (" + req.body.username + ", " + req.body.password + ").");

	const user = new User(req.body.username, req.body.password);
	try{
		await user.register();
	}catch(err){
		console.log("[error] [server.js: app.post /register]" + err);
		res.status(400);
		res.json({
			"register":"error."
		});
		
		//TODO: NOTE: must return. or will go the next lines outside the catch block.
		console.log("register(): after res.json(), before return;");
		return;
	}

	res.status(201);
	res.json({
		"register":"success"
	});
});


//HTTP POST. login
app.post("/login", async (req, res) => {
	console.log();
	console.log("sever POST login: got a login (username, password): (" + req.body.username + ", " + req.body.password + ").");

	const user = new User(req.body.username, req.body.password);
	try{
		await user.login(req);
	}catch(err){
		console.log("[error] [server.js: app.post /login]" + err);
		res.status(401);
		res.json({
			"login": "login fail"
		});

		//TODO
		console.log("login(): after res.json(), before return;");
		return;
	}

	console.log("login(): ok");
	console.log("req.session.user: " + req.session.user);
	res.status(200);
	res.json({
		"login": "success"
	});
});


//HTTP POST. logout
app.post("/logout", async (req, res) => {
	console.log();
	console.log("sever POST logout: got a logout (username, password): (" + req.body.username + ", " + req.body.password + ").");

	const user = new User(req.body.username, req.body.password);
	try{
		await user.logout(req);
	}catch(err){
		console.log("[error] [server.js: app.post /logout]" + err);
		res.status(400);
		res.json({
			"logout": "logout fail"
		});

		//TODO
		console.log("logout(): after res.json(), before return;");
		return;
	}

	console.log("logout(): ok");
	res.status(200);
	res.json({
		"logout": "success"
	});
});



//socket.io emit the event
io.on("connection", (socket) => {
	console.log("socket.io server got a new connection.");
});

//node.js http module.
//https://nodejs.org/api/http.html#serverlisten
http.listen(port, () => {
	console.log(`socket.io server running on ${port}`);
});

