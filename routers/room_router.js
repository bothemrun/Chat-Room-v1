//router-level middleware
const express = require("express");
const Room_Controller = require("../controllers/room_controller").Room_Controller;

const chat_room_view = require("../views/chat_room_view");

const router = express.Router();

//TODO: authenticate by session, 'cuz we get all rooms by req.session.username
router.get("/rooms",
	(...args) => Room_Controller.get_all_rooms_by_username(...args)
);

router.post("/rooms", 
	(...args) => Room_Controller.create_room_by_username_array(...args)
);

//TODO auth.is_authenticated_redirect_login()
router.get("/rooms/:room_id",
	(...args) => Room_Controller.enter_room_by_room_id(...args)
);

module.exports = {router};
