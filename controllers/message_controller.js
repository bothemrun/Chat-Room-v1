//MVC: message controller
//MVC Models
const Message_Model = require("../models/message_model").Message_Model;

//Singleton for socket.io instance, instead of dependency injection by class constructor.
const path = require("path");
const network = require(path.join(__dirname, "..", "server", "network"));

class Message_Controller{
	constructor(){
	}

	static async save_chat_message(req, res){
		console.log();
		console.log("server got HTTP POST /messages request.");
		console.log("from req.session.username:" + req.session.username);

		const timestamp_utc = (new Date()).toUTCString();

		//socket.io emit the event to all clients
		network.get_socket_io_instance().emit("new chat message", req.body.message, timestamp_utc, req.session.username);


		//Contains key-value pairs of data submitted in the request body. By default, it is undefined, and is populated when you use body-parsing middleware such as express.json()
		//https://expressjs.com/en/api.html#req.body
		console.log(req.body);
		console.log("experss POST: server got a new message:" + req.body.message + ", on timestamp_utc:" + timestamp_utc);

		try{
			await Message_Model.save_chat_message(req.body.message, timestamp_utc, req.session.username);
		}catch(err){
			console.log("[error] [server.js app.post /messages save_chat_message()]: " + err);
			res.status(500);
			res.json({
				"messages": "database error."
			});
			return;
		}

		res.status(201);
		res.json({
			"messages":true
		});
	}

	static async get_all_chat_messages(req, res){
		console.log();
		console.log("server got HTTP GET /messages request.");

		console.log("client asks for messages.");

		let msgs;
		try{
			msgs = await Message_Model.get_all_chat_messages();
		}catch(err){
			console.log("[error] [/messages message_controller get_all_chat_messages()]: " + err);
			res.status(500);
			res.json({
				"data": "database error."
			});
			return;
		}

		res.status(200);
		res.json({
			"data": msgs
		});
	}
}

module.exports = {Message_Controller};
