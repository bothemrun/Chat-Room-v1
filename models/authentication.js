//express-session authentication

class Authentication{
	constructor(){}
	
	async login(req){
		//NOTE: must save session before returning the http response to be saved in client.
		//NOTE: and pure callbacks won't wait. so must wrap with Promise.
		
		//https://expressjs.com/en/resources/middleware/session.html
		return new Promise(function(resolve, reject){
			req.session.regenerate(function(err){
				if(err) throw err;

				req.session.user = req.body.username;

				req.session.save(function(err){
					if(err) throw err;
					console.log(`[models/user.js] Authentication login(): saved to session with req.session.user: ${req.session.user}`);

					resolve();
				});
			});
		});
	}

	async logout(req){
		if(this.is_logged_in(req) === false) throw Status_Code.LOGOUT_FAIL;

		return new Promise(function(resolve, reject){	
			//https://expressjs.com/en/resources/middleware/session.html
			delete req.session.user;
			req.session.save(function(err){
				if(err) throw err;

				// regenerate the session, which is good practice to help
			    // guard against forms of session fixation
				req.session.regenerate(function(err){
					if(err) throw err;

					console.log("logout(): ok");

					resolve();
				});
			});
		});
	}

	is_logged_in(req){
		return Boolean(req.session.user);
	}
}

module.exports = {Authentication};
