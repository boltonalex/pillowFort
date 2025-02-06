var express = require('express');
// var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require("cors");

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var investmentsRouter = require('./routes/investments');
var fundsRouter = require('./routes/funds');

var app = express();

app.use(cors({
  origin: "http://localhost:5173" // ✅ Only allow requests from frontend
}));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/', indexRouter);
app.use('/api/users', usersRouter);
app.use('/api/investments', investmentsRouter);
app.use('/api/funds', fundsRouter);

module.exports = app;