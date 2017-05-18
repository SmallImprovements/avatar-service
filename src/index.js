const express = require('express');
const app = express();
const avatar = require('./avatar');

const port = process.env.PORT || 8080;

app.get('/:initials', function(req, res) {
    const initials = req.params.initials;
    // todo validate `initials`
    res.type('image/svg+xml').send(avatar(initials));
});

app.listen(port, function() {
    console.log('App is running');
});
