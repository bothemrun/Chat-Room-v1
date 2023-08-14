const Room_Model = require("../models/room_model").Room_Model;

class Room_Controller{
	constructor(){}

	static async get_all_rooms_by_username(req, res){
		console.log();
		console.log("server got a GET /rooms request.");
		
		let rooms = null;
		try{
			rooms = await Room_Model.get_all_rooms_by_username(req.body.username);
		}catch(err){
			console.log("[error] /rooms room_controller get_all_rooms_by_username(): " + err);
			res.status(500);
			res.json({
				"rooms": "database error."
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

		try{
			await Room_Model.create_room_by_username_array(req.body.username_array)
		}catch(err){
			console.log("[error] /rooms room_controlle create_room_by_username_array(): " + err);
			res.status(500);
			res.json({
				"rooms": "database error."
			});
			return;
		}

		res.status(201);
		res.json({
			"rooms": true
		});
	}
}

module.exports = {Room_Controller};
