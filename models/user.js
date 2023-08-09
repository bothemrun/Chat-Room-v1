//MVC: user model
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("message_db.db");

class User{
	constructor(username, password){
		this.username = username;
		this.password = password;
	}
	
	//@return {number}: 0: success. 1: username conflict. 2: errors.
	async register(){
		console.log("[models/user.js: User.register()].");
		try{
			await db.all(`SELECT * FROM accounts WHERE username = \"${ this.username }\"`, (err, account_rows) => {
				const username_conflict = account_rows.length !== 0;
				if(username_conflict === true) return 1;
			});

			await db.run("INSERT INTO accounts VALUES(?, ?)", this.username, this.password);
		}catch(err){
			console.log("[error] [models/user.js User.register()].");
			return 2;
		}

		return 0;
	}

	login(){
	}

	logout(){
	}
}

module.exports = {User};
