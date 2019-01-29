CREATE DATABASE IF NOT EXISTS todolist;

use todolist;

CREATE TABLE IF NOT EXISTS todo (
id 		        int 		    auto_increment,
todoTitle 		varchar(200)	not null,
todoDescription text 		    not null,
date	        datetime	    not null,
constraint pkey_id primary key (id)
);