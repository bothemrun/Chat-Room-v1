//login_page_view.js
const path = require("path");

function login_page(res){
	console.log("server directs client to /login.html");
	res.sendFile(path.join(__dirname, "..", "public", "login.html"));
}

module.exports = {login_page};
