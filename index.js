const express = require("express");
const network = require("./server/network");

//not used import here, but mounts root-level middleware there.
const root_middleware = require("./routes/root_middleware");

//TODO: Singleton for app
const app = network.app;
const io = network.get_socket_io_instance_fn();

//router-level middleware
const user_router = require("./routes/user").router;
const Chat_Room_Router = require("./routes/chat_room").Chat_Room_Router;
//TODO: use Singleton + static methods.
const chat_room_router = new Chat_Room_Router(io);

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
app.use(chat_room_router.router);

