CREATE DATABASE cubewars_db;

USE cubewars_db;

CREATE TABLE Chat (
    id INTEGER(10) AUTO_INCREMENT NOT NULL,
    userId VARCHAR(100) NOT NULL,
    text VARCHAR(250),
    dateCreated DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    dateModified DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    PRIMARY KEY (id)
);

DROP TABLE Chat;

CREATE TABLE User (
    id INTEGER(10) AUTO_INCREMENT NOT NULL,
    user_name VARCHAR(100) NOT NULL,
    user_email VARCHAR(250),
    dateCreated DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    dateModified DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    PRIMARY KEY (id)
);

SELECT * FROM Chat;

SELECT * FROM User;