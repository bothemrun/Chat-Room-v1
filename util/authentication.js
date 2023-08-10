//express-session authentication

class Authentication{
	constructor(){}
	
	static async add_session(req){
		//NOTE: must save session before returning the http response to be saved in client.
		//NOTE: and pure callbacks won't wait. so must wrap with Promise.
		
		//https://expressjs.com/en/resources/middleware/session.html
		return new Promise(function(resolve, reject){
			req.session.regenerate(function(err){
				if(err) throw err;

				req.session.username = req.body.username;
				req.session.password = req.body.password;

				req.session.save(function(err){
					if(err) throw err;
					console.log(`[models/user.js] Authentication login(): saved to session with req.session.usernanem .password ${req.session.username} ${req.session.password}`);

					resolve();
				});
			});
		});
	}

	static async delete_session(req){
		if(this.is_logged_in(req) === false) throw Status_Code.LOGOUT_FAIL;

		return new Promise(function(resolve, reject){	
			//https://expressjs.com/en/resources/middleware/session.html
			delete req.session.username;
			delete req.session.password;

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

	static is_logged_in(req){
		return Boolean(req.session.username);
	}
}

module.exports = {Authentication};