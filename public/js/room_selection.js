//room_selection.js

//TODO: frontend util for chat.js & room_selection.js
function create_div(class_, id_, textContent_){
	const div = document.createElement("div");
	if(class_ !== null) div.setAttribute("class", class_);
	if(id_ !== null) div.setAttribute("id", id_);
	if(textContent_ !== null) div.textContent = textContent_;
	return div;
}

function append_room(room_id){
	const all_chat_rooms_by_username = document.getElementById("all_chat_rooms_by_username");

	const room_post = create_div("room_post", null, null);

	room_post.appendChild( create_div("room_text", null, room_id) );

	const separate_div = create_div("separate_div", null, null);
	separate_div.appendChild( document.createElement("br") );
	room_post.appendChild( separate_div );

	all_chat_rooms_by_username.appendChild( room_post );

	window.scrollTo(0, document.body.scrollHeight);
}

function get_all_rooms_by_username(){
	//as in chat.js call_send_message_api(),
	//the username is obtained by req.session.username in server's Message_Controller, not provided by the client

	//use ajax & XMLHttpRequest to call RESTful API
	const xhttp = new XMLHttpRequest();

	xhttp.onload = function(){
		console.log(`client successfully sent an HTTP GET /rooms with status: ${ this.status } ${ this.statusText }`);
		console.log(`with responseText: ${ this.responseText }`);

		for(const room of JSON.parse( this.responseText ).rooms ){
			append_room(room.room_id);
		}
	};

	xhttp.open("GET", "/rooms");
	xhttp.setRequestHeader("Content-Type", "application/json");
	xhttp.send();
}

get_all_rooms_by_username();


//TODO: frontend util for chat.js & room_selection.js
function redirect_reload(uri){
	console.log(`client redirects & reloads to URI: ${uri}`);

	window.location.assign( window.location.origin + uri );
	/*
	const xhttp = new XMLHttpRequest();
	xhttp.onload = function(){
		console.log(`client successfully sent an HTTP GET /rooms with status: ${ this.status } ${ this.statusText }`);
		console.log(`with responseText: ${ this.responseText }`);

		if(this.status !== 200){
			console.log("[error] [enter_room() redirect_reload()]: room_id not exist!!!");
			window.alert("[error]: room_id not exist!!!");
			return;
			//TODO: need to redirect & reload to room selection page? what if client manually reload the page?
		}

		//ajax won't redirect in the frontend, even if the backend redirects.
		//https://stackoverflow.com/questions/27202075/expressjs-res-redirect-not-working-as-expected
		window.location.reload();
	};

	xhttp.open("GET", uri);
	xhttp.setRequestHeader("Content-Type", "application/json");
	xhttp.send();
	*/
}

function enter_room(){
	const input_room_id = document.getElementById("input_room_id");

	if(input_room_id.value){
		redirect_reload(`/rooms/${ encodeURIComponent( input_room_id.value ) }`);
	}

	input_room_id.value = "";
}

function create_room(){
	const input_room_id = document.getElementById("input_room_id");
	if(input_room_id.value){
		const username_array = input_room_id.value.split(",");
		if(username_array.length === 0){
			window.alert("[fail] create_room: username array empty!!");
			return;
		}

		const xhttp = new XMLHttpRequest();
		xhttp.onload = function(){
			console.log("client successfully received HTTP POST /rooms response:" + this.status + " " + this.statusText);
			console.log("with responseText:" + this.responseText);

			if(this.status !== 201){
				console.log(`create_room error: ${ JSON.parse( this.responseText ).room_id }`);
				window.alert(`create_room error: ${ JSON.parse( this.responseText ).room_id }`);
			}else{
				console.log(`create_room successful with room_id:${ JSON.parse( this.responseText ).room_id }`);
				window.alert(`create_room successful with room_id:${ JSON.parse( this.responseText ).room_id }`);
			}
		};

		xhttp.open("POST", "/rooms");
		xhttp.setRequestHeader("Content-Type", "application/json");

		xhttp.send(JSON.stringify({
			"username_array": username_array
		}));
	}

	input_room_id.value = "";
}

function room_selection_page(){
	redirect_reload(`/room_selection.html`);//TODO: another URI if restarted blocking .html requests.
}

