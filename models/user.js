//MVC: user model
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("message_db.db");

const Error_Code = require("../util/error_code");

//await wrapper for sqlite3
//TODO: sqlite3 doesn't support Promise, can't use await. maybe use sqlite?
async function db_all(query){
	return new Promise(function(resolve, reject){
		db.all(query, function(err, rows){
			if(err){
				reject(err);
			}else{
				resolve(rows);
			}
		});
	});
}

class User{
	constructor(username, password){
		this.username = username;
		this.password = password;
	}
	
	async register(){
		console.log("[models/user.js: User.register()].");

		//TODO: use SQL primary key. only use SQL INSERT without SQL SELECT
		//TODO: sqlite3 doesn't support Promise, can't use await. maybe use sqlite?
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
	}

	login(){
	}

	logout(){
	}
}

module.exports = {User};
