const Room_Model = require("../models/room_model").Room_Model;
const Status_Code = require("../util/status_code");
const chat_room_view = require("../views/chat_room_view");

class Room_Controller{
	constructor(){}

	static async enter_room_by_room_id(req, res){
		const room_id = decodeURIComponent( req.params.room_id );
		console.log("http request GET /rooms/:room_id, room_id=" + room_id);

		try{
			const exist_room_id = await Room_Model.room_id_exist(room_id);
			if(exist_room_id === false){
				console.log(`[error] GET /rooms/${ room_id } enter_room_by_room_id(): room_id not exist!!!}`);
				throw Status_Code.ROOM_NOT_EXIST;//caught below
			}
		}catch(err){
			console.log(`[error] GET /rooms/${ room_id } enter_room_by_room_id(): ${ err }`);
			res.status(500);
			res.json({
				"data": "error for room_id=" + room_id + ":" + err
			});
			return;
		}

		console.log(`GET /rooms/${ room_id } username ${ req.session.username } enters the room ${ room_id }`);
		chat_room_view.chat_room(res);
	}

	static async get_all_rooms_by_username(req, res){
		console.log();
		console.log("server got a GET /rooms request.");
		
		let rooms = undefined;
		try{
			//rooms = await Room_Model.get_all_rooms_by_username(req.body.username);
			rooms = await Room_Model.get_all_rooms_by_username(req.session.username);
		}catch(err){
			console.log("[error] /rooms room_controller get_all_rooms_by_username(): " + err);
			res.status(500);
			res.json({
				"rooms": "database error: " + err
			});
			return;
		}

		res.status(200);
		res.json({
			"rooms": rooms
		});
	}

	static async create_room_by_username_array(req, res){
		console.log();
		console.log("server got a POST /rooms request.");

		let room_id = null;
		try{
			room_id = await Room_Model.create_room_by_username_array(req.body.username_array)
		}catch(err){
			console.log("[error] /rooms room_controller create_room_by_username_array(): " + err);
			res.status(500);
			res.json({
				"room_id": "database error: " + err
			});
			return;
		}

		res.status(201);
		res.json({
			"room_id": room_id
		});
	}
}

module.exports = {Room_Controller};
