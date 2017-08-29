var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var bookRouter = require('./routes/books.js')();

var db = mongoose.connect('mongodb://localhost/db100116');
var Book = require('./models/book');

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/api/books', bookRouter);


app.get('/', function(req, res) {
    res.send('this is the home page.');
});

var port = process.env.PORT || 3000;

app.listen(port, function() {
    console.log('the server is running on port ' + port);
});