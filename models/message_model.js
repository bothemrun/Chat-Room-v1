//MVC: message model
const DB_Promise = require("../dao/db_promise");
const Status_Code = require("../util/status_code");

class Message_Model{
	constructor(){}

	static async get_all_chat_messages(room_id){
		if(!Boolean(room_id)){
			console.log("[error] Message_Model.get_all_chat_messages(): " + Status_Code.ROOM_NOT_EXIST);
			throw Status_Code.ROOM_NOT_EXIST;
		}

		let msgs = undefined;
		try{
			msgs = await DB_Promise.db_all(`SELECT * FROM messages WHERE room_id = \"${ room_id }\"`);
		}catch(err){
			console.log("[error] Message_Model.get_all_chat_logs(): " + err);
			throw err;
		}

		return msgs;
	}

	static async save_chat_message(new_msg, timestamp_utc, username, room_id){
		try{
			await DB_Promise.db_run(`INSERT INTO messages VALUES (\"${ new_msg }\", \"${ timestamp_utc }\", \"${ username }\", \"${ room_id }\")`);
		}catch(err){
			console.log("[error] Message_Model.save_chat_log(): " + err);
			throw err;
		}
	}
}

module.exports = {Message_Model};
