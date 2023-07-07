const socket = io();

const messages = document.getElementById("messages");

/*form.addEventListener("submit", function(event){
	event.preventDefault();//TODO

	console.log(event);
	const input = document.getElementById("input");
	console.log("user input:" + input.value);

	if(input.value){
		console.log("user input in if:" + input.value);
		socket.emit("chat message", input.value);
		input.value = "";
	}
});*/

function call_send_message_api(){
	const input = document.getElementById("input");
	console.log("user input:" + input.value);

	if(input.value){
		console.log("user input in if:" + input.value);
		socket.emit("chat message", input.value);
		input.value = "";
	}
};

socket.on("chat message", function(new_msg){
	const new_msg_li = document.createElement("li");
	new_msg_li.textContent = new_msg;
	messages.appendChild(new_msg_li);
	window.scrollTo(0, document.body.scrollHeight);
});


