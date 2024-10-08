import {create_div} from "./util.js";

//load the socket.io-client, which exposes an io global (and the endpoint GET /socket.io/socket.io.js), and then connect.
//https://socket.io/get-started/chat
//Notice that I’m not specifying any URL when I call io(), since it defaults to trying to connect to the host that serves the page.
const socket = io();
//get room_id by window URL (so must redirect to room's own URL)
const room_id_encoded = window.location.pathname.split("/")[2];
const room_id_decoded = decodeURIComponent(room_id_encoded);
console.log("room_id = " + room_id_decoded);


function subtitle_in_navbar(subtitle){
	const title = document.getElementById("top_navbar");
	//title.appendChild( create_div("subtitle", "", subtitle) );
	title.appendChild( create_div("subtitle", null, subtitle) );
}
subtitle_in_navbar(room_id_decoded);

function append_new_chat_log(new_msg, timestamp_utc, username){
	//time zone converted from server utc to client local.
	//const timestamp_local = (new Date(timestamp_utc)).toString();
	const d = new Date(timestamp_utc);
	const year = d.getFullYear();
	const month = d.getMonth() + 1;//getMonth() 0-based
	const date = d.getDate();
	let hour = d.getHours();
	const minute = d.getMinutes();
	let ampm = "";
	if(hour >= 12){
		ampm = "PM";
		hour -= 12;
	}else{
		ampm = "AM";
	}
	const timestamp_local = month + "." + date + "." + year + " " + hour + ":" + minute + ampm;


	const chat_logs = document.getElementById("chat_logs");

	//const chat_post = create_div("chat_post", "", "");
	const chat_post = create_div("chat_post", null, null);

	chat_post.appendChild( create_div("inline", "username", username) );
	chat_post.appendChild( create_div("inline", "timestamp", timestamp_local) );
	chat_post.appendChild( create_div("chat_text", null, new_msg) );

	//remove blank bar at the bottom of each chat post div.
	const separate_div = create_div("separate_div", null, null);
	separate_div.appendChild( document.createElement("br") );
	chat_post.appendChild( separate_div );

	chat_logs.appendChild( chat_post );


	//chats scrolled down to the latest.
	window.scrollTo(0, document.body.scrollHeight);
}

//when the user enters the chat room, it gets all old chat logs.
//async function enter_room_get_all_chat_logs(){
export async function enter_room_get_all_chat_logs(){
	console.log("client enters the chat room and gets all old chat logs.");


	//use ajax to call RESTful API
	//send HTTP method(GET POST) requests to server.
	//https://www.w3schools.com/js/js_ajax_intro.asp
	//by an XMLHttpRequst object.
	const xhttp = new XMLHttpRequest();

	//callback when the request is received.
	xhttp.onload = function(){
		console.log("client successfully sent an HTTP GET for all chat logs to server with status:" + this.status + " " + this.statusText);

		//`this` is a XMLHttpRequest object.
		//its property includes: responseText, status, statusText, onload callback function
		console.log(". with responseText: " + this.responseText);

		console.log("Now all chat logs:");
		//JSON string to Javascript object
		//https://www.digitalocean.com/community/tutorials/js-json-parse-stringify
		for(let msg of JSON.parse( this.responseText ).data ){
			console.log(msg);
			//console.log(msg.message);
			//console.log("timestamp utc: " + msg.timestamp_utc);
			//console.log("username: " + msg.username);

			append_new_chat_log(msg.message, msg.timestamp_utc, msg.username);
		}
	};

	//HTTP GET
	xhttp.open("GET", "/messages/" + room_id_encoded);

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

	xhttp.send();
}

//enter_room_get_all_chat_logs();


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

export function call_send_message_api(){
	const input = document.getElementById("input_chat");
	console.log("user input:" + input.value);

	if(input.value){
		console.log("user input in if:" + input.value);


		//use ajax to call RESTful API
		//send HTTP method(GET POST) requests to server.
		//https://www.w3schools.com/js/js_ajax_intro.asp
		//by an XMLHttpRequst object.
		const xhttp = new XMLHttpRequest();

		//callback when the request is received.
		xhttp.onload = function(){
			console.log("client successfully sent an HTTP POST & sent a new message to server with status:" + this.status + " " + this.statusText);

			//`this` is a XMLHttpRequest object.
			//its property includes: responseText, status, statusText, onload callback function
			console.log(", with return responseText: " + this.responseText);
		};

		//HTTP POST
		xhttp.open("POST", "/messages/" + room_id_encoded);

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
		xhttp.send(JSON.stringify({
			"message":input.value
		}));
		

		//TODO: will nonblocking I/O causes the messages cleared before ajax sent?
		input.value = "";
	}
}

socket.on("connect", () => {
	console.log("connect ok.");
});

//when 1 of the clients send a new chat message,
//socket.io broadcasting received from server.
socket.on("new chat message", function(new_msg, timestamp_utc, username, from_room_id){
	//filter room's messages in client frontend.
	//new messages from rooms not equal to this room_id can be used for notification.
	console.log(`room=${ room_id_decoded } got a new chat from room=${ from_room_id }`);
	if(from_room_id !== room_id_decoded) return;

	console.log("client got a new chat: " + new_msg + ", timestamp utc:" + timestamp_utc + ", username: " + username);

	append_new_chat_log(new_msg, timestamp_utc, username);
});


