const express = require("express");
const app = require("express")();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const port = 3000

const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("message_db.db");

app.use(express.static("."));
app.use(express.json());

app.get("/", (req, res) => {
	res.sendFile(__dirname + "/index.html");
});

app.post("/messages", (req, res) => {
	console.log(req.body);
	console.log("server got a new message:" + req.body.message);

	db.run("INSERT INTO messages VALUES(?)", req.body.message);

	res.status(201);
	res.json({
		"message":true
	});
});

app.get("/messages", (req, res) => {
	console.log("client asks for messages.");

	res.status(200);
	msgs = []
	db.all("SELECT * FROM messages", (err, msg_rows) => {
		msg_rows.forEach((msg) => {
			console.log(msg);
			msgs.push(msg);
		});

		console.log(msgs);	

		console.log("print msgs:");
		console.log(msgs);
		res.json({
			"data":msgs
		});
	});

	//TODO: async await, promise
	/*console.log("print msgs:");
	console.log(msgs);
	res.json({
		"data":msgs
	});*/
});

/*io.on("connection", (socket) => {
	socket.on("chat message", (new_msg) => {
		io.emit("chat message", new_msg);
		console.log("server got new message: " + new_msg);
	});
});*/

http.listen(port, () => {
	console.log(`socket.io server running on ${port}`);
});

