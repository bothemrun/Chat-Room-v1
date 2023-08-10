//MVC: user model
const Status_Code = require("../util/status_code");
const DB_Promise = require("../util/db_promise");

const Authentication = require("./authentication.js").Authentication;
const auth = new Authentication();

class User{
	constructor(username, password){
		this.username = username;
		this.password = password;
	}
	
	async register(){
		console.log("[models/user.js: User.register()].");

		try{
			await DB_Promise.db_run(`INSERT INTO accounts VALUES(\"${ this.username }\", \"${ this.password }\")`);
		}catch(err){
			console.log("[error] register(): " + err);
			throw err;
		}

		console.log("register(): success.");
	}

	async login(req){
		console.log("[models/user.js: User.login()].");

		let account_rows;
		try{
			account_rows = await DB_Promise.db_all(`SELECT * FROM accounts WHERE username = \"${ this.username }\" AND password = \"${ this.password }\"`);
		}catch(err){
			console.log("[error] login(): " + err);
			throw err;
		}

		if(account_rows.length === 0){
			throw Status_Code.LOGIN_FAIL;
		}

		try{
			await auth.login(req);
		}catch(err){
			console.log("[error] login() auth: " + err);
			throw err;
		}
	}

	async logout(req){
		console.log("[models/user.js: User.logout()].");
		if(auth.is_logged_in(req) === false){
			console.log("[error] logout() user not active in session.");
			throw Status_Code.LOGOUT_FAIL;
		}

		try{
			await auth.logout(req);
		}catch(err){
			console.log("[error] logout() auth: " + err);
			throw err;
		}
	}
}

module.exports = {User};
