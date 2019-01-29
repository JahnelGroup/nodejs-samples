# Node.js/Express/MySQL

Illustrates a very basic implementation of a Node.js with Express and MySQL.

## Todo List Sample Circut

This application is part of the Todo List sample circut. References to other implementations of a Todo List can be found in [JahnelGroup/challenges/todo-list](https://github.com/JahnelGroup/challenges/tree/master/todo-list).

## Structure

### File Structure

The overall file structure is as follows:

```text
/node-express-mysql/
└── mysql
│   └── sql
│       └── schema.sql
├── node
    ├── views
    │   └── *.html
    ├── app.js
    ├── package-lock.json
    └── package.json
├── .env
└── docker-compose.yml
```

### Database: MySQL

The root password is defined in [.env](./.env) and loaded as an envrionment variable in the [docker-compose.yml](./docker-compose.yml) file.

```yml
envrionment:
      MYSQL_ROOT_PASSWORD: "${DB_ROOT_PASSWORD}"
```

The default schema is defined in [schema.sql](./mysql/sql/schema.sql) and loaded as volume mount in the [docker-compose.yml](./docker-compose.yml) file.

```yml
volumes:
    - ./mysql/sql/:/docker-entrypoint-initdb.d/
```

## Prerequisites

You will need to install [docker](https://docs.docker.com/install/) and [docker-compose](https://docs.docker.com/compose/install).

## Run

Bring up the entire stack with:

```bash
$ docker-compose up -d
```

The application can then be located at [http://localhost:3000](http://localhost:3000).

### Adminer

You can view that the database is up and schema was created with Adminer (previously known as phpMyAdmin). Navigate to [http://localhost:8080](http://localhost:8080) and login:

* System: MySQL
* Server: db
* Username: root
* Password: rootpassword
* Database: todolist
