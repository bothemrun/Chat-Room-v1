const DB_Promise = require("../dao/db_promise");
console.log(DB_Promise);

/*
//const um = require("../models/user_model");
const path = require("path");
//const um = require(path.join(__dirname, "..", "models", "user_model"));
const um = require(path.join(__dirname, "user_model"));
console.log(um)

const User_Model = require("../models/user_model").User_Model;
console.log(User_Model);
console.log(User_Model.username_exist);
*/
const username_exist = require("../models/user_model").username_exist;
console.log(username_exist);

const Status_Code = require("../util/status_code")
const delim = "#";
const public_room_id = "public_room";
module.exports.public_room_id = public_room_id;


//TODO
async function room_id_exist(room_id){
	let room_rows = undefined;
	try{
		room_rows = await DB_Promise.db_all(`SELECT * FROM rooms WHERE room_id = \"${ room_id }\"`);
	}catch(err){
		console.log("[error] Room_Model.room_id_exist(): " + err);
		throw err;
	}

	return room_rows.length !== 0;
}

//TODO
async function join_room_by_username_room_id(username, room_id){
	//first add to users model, then here.
	//TODO
	//TODO: const exist_username = await User_Model.username_exist(username);
	const exist_username = await username_exist(username);

	//TODO: const exist_room_id = await this.room_id_exist(room_id);
	let exist_room_id = await room_id_exist(room_id);//TODO

	//TODO
	if(room_id === public_room_id) exist_room_id = true;

	if(!exist_username || !exist_room_id){
		console.log("[error] Room_Model.join_room_by_username_room_id(): " + Status_Code.USER_JOIN_ROOM_FAIL);
		throw Status_Code.USER_JOIN_ROOM_FAIL;
	}

	try{
		await DB_Promise.db_run(`INSERT INTO users2rooms VALUES (\"${ username }\", \"${ room_id }\")`);
	}catch(err){
		console.log("[error] Room_Model.join_room_by_username_room_id(): " + err);
		throw err;
	}
}
module.exports.join_room_by_username_room_id = join_room_by_username_room_id;


module.exports.Room_Model = class Room_Model{
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
		//check all usernames first. no need for rollback.
		for(const username of username_array){
			//TODO: const exist = await User_Model.username_exist(username);
			const exist = await username_exist(username);

			if(exist === false){
				console.log("[error] Room_Model.create_room(): " + Status_Code.USERNAME_NOT_EXIST);
				throw Status_Code.USERNAME_NOT_EXIST;
			}
		}

		const room_id = this.username_array2room_id(username_array);
		try{
			await DB_Promise.db_run(`INSERT INTO rooms VALUES (\"${ room_id }\")`);

			for(const username of username_array){
				//TODO: await this.join_room_by_username_room_id(username, room_id);
				await join_room_by_username_room_id(username, room_id);//TODO
			}
		}catch(err){
			console.log("[error] Room_Model.create_room(): " + err);
			throw err;
		}
	}

	/*
	static async join_room_by_username_room_id(username, room_id){
		//first add to users model, then here.
		//TODO
		const exist_username = await User_Model.username_exist(username);
		const exist_room_id = await this.room_id_exist(room_id);
		if(!exist_username || !exist_room_id){
			console.log("[error] Room_Model.join_room_by_username_room_id(): " + Status_Code.USER_JOIN_ROOM_FAIL);
			throw Status_Code.USER_JOIN_ROOM_FAIL;
		}

		try{
			await DB_Promise.db_run(`INSERT INTO users2rooms VALUES (\"${ username }\", \"${ room_id }\")`);
		}catch(err){
			console.log("[error] Room_Model.join_room_by_username_room_id(): " + err);
			throw err;
		}
	}
	*/

	/*
	static async room_id_exist(room_id){
		let room_rows = undefined;
		try{
			room_rows = await DB_Promise.db_all(`SELECT * FROM rooms WHERE room_id = \"${ room_id }\"`);
		}catch(err){
			console.log("[error] Room_Model.room_id_exist(): " + err);
			throw err;
		}

		return room_rows.length !== 0;
	}
	*/
};

//module.exports = {Room_Model, public_room_id};
