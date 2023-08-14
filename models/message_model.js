//MVC: message model
const DB_Promise = require("../dao/db_promise");

class Message_Model{
	constructor(){}

	static async get_all_chat_messages(){
		let msgs = [];
		try{
			msgs = await DB_Promise.db_all(`SELECT * FROM messages`);
		}catch(err){
			console.log("[error] Chat_Room.get_all_chat_logs(): " + err);
			throw err;
		}

		return msgs;
	}

	static async save_chat_message(new_msg, timestamp_utc, username, room_id){
		try{
			await DB_Promise.db_run(`INSERT INTO messages VALUES (\"${ new_msg }\", \"${ timestamp_utc }\", \"${ username }\", \"${ room_id }\")`);
		}catch(err){
			console.log("[error] Chat_Room.save_chat_log(): " + err);
			throw err;
		}
	}
}

module.exports = {Message_Model};
