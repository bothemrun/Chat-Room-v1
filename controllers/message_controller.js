//MVC: message controller
//MVC Models
const Message_Model = require("../models/message_model").Message_Model;

//Singleton for socket.io instance, instead of dependency injection by class constructor.
const path = require("path");
const network = require(path.join(__dirname, "..", "server", "network"));
const Room_Model = require("../models/room_model");

const Status_Code = require("../util/status_code");

class Message_Controller{
	constructor(){
	}

	static async save_chat_message(req, res){
		console.log();

		const {room_id} = req.params;
		console.log("client asks for messages for room_id: " + room_id);
		if(!Boolean(room_id)){
			console.log("[error] Message_Controller.save_chat_message(): " + Status_Code.ROOM_NOT_EXIST);
			throw Status_Code.ROOM_NOT_EXIST;
		}
		console.log("server got HTTP POST request /messages/:" + req.params.room_id);

		console.log("from req.session.username:" + req.session.username);

		const timestamp_utc = (new Date()).toUTCString();

		//socket.io emit the event to clients
		//network.get_socket_io_instance().emit("new chat message", req.body.message, timestamp_utc, req.session.username);
		network.get_socket_io_instance().to(room_id).emit("new chat message", req.body.message, timestamp_utc, req.session.username, room_id);


		//Contains key-value pairs of data submitted in the request body. By default, it is undefined, and is populated when you use body-parsing middleware such as express.json()
		//https://expressjs.com/en/api.html#req.body
		console.log(req.body);
		console.log("experss POST: server got a new message:" + req.body.message + ", on timestamp_utc:" + timestamp_utc + ", to room_id:" + room_id);

		try{
			await Message_Model.save_chat_message(req.body.message, timestamp_utc, req.session.username, room_id);
		}catch(err){
			console.log("[error] [server.js app.post /messages save_chat_message()]: " + err);
			res.status(500);
			res.json({
				"messages": "database error.",
				"room_id": room_id
			});
			return;
		}

		res.status(201);
		res.json({
			"messages":true,
			"room_id": room_id
		});
	}

	static async get_all_chat_messages(req, res){
		console.log();

		const {room_id} = req.params;
		console.log("client asks for messages for room_id: " + room_id);
		if(!Boolean(room_id)){
			console.log("[error] Message_Controller.get_all_chat_messages(): " + Status_Code.ROOM_NOT_EXIST);
			throw Status_Code.ROOM_NOT_EXIST;
		}
		console.log("server got HTTP GET request /messages/" + req.params.room_id);

		//socket.io join room is done very early on "connection" event, joining all the user's rooms, with filtering in frontend

		let msgs = undefined;
		try{
			msgs = await Message_Model.get_all_chat_messages(room_id);
		}catch(err){
			console.log("[error] [/messages message_controller get_all_chat_messages()]: " + err);
			res.status(500);
			res.json({
				"data": "database error.",
				"room_id": room_id
			});
			return;
		}

		res.status(200);
		res.json({
			"data": msgs,
			"room_id": room_id
		});
	}
}

module.exports = {Message_Controller};
