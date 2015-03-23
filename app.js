var express = require('express');
var logger = require('morgan');
var path = require('path');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

var app = express();
var mongoURI = process.env.MONGOURI || "mongodb://localhost/test";
var PORT = process.env.PORT || 3000;

mongoose.connect(mongoURI);

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/');

app.listen(PORT, function() {
  console.log("Application running on port:", PORT);
});