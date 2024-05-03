require('express-async-errors');
require('dotenv').config();
const winston = require('winston');
const error = require('./middleware/error');
const express = require('express');
const app = express();

if (process.env.NODE_ENV !== 'production') {
    winston.add(new winston.transports.Console());
    winston.rejections.handle(new winston.transports.Console());
}else{
    winston.add(new winston.transports.File({ filename: 'combined.log', level: 'error'  }));
    winston.rejections.handle(new winston.transports.File({ filename: 'rejection.log'}));
}

require('./startup/routes')(app);
require('./startup/db')();

// throw new Error("Something went wrong before starting the Application");

app.use(error);

const port = process.env.PORT || 8080;
const server = app.listen(port, () => winston.info(`listening on port ${port}...`));

module.exports = server;