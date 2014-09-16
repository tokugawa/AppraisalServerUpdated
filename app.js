var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
//var logger = require('morgan');
var log4js = require('log4js');
var log = log4js.getLogger("app");
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cluster     = require('cluster');
var numCPUs = require('os').cpus().length;
var mongoose = require('mongoose');

conn = require('./util/ConnectDBInstance').getInstance();


log.info(numCPUs);

if(cluster.isMaster){

    for(var i=0 ; i< numCPUs ; i++){

        cluster.fork();

        cluster.on('exit', function exitWorkCb( worker, code, signal){

            log.info('worker' + worker.process.pid + 'died');

        });
    }
}
else {


var routes = require('./routes/index');
var users = require('./routes/users').list;
var user = require('./routes/checkUser');
var userCreate = require('./routes/CreateUser');
var order = require('./routes/getOrderListTemp');

var app = express();

app.set('port', process.env.PORT || 3000);


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
//app.use(logger('dev'));
app.use(log4js.connectLogger(log4js.getLogger("http"), { level: 'auto' }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);
app.get('/api/v1/checkUserCredential', user);
app.get('/api/v1/getOrderDetail', order);


app.post('/createUser', userCreate);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});



process.on('uncaughtException', function (){


    conn.close(function(){

        log.info('Conncection Ended due to uncaughtException');

        process.exit(0);

    });

});




    var server = app.listen(app.get('port'), function() {
      log.info('Express server listening on port ' + server.address().port);
    });

}


