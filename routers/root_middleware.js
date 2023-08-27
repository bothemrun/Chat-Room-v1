//root-level middleware, built-in middlewares
const express = require("express");
const path = require("path");
const auth = require("../util/authentication").Authentication;
const app = require("../server/network").app;

//user login by express-session
//https://expressjs.com/en/resources/middleware/session.html
const express_session = require("express-session");

//TODO: session store
let sessionStore = null;
/*
const get_sessionStore_instance = async function(){
	if(sessionStore === null) sessionStore = await new express_session.MemoryStore();
	return sessionStore;
};
get_sessionStore_instance();
console.log(sessionStore);
*/

app.use(express_session({
	store: ( sessionStore = new express_session.MemoryStore() ),
	//store: get_sessionStore_instance(), //TODO: session store
	secret: "https://expressjs.com/en/resources/middleware/session.html",
	resave: false,
	saveUninitialized: true,
}));

console.log(sessionStore);
//console.log(get_sessionStore_instance());

//root-level middleware logger
app.use((req, res, next) => {
	console.log("*******************http request********************");

	/*
	sessionStore.all(function(err, sessions){
		console.log("all sessions in sessionStore:");
		console.log(sessions);
	});

	console.log(sessionStore);
	console.log(`req.sessionID, with type:${ typeof req.sessionID } :`);
	*/
	console.log(req.sessionID);
	console.log("req.session:" + JSON.stringify( req.session ) );
	sessionStore.get(req.sessionID, function(err, session){
		console.log("session get from sessionStore:");
		console.log(session);
	});

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
app.use(express.static( path.join(__dirname, "..", "public") ));

//mounts express.js builtin middleware in Express that parses incoming requests with JSON payloads.
//Returns middleware that only parses JSON and only looks at requests where the Content-Type header matches the type option. 
//a new body object containing the parsed data is populated on the request object after the middleware (i.e. req.body).
//https://expressjs.com/en/api.html#express.json
app.use(express.json());

module.exports = {sessionStore};
