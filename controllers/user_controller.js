//user_controller.js
//MVC Models
const User = require("../models/user").User;

async function register(req, res){
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
	
		//res.end() res.send() "ending request-response cycle" doesn't return from function.
		return;
	}

	res.status(201);
	res.json({
		"register":"success"
	});
}

async function login(req, res){
	console.log();
	console.log("sever POST login: got a login (username, password): (" + req.body.username + ", " + req.body.password + ").");

	const user = new User(req.body.username, req.body.password);
	try{
		await user.login(req);
	}catch(err){
		console.log("[error] [server.js: app.post /login]" + err);
		console.log("active_username_set: " + Array.from(active_username_set) );

		res.status(401);
		res.json({
			"login": "login fail"
		});

		return;
	}

	console.log("login(): ok");
	console.log("req.session.username: " + req.session.username);
	console.log("req.session.password: " + req.session.password);
	active_username_set.add(req.body.username);
	console.log("active_username_set: " + Array.from(active_username_set) );

	res.status(200);
	res.json({
		"login": "success"
	});
}

async function logout(req, res){
	console.log();
	console.log("sever POST logout: got a logout (username, password): (" + req.session.username + ", " + req.session.password + ").");

	active_username_set.delete(req.session.username);
	console.log("active_username_set: " + Array.from(active_username_set) );

	const user = new User(req.session.username, req.session.password);
	try{
		await user.logout(req);
	}catch(err){
		console.log("[error] [server.js: app.post /logout]" + err);
		res.status(400);
		res.json({
			"logout": "logout fail"
		});

		return;
	}

	console.log("logout(): ok");

	res.status(200);
	res.json({
		"logout": "success"
	});
}

module.exports = {register, login, logout};
