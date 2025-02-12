var express = require('express');
var app = express();
require('dotenv').config();

app.get ('/', function (req, res) {
    res.send('{"response": "Hello World! Version 2.0"}');
});

app.get ('/starwars', function (req, res) {
    res.send('{"response": "Episode 4: A New Hope"}');
});

app.listen(process.env.PORT || 5000);

module.exports = app;