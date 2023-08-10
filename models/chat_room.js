//MVC: chat room model
const DB_Promise = require("../util/db_promise");

class Chat_Room{
	constructor(){}

	async function get_all_chat_messages(){
		let msgs = [];
		try{
			msgs = await DB_Promise.db_all(`SELECT * FROM messages`);
		}catch(err){
			console.log("[error] Chat_Room.get_all_chat_logs(): " + err);
			throw err;
		}

		return msgs;
	}

	/*
	async function save_chat_message(new_msg, timestamp_utc, username){
		try{
			await DB_Promise.db_run(`INSERT INTO messages VALUES (\"${ new_msg }\", \"${ timestamp_utc }\", \"${ username }\")`);
		}catch(err){
			console.log("[error] Chat_Room.save_chat_log(): " + err);
			throw err;
		}
	}
	*/
}

module.exports = {Chat_Room};
