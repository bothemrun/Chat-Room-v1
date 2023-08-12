//router-level middleware
const express = require("express");
//MVC: chat room controller
const Chat_Room_Controller = require("../controllers/chat_room_controller").Chat_Room_Controller;
const auth = require("../util/authentication").Authentication;

class Chat_Room_Router{
	constructor(io){
		this.router = express.Router();
		this.public_chat_room_controller = new Chat_Room_Controller(io);

		//HTTP POST. chats.
		//app.post("/messages", public_chat_room_controller.save_chat_message);
		//for "this" binding.
		//https://stackoverflow.com/questions/45643005/why-is-this-undefined-in-this-class-method
		//this.router.post("/messages", this.public_chat_room_controller.save_chat_message.bind(this.public_chat_room_controller));
		this.router.post("/messages", (...args) => this.public_chat_room_controller.save_chat_message(...args) );

		//HTTP GET. chats.
		//restrict unlogged-in client to access router /messages for chat logs.
		//this.router.get("/messages", auth.is_authenticated_redirect_login.bind(auth), this.public_chat_room_controller.get_all_chat_messages);
		this.router.get("/messages", (...args) => auth.is_authenticated_redirect_login(...args), (...args) => this.public_chat_room_controller.get_all_chat_messages(...args) );
	}
}

module.exports = {Chat_Room_Router};