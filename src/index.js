const express = require('express');
const server = express();
const app = require('./app');
const winston = require('winston');

const port = process.env.PORT || 80;

const requestLogger = winston.createLogger({
    level: 'info',
    transports: [
        new winston.transports.Console({
            format: winston.format.simple(),
        }),
    ],
});

const errorLogger = winston.createLogger({
    level: 'error',
    transports: [
        new winston.transports.Console({
            format: winston.format.json(),
        }),
    ],
});

function errorHandler(err, req, res, next) {
    if (res.headersSent) {
        return next(err);
    }
    errorLogger.error('Uncaught exception', err);
    res.status(500);
    res.send('Internal server error');
}

server.use((req, res, next) => {
    const time = process.hrtime();
    next();
    const [seconds, nanoseconds] = process.hrtime(time);
    const latency = (seconds * 1000.0 + nanoseconds / 1000000.0) | 0;
    requestLogger.log('info', `${req.method} ${req.url} ${res.statusCode} ${latency}ms`);
});
server.get('/_ah/health', (req, res) => res.send(200));
server.get('/_error', (req, res) => {
    // temporary route for testing error behaviour and logging
    throw new Error('boom');
});
server.use(app);
server.use(errorHandler);
server.listen(port, () => {
    console.log(`App is running on port: ${port}`);
});
