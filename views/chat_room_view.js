//chat_room_view.js
const path = require("path");

function chat_room(res){
	console.log("server directs client to /chat.html");
	res.sendFile(path.join(__dirname, "..", "public", "chat.html"));
}

module.exports = {chat_room};
