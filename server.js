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

//MVC Models
const Chat_Room = require("./models/chat_room").Chat_Room;
const public_chat_room = new Chat_Room();

//MVC Views
const login_page_view = require("./views/login_page_view");
const chat_room_view = require("./views/chat_room_view");

//MVC Controllers
const user_controller = require("./controllers/user_controller");

const auth = require("./util/authentication").Authentication;

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


//TODO: move to models.
//can have duplicate logged-in users.
active_username_set = new Set();

//TODO: move to auth class ?
//user login by express-session
//https://expressjs.com/en/resources/middleware/session.html
function is_authenticated_redirect_login(req, res, next){
	//error: browswer: cannot GET / , since no next router for /
	if(auth.is_logged_in(req) === true) next();
	else{
		login_page_view.login_page(res);

		return;
	};
}

//Express Routing guide:
//https://expressjs.com/en/guide/routing.html

//Routing refers to determining how an application responds to a client request to a particular endpoint, which is a URI (or path) and a specific HTTP request method (GET, POST, and so on).
//https://expressjs.com/en/starter/basic-routing.html

//HTTP GET. a function handler for the home page.
app.get("/", is_authenticated_redirect_login, (req, res) => {
	chat_room_view.chat_room(res);
});


//HTTP POST. chats.
app.post("/messages", async (req, res) => {
	console.log();
	console.log("server got HTTP POST /messages request.");
	console.log("from req.session.username:" + req.session.username);

	const timestamp_utc = (new Date()).toUTCString();

	//socket.io emit the event to all clients
	io.emit("new chat message", req.body.message, timestamp_utc, req.session.username);


	//Contains key-value pairs of data submitted in the request body. By default, it is undefined, and is populated when you use body-parsing middleware such as express.json()
	//https://expressjs.com/en/api.html#req.body
	console.log(req.body);
	console.log("experss POST: server got a new message:" + req.body.message + ", on timestamp_utc:" + timestamp_utc);

	try{
		await public_chat_room.save_chat_message(req.body.message, timestamp_utc, req.session.username);
	}catch(err){
		console.log("[error] [server.js app.post /messages save_chat_message()]: " + err);
		res.status(500);
		res.json({
			"messages": "database error."
		});
		return;
	}

	res.status(201);
	res.json({
		"messages":true
	});
});


//HTTP GET. chats.
//restrict unlogged-in client to access router /messages for chat logs.
app.get("/messages", is_authenticated_redirect_login, async (req, res) => {
	console.log();
	console.log("server got HTTP GET /messages request.");

	console.log("client asks for messages.");

	let msgs;
	try{
		msgs = await public_chat_room.get_all_chat_messages();
	}catch(err){
		console.log("[error] [server.js app.get /messages get_all_chat_messages()]: " + err);
		res.status(500);
		res.json({
			"data": "database error."
		});
		return;
	}

	res.status(200);
	res.json({
		"data": msgs
	});
});


//HTTP POST. register.
app.post("/register", user_controller.register);

//HTTP POST. login
app.post("/login", user_controller.login);

//HTTP POST. logout
app.post("/logout", user_controller.logout);



//socket.io emit the event
io.on("connection", (socket) => {
	console.log("socket.io server got a new connection.");
});

//node.js http module.
//https://nodejs.org/api/http.html#serverlisten
http.listen(port, () => {
	console.log(`socket.io server running on ${port}`);
});

