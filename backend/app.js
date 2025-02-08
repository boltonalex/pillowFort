var express = require('express');
// var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require("cors");

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var investmentsRouter = require('./routes/investments');
var fundsRouter = require('./routes/funds');
var kycRouter = require("./routes/kyc");
var authRouter = require("./routes/auth");

var app = express();

app.use(cors({
  origin: ["http://localhost:5173", "https://accounts.google.com"],
  credentials: true,
  methods: ["GET", "POST", "OPTIONS", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/', indexRouter);
app.use('/api/users', usersRouter);
app.use('/api/investments', investmentsRouter);
app.use('/api/funds', fundsRouter);
app.use('/api/kyc', kycRouter);
app.use("/api/auth", authRouter);

module.exports = app;