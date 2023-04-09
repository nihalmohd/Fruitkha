var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session=require('express-session');


var indexRouter = require('./routes/admin');
var usersRouter = require('./routes/users');

const hbs=require('express-handlebars')


var app = express();
var fileUpload=require('express-fileupload')



// view engine setup

app.engine('hbs',hbs.engine({extname:'hbs',defaultLayout:'layout',layoutsDir:__dirname+'/views/layout/',partialsDir:__dirname+'/views/partials/'}))
// app.engine('hbs',hbs.engine({extname:'hbs'}))
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
const hb=hbs.create({})
hb.handlebars.registerHelper('eq',function(a,b){
  return a==b
});

hb.handlebars.registerHelper('gte',function(a,b){
  return a>=b
});
app.use(session({secret:"key",resave: false, 
saveUninitialized: false,cookie:{maxAge:60000*60}}))

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(fileUpload())

app.use('/admin', indexRouter);
app.use('/', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
