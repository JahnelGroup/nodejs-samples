Node.js/Express/MySQL
===================================
Illustrates a very basic implementation of a Node.js with Express and MySQL.

# Todo List Sample Circut

This application is part of the Todo List sample circut. References to other implementations of a Todo List can be found in [JahnelGroup/challenges/todo-list](https://github.com/JahnelGroup/challenges/tree/master/todo-list).

# Structure

## File Structure

The overall file structure is as follows:

```text
/nodejs-todo-list/
└── mysql
│   └── sql
│       └── schema.sql
├── views
│   └── *.html
├── .env
├── app.js
├── docker-compose.yml
├── package-lock.json
├── package.json
```

## MySQL

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

# Run

## Prerequisites

You will need to install [docker](https://docs.docker.com/install/), [docker-compose](https://docs.docker.com/compose/install).

## Start

Bring up the entire stack with:

```bash
$ docker-compose up -d
$ npm install
$ node app.js
```

The application can then be located at [http://localhost:3000](http://localhost:3000).