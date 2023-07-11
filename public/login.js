
function register(){
	const input_username = document.getElementById("input_username");
	const input_password = document.getElementById("input_password");

	console.log("client registers with username:" + input_username.value + ", password:" + input_password.value);
	if(input_username.value && input_password.value){
		//TODO: valid username password validation.

		//ajax to call RESTful API by an XMLHttpRequest object
		const xhttp = new XMLHttpRequest();

		xhttp.onload = function(){
			console.log("client successfully sent an HTTP POST /register & received status:" + this.status + " " + this.statusText);
			console.log(". with responseText:" + this.responseText);

			//TODO: handle username conflict.
		};

		xhttp.open("POST", "/register");

		xhttp.setRequestHeader("Content-Type", "application/json");

		xhttp.send(JSON.stringify({
			"username":input_username.value,
			"password":input_password.value
		}));

	}else{
		console.log("empty username / password input.");
		window.alert("empty username / password input.");
	}

	input_username.value = "";
	input_password.value = "";
}

function login(){
	const input_username = document.getElementById("input_username");
	const input_password = document.getElementById("input_password");

	console.log("client logs in with username:" + input_username.value + ", password:" + input_password.value);

	if(input_username && input_password){
		const xhttp = new XMLHttpRequest();

		xhttp.onload = function(){
			console.log("client successfully sent an HTTP POST /login & received status:" + this.status + " " + this.statusText);
			console.log(". with responseText:" + this.responseText);

			//TODO: username not found, already logged in, wrong password.

			//TODO: add logged in state.
		};

		xhttp.open("POST", "/login");

		xhttp.setRequestHeader("Content-Type", "application/json");

		xhttp.send(JSON.stringify({
			"username":input_username.value,
			"password":input_password.value
		}));
	}else{
		console.log("empty username / password input.");
		window.alert("empty username / password input.");
	}

	input_username.value = "";
	input_password.value = "";
}

function logout(){
	//TODO: get username & password from logged in state, not input box below.
	const input_username = document.getElementById("input_username");
	const input_password = document.getElementById("input_password");

	console.log("client logs out with username:" + input_username.value + ", password:" + input_password.value);

	if(input_username && input_password){
		const xhttp = new XMLHttpRequest();

		xhttp.onload = function(){
			console.log("client successfully sent an HTTP POST /logout & received status:" + this.status + " " + this.statusText);
			console.log(". with responseText:" + this.responseText);

			//TODO: not logged in before.

			//TODO: remove logged in state.
		};

		xhttp.open("POST", "/logout");

		xhttp.setRequestHeader("Content-Type", "application/json");

		xhttp.send(JSON.stringify({
			"username":input_username.value,
			"password":input_passoword.value
		}));
	}else{
		console.log("empty username / password input.");
		window.alert("empty username / password input.");
	}
}