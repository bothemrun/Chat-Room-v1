//await wrapper for sqlite3
//TODO: sqlite3 doesn't support Promise, can't use await. maybe use sqlite?
const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const db = new sqlite3.Database(path.join(__dirname, "..", "dao", "sqlite3_db.db"));

async function db_all(query){
	return new Promise(function(resolve, reject){
		db.all(query, function(err, rows){
			if(err){
				reject(err);
			}else{
				resolve(rows);
			}
		});
	});
}

async function db_run(query){
	return new Promise(function(resolve, reject){
		db.run(query, function(err){
			if(err){
				reject(err);
			}else{
				resolve();
			}
		});
	});
}

module.exports = {db_all, db_run};
