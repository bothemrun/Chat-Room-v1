const express = require("express");
const network = require("./server/network");

//not used import here, but mounts root-level middleware there.
const root_middleware = require("./routes/root_middleware");

//Singleton for app
const app = network.get_express_app_instance();

//router-level middleware
const user_router = require("./routes/user").router;
//used Singleton for passing socket.io io instance.
const chat_room_router = require("./routes/chat_room").router;

//MVC Views
const chat_room_view = require("./views/chat_room_view");

const auth = require("./util/authentication").Authentication;

//Routes
//homepage routes
//app.get("/", auth.is_authenticated_redirect_login.bind(auth), (req, res) => {
app.get("/", (...args) => auth.is_authenticated_redirect_login(...args), (req, res) => {
	chat_room_view.chat_room(res);
});

app.use(user_router);
app.use(chat_room_router);

