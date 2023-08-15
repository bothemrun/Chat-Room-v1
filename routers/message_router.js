//router-level middleware
const express = require("express");
//MVC: chat room controller
const Message_Controller = require("../controllers/message_controller").Message_Controller;
const auth = require("../util/authentication").Authentication;

const router = express.Router();

//HTTP POST. chats.
//app.post("/messages", public_chat_room_controller.save_chat_message);
//for "this" binding.
//https://stackoverflow.com/questions/45643005/why-is-this-undefined-in-this-class-method
//this.router.post("/messages", this.public_chat_room_controller.save_chat_message.bind(this.public_chat_room_controller));
//router.post("/messages",
router.post("/messages/:room_id",
	(...args) => Message_Controller.save_chat_message(...args)
);

//HTTP GET. chats.
//restrict unlogged-in client to access router /messages for chat logs.
//this.router.get("/messages", auth.is_authenticated_redirect_login.bind(auth), this.public_chat_room_controller.get_all_chat_messages);
//router.get("/messages",
router.get("/messages/:room_id",
	(...args) => auth.is_authenticated_redirect_login(...args),
	(...args) => Message_Controller.get_all_chat_messages(...args)
);

module.exports = {router};
