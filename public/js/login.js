function redirect_home(){
	path = "/";
	console.log("client redirects to " + path);

	const xhttp = new XMLHttpRequest();
	xhttp.onload = function(){
		console.log("client successfully redirects to " + path + " & received status:" + this.status + " " + this.statusText);
		console.log(". with responseText:" + this.responseText);

		//ajax won't redirect in the frontend, even if the backend redirects.
		//https://stackoverflow.com/questions/27202075/expressjs-res-redirect-not-working-as-expected
		window.location.reload();
	};
	xhttp.open("GET", path);
	xhttp.setRequestHeader("Content-Type", "application/json");
	xhttp.send();
}

function register(){
	const input_username = document.getElementById("input_username");
	const input_password = document.getElementById("input_password");

	console.log("client registers with username:" + input_username.value + ", password:" + input_password.value);
	if(input_username.value && input_password.value){
		//ajax to call RESTful API by an XMLHttpRequest object
		const xhttp = new XMLHttpRequest();

		xhttp.onload = function(){
			console.log("client successfully sent an HTTP POST /register & received status:" + this.status + " " + this.statusText);
			console.log(". with responseText:" + this.responseText);

			if(this.status !== 201){
				console.log("register: username conflict!");
				window.alert("register: username conflict!");
			}
		};

		xhttp.open("POST", "/users", false);

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

			if(this.status !== 200){
				console.log("login: username not match or password incorrect!");
				window.alert("login: username not match or password incorrect!");
			}else redirect_home();
		};

		xhttp.open("POST", "/logins", false);

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
	const xhttp = new XMLHttpRequest();

	xhttp.onload = function(){
		console.log("client successfully sent an HTTP POST /logout & received status:" + this.status + " " + this.statusText);
		console.log(". with responseText:" + this.responseText);

		if(this.status !== 200){
			console.log("logout: error from server.");
			window.alert("logout: error from server.");
		}else redirect_home();
	};

	//xhttp.open("POST", "/logins");
	xhttp.open("DELETE", "/logins");

	xhttp.setRequestHeader("Content-Type", "application/json");

	xhttp.send();
}
