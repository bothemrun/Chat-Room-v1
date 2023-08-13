const express = require("express");
const network = require("./server/network");
const app = network.app;
const io = network.get_socket_io_instance_fn();

//router-level middleware
const user_router = require("./routes/user").router;
const Chat_Room_Router = require("./routes/chat_room").Chat_Room_Router;
const chat_room_router = new Chat_Room_Router(io);

//MVC Views
const chat_room_view = require("./views/chat_room_view");


const auth = require("./util/authentication").Authentication;

//user login by express-session
//https://expressjs.com/en/resources/middleware/session.html
const session = require("express-session");

app.use(session({
	secret: "https://expressjs.com/en/resources/middleware/session.html",
	resave: false,
	saveUninitialized: true
}));

//root-level middleware logger
app.use((req, res, next) => {
	console.log("*******************http request********************");

	//NOTE: crucial: hangs without it.
	next();
});

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

//TODO: homepage routes
//HTTP GET. a function handler for the home page.
//app.get("/", auth.is_authenticated_redirect_login.bind(auth), (req, res) => {
app.get("/", (...args) => auth.is_authenticated_redirect_login(...args), (req, res) => {
	chat_room_view.chat_room(res);
});

app.use(user_router);
app.use(chat_room_router.router);

