//MVC: user model
const Status_Code = require("../util/status_code");
const DB_Promise = require("../dao/db_promise");

const auth = require("../util/authentication.js").Authentication;

class User_Model{
	constructor(username, password){
		this.username = username;
		this.password = password;
	}
	
	async register(){
		console.log("[models/user.js: User.register()].");

		try{
			await DB_Promise.db_run(`INSERT INTO users VALUES(\"${ this.username }\", \"${ this.password }\")`);
		}catch(err){
			console.log("[error] register(): " + err + Status_Code.USERNAME_CONFLICT);
			throw err + Status_Code.USERNAME_CONFLICT;
		}

		console.log("register(): success.");
	}

	async authenticate(username, password){
		let user_rows = undefined;
		try{
			user_rows = await DB_Promise.db_all(`SELECT * FROM users WHERE username = \"${ this.username }\" AND password = \"${ this.password }\"`);
		}catch(err){
			console.log("[error] User.authenticate(): " + err);
			throw err;
		}

		if(user_rows.length === 0){
			throw Status_Code.AUTHENTICATION_FAIL;
		}
	}

	async login(req){
		console.log("[models/user.js: User.login()].");

		try{
			await this.authenticate(this.username, this.password);
			await auth.add_session(req);
		}catch(err){
			console.log("[failed] User.login(): " + err);
			throw err;
		}
	}

	async logout(req){
		console.log("[models/user.js: User.logout()].");
		if(auth.is_logged_in(req) === false){
			console.log("[error] User.logout() username not in session.");
			throw Status_Code.LOGOUT_FAIL;
		}

		try{
			await this.authenticate(this.username, this.password);
			await auth.delete_session(req);
		}catch(err){
			console.log("[failed] User.logout(): " + err);
			throw err;
		}
	}

	static async username_exist(username){
		let user_rows = undefined;
		try{
			user_rows = await DB_Promise.db_all(`SELECT * FROM users WHERE username = \"${ username }\"`);
		}catch(err){
			console.log("[error] User.username_exist(): " + err);
			throw err;
		}

		return user_rows.length !== 0;
	}
}

module.exports = {User_Model};
