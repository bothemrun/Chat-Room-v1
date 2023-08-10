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


//MVC Views
const login_page_view = require("./views/login_page_view");
const chat_room_view = require("./views/chat_room_view");

//MVC Controllers
const user_controller = require("./controllers/user_controller");
const Chat_Room_Controller = require("./controllers/chat_room_controller").Chat_Room_Controller;
const public_chat_room_controller = new Chat_Room_Controller(io);


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

//HTTP GET. a function handler for the home page.
app.get("/", is_authenticated_redirect_login, (req, res) => {
	chat_room_view.chat_room(res);
});


//HTTP POST. chats.
//app.post("/messages", public_chat_room_controller.save_chat_message);
app.post("/messages", public_chat_room_controller.save_chat_message.bind(public_chat_room_controller));

//HTTP GET. chats.
//restrict unlogged-in client to access router /messages for chat logs.
app.get("/messages", is_authenticated_redirect_login, public_chat_room_controller.get_all_chat_messages);


//HTTP POST. register.
app.post("/register", user_controller.register);

//HTTP POST. login
app.post("/login", user_controller.login);

//HTTP POST. logout
app.post("/logout", user_controller.logout);



io.on("connection", (socket) => {
	console.log("socket.io server got a new connection.");
});

//node.js http module.
//https://nodejs.org/api/http.html#serverlisten
http.listen(port, () => {
	console.log(`socket.io server running on ${port}`);
});

