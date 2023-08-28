//frontend util.js
function create_div(class_, id_, textContent_){
	const div = document.createElement("div");
	if(class_ !== null) div.setAttribute("class", class_);
	if(id_ !== null) div.setAttribute("id", id_);
	if(textContent_ !== null) div.textContent = textContent_;
	return div;
}

async function uri_exist(uri){
	return new Promise((resolve, reject) => {
		const xhttp = new XMLHttpRequest();
		xhttp.onload = function(){
			//200 or 201
			if(this.status/100 !== 2) resolve(false);
			resolve(true);
		};

		xhttp.open("GET", uri);
		xhttp.setRequestHeader("Content-Type", "application/json");
		xhttp.send();
	});
}

async function redirect_reload(uri){
	console.log(`client redirects & reloads to URI: ${uri}`);

	//if URI not exist, go back.
	if(await uri_exist(uri) === false){
		console.log(`[error] URI:${ uri } doesn't exist!!!`);
		window.alert(`[error] URI:${ uri } doesn't exist!!!`);
		return false;
	}

	window.location.assign( window.location.origin + uri );
	//won't return true here.
}

export {create_div, redirect_reload, uri_exist};
