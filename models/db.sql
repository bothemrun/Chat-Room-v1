CREATE TABLE messages (
	message varchar(255),
	timestamp_utc varchar(255),
	username varchar(255)
);

CREATE TABLE users (
	username varchar(255) NOT NULL,
	password varchar(255) NOT NULL,
	PRIMARY KEY (username)
);
