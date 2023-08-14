//router-level middleware
const express = require("express");
const Room_Controller = require("../controllers/room_controller").Room_Controller;

const router = express.Router();

//TODO: authenticate by session
router.get("/rooms",
	(...args) => Room_Controller.get_all_rooms_by_username(...args)
);

router.post("/rooms", 
	(...args) => Room_Controller.create_room_by_username_array(...args)
);

module.exports = {router};
