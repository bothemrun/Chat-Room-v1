const express = require("express");
const app = require("express")();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const port = 3000

app.use(express.static("."));
app.use(express.json());

app.get("/", (req, res) => {
	res.sendFile(__dirname + "/index.html");
});

app.post("/messages", (req, res) => {
	console.log(req.body);
	console.log("server got a new message:" + req.body.message);
	res.json({
		"message":true
	});
});

io.on("connection", (socket) => {
	socket.on("chat message", (new_msg) => {
		io.emit("chat message", new_msg);
		console.log("got new message: " + new_msg);
	});
});

http.listen(port, () => {
	console.log(`socket.io server running on ${port}`);
});

