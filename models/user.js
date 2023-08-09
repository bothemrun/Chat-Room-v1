//MVC: user model
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("message_db.db");

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
	
	//@return {number}: 0: success. 1: username conflict. 2: errors.
	async register(){
		console.log("[models/user.js: User.register()].");

		//TODO: sqlite3 doesn't support Promise, can't use await. maybe use sqlite?
		let account_rows;
		try{
			account_rows = await db_all(`SELECT * FROM accounts WHERE username = \"${ this.username }\"`);
		}catch(err){
			console.log("[error] db_all error:" + err);
			return 2;
		}
		
		const username_conflict = account_rows.length !== 0;
		if(username_conflict === true){
			console.log("register() username conflict!!");
			return 1;
		}else{
			db.run("INSERT INTO accounts VALUES(?, ?)", this.username, this.password);
			return 0;
		}
	}

	login(){
	}

	logout(){
	}
}

module.exports = {User};
