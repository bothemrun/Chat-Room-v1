//router-level middleware
const express = require("express");
const router = express.Router();

//MVC: user controller
const User_Controller = require("../controllers/user_controller").User_Controller;
//can't use static functions, must new an instance due to the active_username_map.
const user_controller = new User_Controller();

//register
//router.post("/register", user_controller.register.bind(user_controller));
router.post("/users",
	(...args) => user_controller.register(...args)
);

//login
router.post("/logins",
	(...args) => user_controller.login(...args)
);

//logout
router.delete("/logins",
	(...args) => user_controller.logout(...args)
);

module.exports = {router};
