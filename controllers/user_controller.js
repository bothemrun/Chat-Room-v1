//user_controller.js
//MVC Models
const User_Model = require("../models/user_model").User_Model;

class User_Controller{
	constructor(){
		this.active_username_map = new Map();
	}

	async register(req, res){
		console.log();
		console.log("sever POST register: got a register (username, password): (" + req.body.username + ", " + req.body.password + ").");

		const user = new User_Model(req.body.username, req.body.password);
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

	async login(req, res){
		console.log();
		console.log("sever POST login: got a login (username, password): (" + req.body.username + ", " + req.body.password + ").");

		const user = new User_Model(req.body.username, req.body.password);
		try{
			await user.login(req);
		}catch(err){
			console.log("[error] [server.js: app.post /login]" + err);
			console.log("active_username_map: " + Array.from(this.active_username_map) );

			res.status(401);
			res.json({
				"login": "login fail"
			});

			return;
		}

		console.log("login(): ok");
		console.log("req.session.username: " + req.session.username);
		console.log("req.session.password: " + req.session.password);

		let login_cnt = this.active_username_map.get(req.body.username);
		this.active_username_map.set(req.body.username, (login_cnt)? (login_cnt+1):1 );
		console.log("active_username_map: " + Array.from(this.active_username_map) );

		res.status(200);
		res.json({
			"login": "success"
		});
	}

	async logout(req, res){
		console.log();
		console.log("sever POST logout: got a logout (username, password): (" + req.session.username + ", " + req.session.password + ").");

		try{
			let login_cnt = this.active_username_map.get(req.session.username);
			if(this.active_username_map.has(req.session.username) === false || login_cnt <= 0)
				throw "active_username_map logout wrong.";

			login_cnt = login_cnt - 1;
			this.active_username_map.set(req.session.username, login_cnt);
			if(login_cnt === 0) this.active_username_map.delete(req.session.username);
		}catch(err){
			console.log("[error] [server.js: app.post /logout active_username_map]" + err);
			throw err;
		}
		console.log("active_username_map: " + Array.from(this.active_username_map) );

		const user = new User_Model(req.session.username, req.session.password);
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
}

module.exports = {User_Controller};
