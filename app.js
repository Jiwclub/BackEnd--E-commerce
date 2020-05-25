const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors')
const app = express();
const bodyParser = require('body-parser')

app.use(bodyParser.json());

/* CORS */

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', '*');
  res.header("Access-Control-Allow-Headers", "*");
  next();
});


// Import Routes

const productsRouter = require('./routes/products')
const orderRouter = require('./routes/orders')
// const authRouter = require('/routes/auth')
// const authRouter = require('./routes/auth')

// User Route
app.use('/api/orders', orderRouter);
app.use('/api/products',productsRouter);
// app.use('/api/auth', authRouter);



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', indexRouter);
// app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
