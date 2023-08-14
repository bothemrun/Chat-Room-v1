const DB_Promise = require("../dao/db_promise");
const User_Model = require("../models/user_model").User_Model;
const Status_Code = require("../util/status_code")
const delim = "#";

class Room_Model{
	constructor(){}

	static async get_all_rooms_by_username(username){
		let rooms = [];
		try{
			rooms = await DB_Promise.db_all(`SELECT room_id FROM users2rooms WHERE username = \"${ username }\"`);
		}catch(err){
			console.log("[error] Room_Model.get_all_rooms_by_username(): " + err);
			throw err;
		}

		return rooms;
	}

	static username_array2room_id(username_array){
		username_array.sort();

		let room_id = "";
		for(const username of username_array){
			room_id += username + delim;
		}
		room_id += "room";
		return room_id;
	}

	static async create_room_by_username_array(username_array){
		for(const username of username_array){
			const exist = await User_Model.username_exist(username);
			if(exist === false){
				console.log("[error] Room_Model.create_room(): " + Status_Code.USERNAME_NOT_EXIST);
				throw Status_Code.USERNAME_NOT_EXIST;
			}
		}

		const room_id = this.username_array2room_id(username_array);
		try{
			await DB_Promise.db_run(`INSERT INTO rooms VALUES (\"${ room_id }\")`);

			for(const username of username_array){
				await DB_Promise.db_run(`INSERT INTO users2rooms VALUES (\"${ username }\", \"${ room_id }\")`);
			}
		}catch(err){
			console.log("[error] Room_Model.create_room(): " + err);
			throw err;
		}
	}
}

module.exports = {Room_Model};
