console.log ("Loading app.js parts...");

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

const appRoot = require('app-root-path');
var index = require(appRoot+'/routes/index');
var users = require(appRoot+'/routes/users');
var screen = require (appRoot + '/modules/oled_display');
var periodic = require (appRoot + '/modules/periodic');
var oled = require(appRoot+'/routes/oled');
// var buttons = require(appRoot+'/modules/buttons')

//set up the screen and the shutdown handlers
//-----------------------------------------------------------------
// Global event handlers
function terminationHandler (options, err) {
	if (err) {
  		console.log ("\ntermination err: " + err); //this is a custom error object, not a standard one
  	}

	if (options.cleanup) {
		console.log ('Exiting...');
		//periodic.shutdown ();
		screen.shutdown ();
		process.exit();
	}

	if (options.exit) {
		console.log (`\n(Ctrl-C) server terminating.\n`);
		periodic.shutdown ();
		//screen.shutdown ();
		process.exit();
	}
}

// termination for any other reason
process.on ('exit', terminationHandler.bind (null, {cleanup: true}));

// control-C
process.on( 'SIGINT', terminationHandler.bind (null, {exit:true}));

var app = express();

console.log ("Setting up views...");

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
console.log ("...parsers...");
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

console.log ("...routes...");
app.use('/', index);
app.use('/users', users);
app.use('/oled', oled);

console.log ("...error handlers...");
// catch 404 and forward to error handler
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
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

// buttons.init(process.argv[2], process.argv[3]);
periodic.init ();

module.exports = app;
