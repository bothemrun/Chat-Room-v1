//room_selection.js
import { create_div, redirect_reload } from "./util.js"; //"util.js"; //"/js/util.js"

function append_room(room_id){
	const room_post = create_div("room_post", null, null);

	room_post.appendChild( create_div("room_text", null, room_id) );

	const separate_div = create_div("separate_div", null, null);
	separate_div.appendChild( document.createElement("br") );
	room_post.appendChild( separate_div );

	document.getElementById("all_rooms_by_username").appendChild( room_post );

	window.scrollTo(0, document.body.scrollHeight);
}

//function get_all_rooms_by_username(){
export function get_all_rooms_by_username(){
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

//execute in html script module: get_all_rooms_by_username();


export function enter_room(){
	const input_room_id = document.getElementById("input_room_id");

	if(input_room_id.value){
		const uri = `/rooms/${ encodeURIComponent( input_room_id.value ) }`;
		if( redirect_reload(uri) === false){
			//another implementation way: keep the room_id array global variable
			console.log(`[error] enter_room(): URI:${ uri } not exist !!!`);
		}
	}

	input_room_id.value = "";
}

export function create_room(){
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

				//easy way to reloads the new room
				setTimeout(room_selection_page, 1000);
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

export function room_selection_page(){
	//TODO: another URI if restarted blocking .html requests.
	if( redirect_reload(`/room_selection.html`) === false)
		console.log(`[error] enter_room(): URI:${ uri } not exist !!!`);
}

