# All in One Listings - Part Two

## Description

For the second part of the project, we retained the final version of the webpage developed in the first part to serve as the frontend. The goal was to create a full-stack web application with a dynamic page for advertisements.

The server, implemented with Node.js and Express.js, provides a RESTful API to handle HTTP requests from the client. Utilizing both in-memory storage and a MongoDB database, it manages data storage and retrieval. In-memory storage initializes with dummy data from a JSON file.

To facilitate dynamic content generation on the frontend, Handlebars.js was utilized for dynamic HTML creation using JavaScript.

This project integrates with an external API (https://wiki-ads.onrender.com) to construct the advertisement listings displayed on the website.

NOTE:  As the listings provided through the API were in Greek, we rewrote the entire webpage from the previous part in Greek to ensure a smooth user experience.

## Installation

To install the dependencies of the project you need to have Node.js and npm installed. Afterwards, you should follow the following instructions:

1. Clone the project.
2. Navigate to the 'Part-2' directory.
3. Install the required dependencies using npm, by running the following command: ```npm i```

## Usage

To run the server with MongoDB, use the following command:

``` bash
npm start --db=1
```

Else, if you want to run the server with in-memory data initialised from the JSON file, use the following command:

``` bash
npm start
```

## User Credentials

Two user accounts have been created for testing purposes. These accounts can be used to interact with the application, specifically for adding and removing ads from favorites:

1. ``` username: admin, password: admin```
2. ``` username: user, password: user```

## Collaborators

- [hvlkk](https://www.github.com/hvlkk)
- [TrifonisAth](https://www.github.com/TrifonisAth)
