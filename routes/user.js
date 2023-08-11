//router-level middleware
const express = require("express");
const router = express.Router();

//MVC: user controller
const user_controller = new (require("../controllers/user_controller").User_Controller)();

//HTTP POST. register.
router.post("/register", user_controller.register.bind(user_controller));

//HTTP POST. login
router.post("/login", user_controller.login.bind(user_controller));

//HTTP POST. logout
router.post("/logout", user_controller.logout.bind(user_controller));

module.exports = {router};
