//router-level middleware
const express = require("express");
const Room_Controller = require("../controllers/room_controller").Room_Controller;

const chat_room_view = require("../views/chat_room_view");

const router = express.Router();

//TODO: authenticate by session
router.get("/rooms",
	(...args) => Room_Controller.get_all_rooms_by_username(...args)
);

router.post("/rooms", 
	(...args) => Room_Controller.create_room_by_username_array(...args)
);

//TODO auth.is_authenticated_redirect_login()
router.get("/rooms/:room_id",
	(...args) => Room_Controller.enter_room_by_room_id(...args)
	/* (req, res) => {
	console.log("http request to /rooms/" + req.params.room_id);
	//TODO: check room_id exist or not
	chat_room_view.chat_room(res);
	}
	*/
);

module.exports = {router};
