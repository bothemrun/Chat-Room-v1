const DB_Promise = require("../dao/db_promise");

//NOTE: no module dependency cycle
const User_Model = require("../models/user_model").User_Model;

const Status_Code = require("../util/status_code")
const delim = "#";
const public_room_id = "public_room";

class Room_Model{
	constructor(){}

	static async get_all_rooms_by_username(username){
		const exist_username = await User_Model.username_exist(username);
		if(exist_username === false){
			console.log("[error] Room_Model.get_all_rooms_by_username(): " + Status_Code.USERNAME_NOT_EXIST);
			throw Status_Code.USERNAME_NOT_EXIST;
		}

		let rooms = undefined;
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
		//check all usernames first. no need for rollback.
		for(const username of username_array){
			const exist_username = await User_Model.username_exist(username);

			if(exist_username === false){
				console.log("[error] Room_Model.create_room(): " + Status_Code.USERNAME_NOT_EXIST);
				throw Status_Code.USERNAME_NOT_EXIST;
			}
		}

		const room_id = this.username_array2room_id(username_array);

		const exist_room_id = await this.room_id_exist(room_id);
		if(exist_room_id === true){
			console.log("[error] Room_Model.create_room_by_username_array(): " + Status_Code.ROOM_ALREADY_EXIST_FAIL);
			throw Status_Code.ROOM_ALREADY_EXIST_FAIL;
		}

		try{
			await DB_Promise.db_run(`INSERT INTO rooms VALUES (\"${ room_id }\")`);

			for(const username of username_array){
				await this.join_room_by_username_room_id(username, room_id);
			}
		}catch(err){
			console.log("[error] Room_Model.create_room(): " + err);
			throw err;
		}
	}

	static async join_room_by_username_room_id(username, room_id){
		//join an already-existing room
		const exist_username = await User_Model.username_exist(username);
		const exist_room_id = await this.room_id_exist(room_id);
		console.log(`[Room_Model.join_room_by_username_room_id() exist or not]: ${username}: ${exist_username}, ${room_id}: ${exist_room_id}`);
		if(!exist_username || !exist_room_id){
			console.log("[error] Room_Model.join_room_by_username_room_id(): " + Status_Code.USERNAME_NOT_EXIST);
			throw Status_Code.USERNAME_NOT_EXIST;
		}

		try{
			await DB_Promise.db_run(`INSERT INTO users2rooms VALUES (\"${ username }\", \"${ room_id }\")`);
		}catch(err){
			console.log("[error] Room_Model.join_room_by_username_room_id(): " + err);
			throw err;
		}
	}

	static async room_id_exist(room_id){
		if(room_id === public_room_id) return true;

		let room_rows = undefined;
		try{
			room_rows = await DB_Promise.db_all(`SELECT * FROM rooms WHERE room_id = \"${ room_id }\"`);
		}catch(err){
			console.log("[error] Room_Model.room_id_exist(): " + err);
			throw err;
		}

		return room_rows.length !== 0;
	}
}

module.exports = {Room_Model, public_room_id};
