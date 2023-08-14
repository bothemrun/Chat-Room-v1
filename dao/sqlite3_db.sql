CREATE TABLE messages (
	message varchar(255),
	timestamp_utc varchar(255),
	username varchar(255),
	room_id varchar(2048)
);

CREATE TABLE rooms (
	room_id varchar(2048) NOT NULL,
	PRIMARY KEY (room_id)
);

CREATE TABLE users2rooms (
	username varchar(255) NOT NULL,
	room_id varchar(2048) NOT NULL
);


CREATE TABLE users (
	username varchar(255) NOT NULL,
	password varchar(255) NOT NULL,
	PRIMARY KEY (username)
);
