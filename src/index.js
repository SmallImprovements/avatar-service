const express = require('express');
const app = express();
const avatar = require('./avatar');
const validate = require('./validate');
const color = require('./color');

const port = process.env.PORT || 8080;

app.get('/:index/:initials', function(req, res) {
    const { initials, index } = req.params;
    const avatarColor = color(index);
    if (!validate(initials)) {
        res.status(400).send({});
        return;
    }
    res.type('image/svg+xml').send(avatar(initials, avatarColor));
});

app.listen(port, function() {
    console.log('App is running');
});
