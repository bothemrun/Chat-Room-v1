//load the socket.io-client, which exposes an io global (and the endpoint GET /socket.io/socket.io.js), and then connect.
//https://socket.io/get-started/chat
//Notice that I’m not specifying any URL when I call io(), since it defaults to trying to connect to the host that serves the page.
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

		//use ajax to call RESTful API
		//send HTTP method(GET POST) requests to server.
		//https://www.w3schools.com/js/js_ajax_intro.asp
		//by an XMLHttpRequst object.
		const xhttp = new XMLHttpRequest();

		//callback when the request is received.
		xhttp.onload = function(){
			console.log("client successfully sent a new message to server with status code:" + this.status);
			console.log(", with return responseText: " + this.responseText);
		};

		//HTTP POST
		xhttp.open("POST", "/messages");

		//specify http message body's Content-Type in header.
		/*
		in server.js:
			//mounts express.js builtin middleware in Express that parses incoming requests with JSON payloads.
			//Returns middleware that only parses JSON and only looks at requests where the Content-Type header matches the type option.
			//a new body object containing the parsed data is populated on the request object after the middleware (i.e. req.body).
			//https://expressjs.com/en/api.html#express.json
			app.use(express.json());
		*/
		xhttp.setRequestHeader("Content-Type", "application/json");

		//Javascript JSON object to JSON strings.
		//JSON is Javascript standard built-in objects like Javascript BigInt String.
		//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects
		//send(string) for HTTP POST method.
		xhttp.send(JSON.stringify({"message":input.value}));
		
		//TODO: will nonblocking I/O causes the messages cleared before ajax sent?
		input.value = "";
	}
};

//socket.io broadcasting received.
socket.on("chat message", function(new_msg){
	//add a new entry <li> to a list <ul>
	const new_msg_li = document.createElement("li");
	new_msg_li.textContent = new_msg;
	messages.appendChild(new_msg_li);

	//chats scrolled down to the latest.
	window.scrollTo(0, document.body.scrollHeight);
});


