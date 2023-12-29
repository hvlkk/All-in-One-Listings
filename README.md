# Web Development part 2

This project is utilising an API (https://wiki-ads.onrender.com) to construct a dynamic page with advertisements.

## Technologies Used

The project contains a client application written in JavaScript, HTML and CSS, and a server application, written in Node.js and Express.

The server has an API and listens for HTTP requests made by the client. The implementation contains both in-memory and database data, that are used to perform CRUD operations.

The database used is MongoDB.

The in-memory storage is initialised with dummy data from a json file.

## Installation

To install the dependencies of the project you need to have Node.js installed. Then you install them using npm

```bash
npm i
```

## Usage

To run the server with MongoDB use the following command.

```
npm start --db=1
```

Else if you want to run the server with in-memory data initialised from the json file use the following:

```
npm start
```

## User credentials

There are two users created that you can use.

```
username: admin, password: admin
```

```
username: user, password: user
```
