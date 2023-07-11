
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
	const input_username = document.getElementById("input_username");
	const input_password = document.getElementById("input_password");

	console.log("client logs out with username:" + input_username.value + ", password:" + input_password.value);

	if(input_username && input_password){
		const xhttp = new XMLHttpRequest();

		xhttp.onload = function(){
			console.log("client successfully sent an HTTP POST /logout & received status:" + this.status + " " + this.statusText);
			console.log(". with responseText:" + this.responseText);
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
