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

		//socket.emit("chat message", input.value);
		const xhttp = new XMLHttpRequest();
		xhttp.onload = function(){
			console.log("client successfully sent a new message to server with status code:" + this.status);
			console.log(", with return responseText: " + this.responseText);
		};
		xhttp.open("POST", "/messages");
		xhttp.setRequestHeader("Content-Type", "application/json");
		xhttp.send(JSON.stringify({"message":input.value}));
		
		//TODO: will nonblocking I/O causes the messages cleared before ajax sent?
		input.value = "";
	}
};

socket.on("chat message", function(new_msg){
	const new_msg_li = document.createElement("li");
	new_msg_li.textContent = new_msg;
	messages.appendChild(new_msg_li);
	window.scrollTo(0, document.body.scrollHeight);
});


