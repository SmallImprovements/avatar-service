const express = require('express');
const app = express();

app.get('/', function(req, res) {
    res.send({ hello: 'world' });
});

app.listen(8080, function() {
    console.log('App is running');
});
