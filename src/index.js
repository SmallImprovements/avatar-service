const express = require('express');
const server = express();
const app = require('./app');
const expressWinston = require('express-winston');
const winston = require('winston');

const port = process.env.PORT || 8080;

const requestLogger = expressWinston.logger({
    transports: [
        new winston.transports.Console({
            json: false,
            colorize: false,
        }),
    ],
    expressFormat: true,
    meta: false,
});

const errorLogger = expressWinston.errorLogger({
    transports: [
        new winston.transports.Console({
            json: true,
            colorize: false,
            stringify: obj => JSON.stringify(obj),
        }),
    ],
});

server.use(requestLogger);
server.get('/_ah/health', (req, res) => res.send(200));
server.get('/_error', (req, res) => {
    // temporary route for testing error behaviour and logging
    throw new Error('boom');
});
server.use(app);
server.use(errorLogger);
server.listen(port, () => {
    console.log('App is running');
});
