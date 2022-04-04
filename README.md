# Northcoders News API

https://richard-nc-news.herokuapp.com/api/

This is a news API built to interact with a databse to serve articles, comments, and users to a Reddit style front end architecture. The above link will take you to the hosted version of the API with a full list of available endpoints and expected responses.

## Set-up & Local Installation 

### Fork and clone the project
Fork the repo and clone the forked repo locally on your computer by running the command:
```
$ git clone /github-project-url/
``` 

### Install dependencies
From the root directory of the project run the command: 
```
$ npm install
``` 

### Add your .env files
You will need to create two .env files for this application at the root level: .env.test and .env.development. Into each, add PGDATABASE=<database_name_here>, with the correct database name for that environment (see /db/setup.sql for the database names). For security reasons please double check that these .env files are .gitignored


### Set-up and seed database
Run the commands:
```
$ npm run setup-dbs
$ npm run seed
``` 

### Run testing suites
To run integration tests, run the command:
```
$ npm test app
``` 
To run all tests, run the command:
```
$ npm test
```

## Minimum Requirements
You will need to make sure you have installed `Node.js v10.19.0` and `Postgres v12.9` in order to run the project on your machine.


## Future Additions
Whilst the core of the project is complete, this API is an ongoing work in progress and I hope to be able to add further additional features and endpoints in the future.

