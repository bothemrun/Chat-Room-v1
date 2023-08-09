//MVC: user model

const Error_Code = require("../util/error_code");
const DB_Promise = require("../util/db_promise");

class User{
	constructor(username, password){
		this.username = username;
		this.password = password;
	}
	
	async register(){
		console.log("[models/user.js: User.register()].");

		//TODO: use SQL primary key. only use SQL INSERT without SQL SELECT
		//TODO: sqlite3 doesn't support Promise, can't use await. maybe use sqlite?
		try{
			await DB_Promise.db_run(`INSERT INTO accounts VALUES(\"${ this.username }\", \"${ this.password }\")`);
		}catch(err){
			console.log("[error] register(): " + err);
			throw err;
		}

		console.log("register(): success.");

		/*
		let account_rows;
		try{
			account_rows = await db_all(`SELECT * FROM accounts WHERE username = \"${ this.username }\"`);
		}catch(err){
			console.log("[error] db_all error:" + err);
			throw Error_Code.DATABASE_ERROR;
		}

		if(account_rows.length !== 0){
			//username conflict
			console.log("register() username conflict!!");
			throw Error_Code.USERNAME_CONFLICT;
		}else{
			//TODO: promise
			db.run("INSERT INTO accounts VALUES(?, ?)", this.username, this.password);
			return;
		}
		*/
	}

	login(){
	}

	logout(){
	}
}

module.exports = {User};
