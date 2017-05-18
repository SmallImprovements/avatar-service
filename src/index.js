const express = require('express');
const app = express();
const avatar = require('./avatar');
const validate = require('./validate');
const color = require('./color');
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
        }),
    ],
});

app.use(requestLogger);

app.get('/:index/:initials.svg', function(req, res) {
    const { initials, index } = req.params;
    const avatarColor = color(index);
    if (!validate(initials)) {
        res.status(400).send({});
        return;
    }
    res.type('image/svg+xml').send(avatar(initials, avatarColor));
});

app.use(errorLogger);

app.listen(port, function() {
    console.log('App is running');
});
