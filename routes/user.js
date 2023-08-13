//router-level middleware
const express = require("express");
const router = express.Router();

//MVC: user controller
const user_controller = new (require("../controllers/user_controller").User_Controller)();

//HTTP POST. register.
//router.post("/register", user_controller.register.bind(user_controller));
router.post("/register",
	(...args) => user_controller.register(...args)
);

//HTTP POST. login
router.post("/login",
	(...args) => user_controller.login(...args)
);

//HTTP POST. logout
router.post("/logout",
	(...args) => user_controller.logout(...args)
);

module.exports = {router};
