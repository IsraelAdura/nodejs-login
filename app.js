//Modules
var express = require('express'),
  path = require('path'),
  cookieParser = require('cookie-parser'),
  bodyParser = require('body-parser'),
  flash = require('connect-flash'),
  //bcrypt = require('bcryptjs'),
  session = require('express-session'),
  expressValidator = require('express-validator'),
  exphbs = require('express-handlebars'),
  passport = require('passport'),
  LocalStategy = require('passport-local').Strategy,
  mongo = require('mongodb'),
  mongoose = require('mongoose');

//database connection
mongoose.connect('mongodb://localhost/nodejslogin');
var db = mongoose.connection;

//routes
var index = require('./routes/index');
var users = require('./routes/users');

//initialize app
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({defaultLayout:'layout'}));
app.set('view engine', 'handlebars');

//bodyparser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

//app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Express Session
app.use(session({
  secret: 'secret',
  saveUninitialized: true,
  resave: true
}));

// catch 404 and forward to error handler
/*app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});*/

// Express Validator
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;
  
    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
  }));




// Passport init
app.use(passport.initialize());
app.use(passport.session());



// error handler
/*app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});*/
// Connect Flash
app.use(flash());

// Global Vars
app.use(function (req, res, next) {
res.locals.success_msg = req.flash('success_msg');
res.locals.error_msg = req.flash('error_msg');
res.locals.error = req.flash('error');
res.locals.user = req.user || null;
next();
});

app.use('/', index);
app.use('/users', users);

//set port
app.set('port', (process.env.PORT) || 8080);

//listen to port
app.listen(app.get('port'), function () {
  console.log('listening @ 8080')
})

module.exports = app;

