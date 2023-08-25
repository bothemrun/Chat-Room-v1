const express = require("express");
const network = require("./server/network");

//Singleton for app
const app = network.get_express_app_instance();

//not used import here, but mounts root-level middleware there.
const root_middleware = require("./routers/root_middleware");

//router-level middleware
const user_router = require("./routers/user_router").router;
//used Singleton for passing socket.io io instance.
const message_router = require("./routers/message_router").router;
const room_router = require("./routers/room_router").router;

//MVC Views
const chat_room_view = require("./views/chat_room_view");

const auth = require("./util/authentication").Authentication;

//Routes
//homepage routes
//app.get("/", auth.is_authenticated_redirect_login.bind(auth), (req, res) => {
app.get("/", (...args) => auth.is_authenticated_redirect_login(...args), (req, res) => {
	//TODO: redirect to room selection page, not directly to the public room.

	//if to the login page, then sendFile already ends the request response cycle, so won't execute this line.
	chat_room_view.chat_room(res);
});

app.use(user_router);
app.use(message_router);
app.use(room_router);
